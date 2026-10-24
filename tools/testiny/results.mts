import { positiveId, record, type JsonRecord, type CaseStatus } from './client.mts';

export interface AutomatedCase {
  id: number;
  file: string;
  title: string;
  test: JsonRecord;
}

export function automatedCases(report: unknown, projectId: number): AutomatedCase[] {
  const cases: AutomatedCase[] = [];
  const reportObject = record(report, 'Playwright report');
  function visit(value: unknown): void {
    const suite = record(value, 'suite');
    if (!Array.isArray(suite.specs) || (suite.suites !== undefined && !Array.isArray(suite.suites))) {
      throw new Error('[Testiny] Invalid Playwright suite.');
    }
    for (const value of suite.specs) {
      const spec = record(value, 'spec');
      if (!Array.isArray(spec.tests)) throw new Error('[Testiny] Invalid spec tests.');
      for (const value of spec.tests) {
        const test = record(value, 'test');
        if (!Array.isArray(test.annotations)) throw new Error('[Testiny] Missing test annotations.');
        const annotations = test.annotations.map((item: unknown) => record(item, 'annotation'));
        const caseAnnotations = annotations.filter(item => item.type === 'testiny-case-id');
        if (!caseAnnotations.length) continue;
        const projectAnnotations = annotations.filter(item => item.type === 'testiny-project-id');
        if (caseAnnotations.length !== 1 || projectAnnotations.length !== 1) {
          throw new Error('[Testiny] Each automated case needs one case ID and one project ID.');
        }
        const annotatedProject = positiveId(Number(projectAnnotations[0].description), 'annotation project ID');
        if (annotatedProject !== projectId) continue;
        if (spec.tests.length !== 1 || typeof spec.file !== 'string' || typeof spec.title !== 'string') {
          throw new Error('[Testiny] Use one case per spec and one browser per run.');
        }
        cases.push({
          id: positiveId(Number(caseAnnotations[0].description), 'annotation case ID'),
          file: spec.file, title: spec.title, test,
        });
      }
    }
    if (Array.isArray(suite.suites)) suite.suites.forEach(visit);
  }
  if (!Array.isArray(reportObject.suites)) throw new Error('[Testiny] Missing report suites.');
  reportObject.suites.forEach(visit);
  if (new Set(cases.map(item => item.id)).size !== cases.length) {
    throw new Error('[Testiny] Duplicate automated case IDs.');
  }
  return cases;
}

export function selectCases(ids: number[], cases: AutomatedCase[]): AutomatedCase[] {
  const selected = ids.map(id => {
    const testcase = cases.find(item => item.id === id);
    if (!testcase) throw new Error(`[Testiny] TC-${id} has no automation. No tests executed.`);
    return testcase;
  });
  if (!selected.length) throw new Error('[Testiny] Refusing to execute an empty plan.');
  return selected;
}

export function resultStatuses(ids: number[], report: unknown, projectId: number): Map<number, CaseStatus> {
  const cases = automatedCases(report, projectId);
  if (cases.some(item => !ids.includes(item.id))) throw new Error('[Testiny] Report includes cases outside the plan.');
  const statuses = new Map<number, CaseStatus>();
  for (const id of ids) {
    const testcase = cases.find(item => item.id === id);
    if (!testcase) {
      statuses.set(id, 'BLOCKED');
      continue;
    }
    const results = testcase.test.results;
    if (!Array.isArray(results) || !results.length) {
      statuses.set(id, 'BLOCKED');
      continue;
    }
    const final = record(results[results.length - 1], 'test result');
    statuses.set(id, final.status === 'skipped' ? 'SKIPPED' :
      final.status === 'passed' && testcase.test.status === 'expected' ? 'PASSED' : 'FAILED');
  }
  return statuses;
}

export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
