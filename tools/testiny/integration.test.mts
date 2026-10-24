import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TestinyClient } from './client.mts';
import { automatedCases, resultStatuses, selectCases } from './results.mts';

function response(data: unknown): Response {
  return new Response(JSON.stringify(data), { status: 200 });
}

function page(data: unknown[], offset = 0, limit = 100): Response {
  return response({ data, meta: { count: data.length, offset, limit } });
}

function plan(type = 'TESTCASEFOLDER', folders: unknown[] = [{ id: null, includeDescendants: true }]) {
  return {
    id: 1, project_id: 1,
    testcase_query: { type, query: { folders } },
  };
}

function report(ids: number[], status = 'passed', expected = 'expected') {
  return {
    suites: [{
      specs: ids.map(id => ({
        file: `tests/web tests/regression/saucedemo/TC-${id}.spec.ts`,
        title: `TC-${id} login`,
        tests: [{
          annotations: [
            { type: 'testiny-case-id', description: String(id) },
            { type: 'testiny-project-id', description: '1' },
          ],
          status: expected, results: [{ status }],
        }],
      })),
    }],
  };
}

test('folder plan includes no-folder cases, not cases in another folder or duplicate rows', async () => {
  const transport: typeof fetch = async (url, init) => {
    assert.equal(new Headers(init?.headers).get('X-Api-Key'), 'unit-test-key');
    if (String(url).includes('/testplan/find')) return page([plan()]);
    return page([
      { id: 1, project_id: 1, testcase_folder_testcase_values: null },
      { id: 1, project_id: 1, testcase_folder_testcase_values: null },
      { id: 2, project_id: 1, testcase_folder_testcase_values: { testcase_folder_id: 9 } },
    ]);
  };
  assert.deepEqual(await new TestinyClient('unit-test-key', transport).planCases(1, 1), [1]);
});

test('folder selection expands descendants but does not select siblings', async () => {
  const transport: typeof fetch = async url => {
    if (String(url).includes('/testplan/find')) return page([plan('TESTCASEFOLDER', [
      { id: 2, includeDescendants: true },
    ])]);
    if (String(url).includes('/testcase-folder/')) return page([
      { id: 2, testcase_folder_parent_id: 0 },
      { id: 3, testcase_folder_parent_id: 2 },
      { id: 4, testcase_folder_parent_id: 3 },
      { id: 5, testcase_folder_parent_id: 0 },
    ]);
    return page([2, 3, 4, 5].map(id => ({
      id, project_id: 1, testcase_folder_testcase_values: { testcase_folder_id: id },
    })));
  };
  assert.deepEqual(await new TestinyClient('unit-test-key', transport).planCases(1, 1), [2, 3, 4]);
});

test('unsupported plan selectors fail rather than executing a partial plan', async () => {
  const transport: typeof fetch = async () => page([plan('CONDITION')]);
  await assert.rejects(new TestinyClient('unit-test-key', transport).planCases(1, 1), /Unsupported/);
});

test('wrong project and empty plans fail explicitly', async () => {
  const wrong: typeof fetch = async () => page([{ ...plan(), project_id: 2 }]);
  await assert.rejects(new TestinyClient('unit-test-key', wrong).planCases(1, 1), /project/);
  const empty: typeof fetch = async () => page([]);
  await assert.rejects(new TestinyClient('unit-test-key', empty).planCases(1, 1), /empty/);
});

test('find follows the server page limit, including an exact full page', async () => {
  const offsets: number[] = [];
  const transport: typeof fetch = async (_url, init) => {
    const body = JSON.parse(String(init?.body));
    offsets.push(body.pagination.offset);
    return page(body.pagination.offset < 2 ? [{ id: body.pagination.offset + 1 }] : [],
      body.pagination.offset, 1);
  };
  assert.equal((await new TestinyClient('unit-test-key', transport).find('testcase', {})).length, 2);
  assert.deepEqual(offsets, [0, 1, 2]);
});

test('HTTP failures never expose response bodies or API keys', async () => {
  const transport: typeof fetch = async () => new Response('private content', { status: 403 });
  await assert.rejects(new TestinyClient('unit-test-key', transport).planCases(1, 1),
    error => error instanceof Error && /HTTP 403/.test(error.message) &&
      !/private content|unit-test-key/.test(error.message));
});

test('missing and duplicate automation IDs fail before running anything', () => {
  const available = automatedCases(report([1]), 1);
  assert.throws(() => selectCases([1, 2], available), /TC-2 has no automation/);
  assert.throws(() => automatedCases(report([1, 1]), 1), /Duplicate/);
  assert.deepEqual(selectCases([1], available).map(item => item.id), [1]);
});

test('case identity includes Testiny project, not just the numeric ID', () => {
  assert.deepEqual(automatedCases(report([1]), 2), []);
});

test('passed, failed, flaky, skipped and missing results map without false passes', () => {
  assert.equal(resultStatuses([1], report([1]), 1).get(1), 'PASSED');
  assert.equal(resultStatuses([1], report([1], 'timedOut', 'unexpected'), 1).get(1), 'FAILED');
  assert.equal(resultStatuses([1], report([1], 'passed', 'flaky'), 1).get(1), 'FAILED');
  assert.equal(resultStatuses([1], report([1], 'skipped', 'skipped'), 1).get(1), 'SKIPPED');
  assert.equal(resultStatuses([1, 2], report([1]), 1).get(2), 'BLOCKED');
  assert.throws(() => resultStatuses([1], report([1, 2]), 1), /outside the plan/);
});

test('creation associates the run with the existing project and plan', async () => {
  const transport: typeof fetch = async (url, init) => {
    assert.equal(String(url), 'https://app.testiny.io/api/v1/testrun');
    const body = JSON.parse(String(init?.body));
    assert.equal(body.project_id, 1);
    assert.equal(body.testplan_id, 1);
    return response({ id: 9, project_id: 1, testplan_id: 1 });
  };
  assert.equal(await new TestinyClient('unit-test-key', transport).createRun(1, 1, 'CI run', 'Build link'), 9);
});

test('publication uses existing case mappings and verifies persisted result states', async () => {
  const transport: typeof fetch = async (url, init) => {
    if (String(url).includes('/mapping/bulk/testcase')) {
      assert.deepEqual(JSON.parse(String(init?.body)), [
        { ids: { testrun_id: 9, testcase_id: 1 }, mapped: { result_status: 'PASSED', assigned_to: 'ANY' } },
      ]);
      return new Response(null, { status: 204 });
    }
    return page([{ id: 1, testrun_testcase_values: { result_status: 'PASSED' } }]);
  };
  await new TestinyClient('unit-test-key', transport).publish(1, 9, new Map([[1, 'PASSED']]));
});

test('publication fails if the server does not persist the expected result', async () => {
  const transport: typeof fetch = async url => String(url).includes('/mapping/')
    ? new Response(null, { status: 204 })
    : page([{ id: 1, testrun_testcase_values: { result_status: 'FAILED' } }]);
  await assert.rejects(new TestinyClient('unit-test-key', transport)
    .publish(1, 9, new Map([[1, 'PASSED']])), /verification failed/);
});
