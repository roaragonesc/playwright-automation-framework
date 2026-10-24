# Testiny plan execution

The [Testiny workflow](../../.github/workflows/testiny.yml) runs plan TP-1 in project 1
daily at **01:30 UTC**, manually through `workflow_dispatch`, and for relevant same-repository
pull requests. Scheduled runs require the workflow on the default branch. Opening a PR does
not activate the daily schedule; merge is a separate, explicitly approved action.

## Required configuration

GitHub repository Secrets:

- `TESTINY_API_KEY`: project-scoped Testiny key with **Run Manager** permissions to read
  cases/plans and create/update runs. An Automation Importer or Run Executor key does not
  provide the same run-management permissions. Prefer an expiry and rotate before it expires.
- `SAUCEDEMO_PASSWORD`: the demo account password specified in TC-1.

The workflow sets `TESTINY_PROJECT_ID=1`, `TESTINY_PLAN_ID=1` and
`TESTINY_PLAYWRIGHT_PROJECT=ui-chrome`. It does not change Qase credentials.
Node 22.18+ is required for native TypeScript execution; no Testiny CLI dependency is needed.

For local execution, set these variables in the environment or ignored `.env` and run:

```powershell
npm run typecheck
npm run test:testiny
npm run testiny:run-plan
```

The last command creates a **real remote test run** and publishes results.
Unit tests use an injected fake HTTP transport and perform no remote writes.

## Selection and publication contract

1. Fetch the live plan and its mapped queries using the documented REST API.
2. Resolve folder selectors, including no-folder and descendant-folder selections. Paginate
   all API reads and deduplicate case IDs. Unsupported query types or definitions fail
   explicitly before execution; conditions and static-list query types are not implemented.
3. Discover Playwright cases for the requested browser. Each automated spec must have one
   test and the numeric `testiny-project-id` and `testiny-case-id` annotations.
4. Require automation for **every** selected plan case. A missing/duplicate mapping fails
   before creating a remote run or executing a partial plan.
5. Create a run associated with the existing project and plan; never create duplicate test
   cases or edit their definitions. Store its URL under ignored `test-results/testiny/`.
6. Initialize the selected cases as BLOCKED, execute only the matching files/titles, then
   publish PASSED, FAILED, SKIPPED or BLOCKED through testcase/testrun mappings. Read results
   back to verify persistence. Unexpected/flaky passes are not reported as PASSED.
7. Preserve a failing exit code for test, discovery, API or publication errors. An interrupted
   execution or missing report cannot become a pass; initialized results remain BLOCKED.

The runner publishes case-level status, not individual step results. It links the GitHub
build in the run description and step summary, but does not upload screenshots, raw errors,
passwords or traces to Testiny. Local JSON/artifacts are retained in GitHub for seven days.
Runs remain open for inspection; they are not automatically closed or deleted.

Only cases currently in the remote plan are selected. Adding a case to a folder selected
by TP-1 therefore requires a matching automated spec before the next daily run.
Product-specific POMs and fixtures determine each application's URL; the shared plan runner
does not hardcode SauceDemo selectors, account data or business rules.

## Official contracts

- [REST API quickstart](https://www.testiny.io/docs/api-quickstart/)
- [OpenAPI specification](https://app.testiny.io/api/v1/swagger.json)
- [API key scopes](https://www.testiny.io/docs/settings/api-keys/)
- [Roles and permissions](https://www.testiny.io/docs/settings/user-management/#roles-and-permissions)

The official automation CLI imports into a separate Automation area and does not
automatically link manual cases. This integration deliberately uses the manual plan/run
REST API so results belong to the existing TC-1 and TP-1.
