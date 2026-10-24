import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import 'dotenv/config';
import { TestinyClient, positiveId, type CaseStatus } from './client.mts';
import { automatedCases, escapeRegex, resultStatuses, selectCases } from './results.mts';

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value || /^(REPLACE_WITH|__|<)/i.test(value)) {
    throw new Error(`[Testiny] Configure ${name} before running the plan.`);
  }
  return value;
}

async function main(): Promise<void> {
  const client = new TestinyClient(required('TESTINY_API_KEY'));
  const projectId = positiveId(Number(required('TESTINY_PROJECT_ID')), 'project ID');
  const planId = positiveId(Number(required('TESTINY_PLAN_ID')), 'plan ID');
  const browserProject = required('TESTINY_PLAYWRIGHT_PROJECT');
  const cli = createRequire(import.meta.url).resolve('@playwright/test/cli');
  const ids = await client.planCases(projectId, planId);
  const env = { ...process.env, QASE_MODE: 'off', PLAYWRIGHT_JSON_OUTPUT_NAME: '' };
  const discovery = spawnSync(process.execPath, [
    cli, 'test', '--list', `--project=${browserProject}`, '--reporter=json',
  ], { env, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  if (discovery.error) throw discovery.error;
  if (discovery.status !== 0) throw new Error('[Testiny] Playwright discovery failed. No run created.');
  const selected = selectCases(ids, automatedCases(JSON.parse(discovery.stdout) as unknown, projectId));
  const output = resolve('test-results', 'testiny');
  await mkdir(output, { recursive: true });
  const reportPath = resolve(output, 'playwright.json');
  const files = [...new Set(selected.map(item => escapeRegex(item.file.replaceAll('\\', '/'))))];
  const titles = selected.map(item => `${escapeRegex(item.title)}$`).join('|');
  const execution = process.env.GITHUB_RUN_ID
    ? `${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT ?? '1'}`
    : new Date().toISOString();
  const buildUrl = process.env.GITHUB_RUN_ID
    ? `${required('GITHUB_SERVER_URL')}/${required('GITHUB_REPOSITORY')}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : 'Local execution';
  const runId = await client.createRun(projectId, planId,
    `TP-${planId} ${browserProject} ${execution}`.slice(0, 200),
    `<!--markdown-->\n${buildUrl}\n\nCases: ${ids.map(id => `TC-${id}`).join(', ')}`);
  const runUrl = `https://app.testiny.io/p/${projectId}/testruns/tr/${runId}`;
  console.log(`[Testiny] Created ${runUrl}; selected ${ids.map(id => `TC-${id}`).join(', ')}.`);
  await writeFile(resolve(output, 'run.json'), JSON.stringify({ projectId, planId, runId, runUrl, ids }, null, 2));
  await client.publish(projectId, runId, new Map(ids.map(id => [id, 'BLOCKED' as CaseStatus])));
  const run = spawnSync(process.execPath, [
    cli, 'test', ...files, `--project=${browserProject}`, '--grep', titles,
    '--workers=1', '--retries=0', '--reporter=list,json', '--output=test-results/testiny/artifacts',
  ], { env: { ...env, PLAYWRIGHT_JSON_OUTPUT_NAME: reportPath }, stdio: 'inherit' });
  if (run.error) throw run.error;
  // Malformed/missing reports leave the initialized cases BLOCKED, never passed.
  const report: unknown = JSON.parse(await readFile(reportPath, 'utf8'));
  const statuses = resultStatuses(ids, report, projectId);
  await client.publish(projectId, runId, statuses);
  console.log(`[Testiny] Verified persisted results in ${runUrl}.`);
  if (process.env.GITHUB_STEP_SUMMARY) {
    await writeFile(process.env.GITHUB_STEP_SUMMARY,
      `## Testiny TP-${planId}\n\n[View execution](${runUrl})\n\n` +
      [...statuses].map(([id, status]) => `- TC-${id}: ${status}`).join('\n') + '\n',
      { flag: 'a' });
  }
  if (run.status !== 0 || [...statuses.values()].some(status => status !== 'PASSED')) {
    throw new Error('[Testiny] Results published, but the plan did not pass completely.');
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : '[Testiny] Unknown integration failure.');
  process.exitCode = 1;
});
