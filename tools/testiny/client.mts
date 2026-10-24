export type JsonRecord = Record<string, unknown>;
export type CaseStatus = 'PASSED' | 'FAILED' | 'SKIPPED' | 'BLOCKED';

export function record(value: unknown, context: string): JsonRecord {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`[Testiny] Invalid ${context}: expected an object.`);
  }
  return value as JsonRecord;
}

export function positiveId(value: unknown, context: string): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`[Testiny] Invalid ${context}: expected a positive integer.`);
  }
  return value;
}

export class TestinyClient {
  private readonly apiKey: string;
  private readonly transport: typeof fetch;

  constructor(apiKey: string, transport: typeof fetch = fetch) {
    if (!apiKey.trim()) throw new Error('[Testiny] TESTINY_API_KEY is required.');
    this.apiKey = apiKey;
    this.transport = transport;
  }

  private async request(path: string, body?: unknown): Promise<unknown> {
    const response = await this.transport(`https://app.testiny.io/api/v1${path}`, {
      method: body === undefined ? 'GET' : 'POST',
      headers: { 'X-Api-Key': this.apiKey, 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(30_000),
      redirect: 'error',
    });
    if (!response.ok) {
      // Response bodies may contain private case content or echoed request values.
      throw new Error(`[Testiny] ${path} failed with HTTP ${response.status}.`);
    }
    if (response.status === 204) return undefined;
    const text = await response.text();
    return text ? JSON.parse(text) as unknown : undefined;
  }

  async find(entity: string, params: JsonRecord): Promise<JsonRecord[]> {
    const items: JsonRecord[] = [];
    let offset = 0;
    for (;;) {
      const result = record(await this.request(`/${entity}/find`, {
        ...params, pagination: { offset, limit: 100 },
      }), `${entity} response`);
      const meta = record(result.meta, `${entity} pagination`);
      if (!Array.isArray(result.data) || meta.offset !== offset ||
          meta.count !== result.data.length) {
        throw new Error(`[Testiny] Invalid ${entity} pagination response.`);
      }
      const limit = meta.limit === undefined ? 100 : positiveId(meta.limit, 'page limit');
      const rows = result.data.map((item: unknown) => record(item, entity));
      items.push(...rows);
      if (rows.length < limit) return items;
      offset += rows.length;
    }
  }

  async planCases(projectId: number, planId: number): Promise<number[]> {
    const plans = await this.find('testplan', {
      id: planId,
      filter: { project_id: projectId },
      map: { entities: ['testplan', 'testcase_query'], result: 'testcase_query' },
      omitLargeValues: false,
    });
    if (!plans.length) throw new Error('[Testiny] Plan missing, empty or inaccessible.');

    const selections: Array<{ id: number | null; descendants: boolean }> = [];
    for (const plan of plans) {
      if (plan.id !== planId || plan.project_id !== projectId) {
        throw new Error('[Testiny] Plan does not belong to the requested project.');
      }
      const query = record(plan.testcase_query, 'plan query');
      if (query.type !== 'TESTCASEFOLDER') {
        throw new Error(`[Testiny] Unsupported plan query type: ${String(query.type)}. No tests executed.`);
      }
      const definition = record(query.query, 'folder query');
      if (Object.keys(definition).some(key => key !== 'folders') ||
          !Array.isArray(definition.folders) || !definition.folders.length) {
        throw new Error('[Testiny] Unsupported or empty folder query. No tests executed.');
      }
      for (const value of definition.folders) {
        const folder = record(value, 'selected folder');
        if (typeof folder.includeDescendants !== 'boolean') {
          throw new Error('[Testiny] Folder query must explicitly define includeDescendants.');
        }
        selections.push({
          id: folder.id === null ? null : positiveId(folder.id, 'selected folder ID'),
          descendants: folder.includeDescendants,
        });
      }
    }

    const folderIds = new Set(selections.filter(item => item.id !== null).map(item => item.id));
    if (selections.some(item => item.id !== null && item.descendants)) {
      const folders = await this.find('testcase-folder', { filter: { project_id: projectId } });
      const descendants = new Set(selections
        .filter(item => item.id !== null && item.descendants).map(item => item.id));
      let changed = true;
      while (changed) {
        changed = false;
        for (const folder of folders) {
          const id = positiveId(folder.id, 'folder ID');
          const parent = folder.testcase_folder_parent_id;
          if (typeof parent === 'number' && descendants.has(parent) && !descendants.has(id)) {
            descendants.add(id);
            folderIds.add(id);
            changed = true;
          }
        }
      }
    }

    const cases = await this.find('testcase', {
      filter: { project_id: projectId },
      map: { entities: ['testcase', 'testcase_folder'], optional: true },
    });
    const ids = new Set<number>();
    for (const testcase of cases) {
      if (testcase.project_id !== projectId) throw new Error('[Testiny] Case project mismatch.');
      const mapping = testcase.testcase_folder_testcase_values;
      const folderId = mapping === null ? null :
        positiveId(record(mapping, 'case folder mapping').testcase_folder_id, 'case folder ID');
      if (folderId === null ? selections.some(item => item.id === null) : folderIds.has(folderId)) {
        ids.add(positiveId(testcase.id, 'case ID'));
      }
    }
    if (!ids.size) throw new Error('[Testiny] Plan contains no executable cases.');
    return [...ids].sort((a, b) => a - b);
  }

  async createRun(projectId: number, planId: number, title: string, description: string): Promise<number> {
    const run = record(await this.request('/testrun', {
      project_id: projectId, testplan_id: planId, title, description, _etag: '',
    }), 'created run');
    if (run.project_id !== projectId || run.testplan_id !== planId) {
      throw new Error('[Testiny] Created run has an unexpected project or plan.');
    }
    return positiveId(run.id, 'created run ID');
  }

  async publish(projectId: number, runId: number, statuses: ReadonlyMap<number, CaseStatus>): Promise<void> {
    if (!statuses.size) throw new Error('[Testiny] Refusing to publish empty results.');
    await this.request('/testrun/mapping/bulk/testcase?op=add_or_update',
      [...statuses].map(([caseId, status]) => ({
        ids: { testrun_id: runId, testcase_id: caseId },
        mapped: { result_status: status, assigned_to: 'ANY' },
      })));
    const saved = await this.find('testcase', {
      filter: { project_id: projectId },
      map: { entities: ['testcase', 'testrun'], filter: { testrun_id: runId } },
    });
    if (saved.length !== statuses.size) throw new Error('[Testiny] Published result count mismatch.');
    for (const testcase of saved) {
      const mapping = record(testcase.testrun_testcase_values, 'saved result');
      if (statuses.get(positiveId(testcase.id, 'saved case ID')) !== mapping.result_status) {
        throw new Error('[Testiny] Published result verification failed.');
      }
    }
  }
}
