tests/ui/          UI scenarios
tests/api/         API scenarios
# QA Automation Framework | Playwright & TypeScript

[![Playwright Tests](https://github.com/roaragonesc/playwright-automation-framework/actions/workflows/playwright.yml/badge.svg)](https://github.com/roaragonesc/playwright-automation-framework/actions/workflows/playwright.yml)

A Playwright Test and TypeScript framework for UI, API and end-to-end automation against the public [Automation Exercise](https://automationexercise.com/) practice site. It separates test scenarios, page interactions and test data, and supports local execution and GitHub Actions.

This repository is part of my QA Automation Engineer / SDET portfolio. It demonstrates maintainable test architecture, browser and API projects, externally managed data, Qase case linking and CI execution without presenting test discovery or compilation as proof that every scenario passes.

## Overview

The framework covers user-visible browser journeys and the site's documented API. UI interactions are encapsulated in Page Objects; Playwright fixtures provide those objects and validated JSON data to tests. API requests are kept in typed client classes, with assertions distinguishing HTTP status from the application's response code where applicable.

Smoke tests are a tagged subset of Regression. E2E scenarios belong to Regression rather than a separate E2E suite. The target is a public demo site, so its consent prompts, advertising interstitials and availability can affect results independently of the framework.

## Tech stack

| Technology | Use |
| --- | --- |
| Playwright Test 1.64.1 | UI/API test runner and browser projects (version from the lockfile) |
| TypeScript (`^5.7.0`) | Strictly typed tests, fixtures, clients and test-data utilities |
| Node.js 22 | Runtime selected by the GitHub Actions workflow |
| `dotenv` | Optional local `.env` loading |
| `playwright-qase-reporter` 2.7.0 | Qase TestOps reporting integration |
| GitHub Actions | Push, pull-request, scheduled and manual execution |
| GitHub Copilot custom agent | Repository-specific QA guidance in `.github/agents/` |

ESLint is not configured in this repository. No lint result is claimed.

## Key features

- UI tests run in the configured Chrome and Edge projects; API tests run in a separate project.
- Page Objects expose named `Locator` properties and reusable user actions.
- Typed UI/API fixtures compose existing Page Objects and API clients.
- JSON test data is loaded through a shared loader with `$ref`, JSON Pointer and environment-variable references, then validated by typed validators.
- AEQA-20 uses a portable attachment under `test-data/contact/` and Playwright's file-upload API.
- Tests are tagged `@smoke` and/or `@regression`; E2E cases are part of Regression.
- Qase-linked UI cases use their existing numeric IDs; the workflow supplies the Qase reporter environment.
- CI retains HTML/JUnit output and failure screenshots, video and traces as configured.

## Framework architecture

```text
.
├── .github/
│   ├── agents/qa-framework-engineer.agent.md
│   ├── copilot-instructions.md
│   └── workflows/playwright.yml
├── api/                         Typed API clients and response models
├── fixtures/                    UI, API and case-specific typed fixtures
├── pages/                       Base page and feature Page Objects
├── test-data/
│   ├── checkout/                 AEQA-19 purchase data
│   ├── contact/                  AEQA-20 data and contact-test.txt
│   ├── products/                 Reusable product selection data
│   ├── users/                    Reusable registered-user data
│   ├── loader.ts                 JSON, references and environment loading
│   ├── types.ts                  Test-data TypeScript interfaces
│   └── validation.ts             Runtime data validation
├── tests/
│   ├── api tests/
│   │   ├── regression/           Authentication, product and search cases
│   │   └── smoke/                 Product and brand availability
│   └── web tests/
│       ├── regression/
│       │   ├── cart/              AEQA-19 purchase journey
│       │   └── contact/           AEQA-20 contact form with attachment
│       └── smoke/                 Invalid-login scenario
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

The path names `web tests` and `api tests` contain spaces; they are intentional and are matched by `playwright.config.ts`.

### How the layers work together

Each `.spec.ts` expresses one case and its scenario-level assertions. It imports a typed fixture, which supplies Page Objects and/or loads case JSON through `test-data/loader.ts` and `validation.ts`. The Page Object performs UI actions through named locators; API tests call typed clients built on Playwright's `APIRequestContext`. The Playwright projects select UI or API tests, while GitHub Actions filters the selected suite by tag.

There is no separate `utils/` directory: shared test-data loading and validation live in `test-data/`.

## Test strategy

- **Smoke:** tests carrying `@smoke`; these are also tagged `@regression`, making Smoke a subset of Regression.
- **Regression:** all tests tagged `@regression`, including the E2E purchase and contact-form journeys.
- **Browser projects:** `ui-chrome` and `ui-edge` select `tests/web tests/**/*.spec.ts`.
- **API project:** `api` selects `tests/api tests/**/*.spec.ts` and does not launch a browser.
- **Isolation:** Playwright creates an isolated browser context for each test. AEQA-19 also prepares the server-side cart in a `beforeEach`; it uses one registered account across browser projects, so simultaneous cross-browser execution can still contend for that account's persistent cart.

The current inventory is 11 spec files: 3 UI and 8 API. Playwright discovers 14 executions because each UI spec is selected by both browser projects.

## Automated test coverage

Statuses below reflect observed local runs and current test-data state, not a claim that the latest GitHub Actions run passed.

| Test | Scenario | Type | Suite | Status |
| --- | --- | --- | --- | --- |
| UI-001 | Invalid login displays an error | UI | Smoke, Regression | Passed in a targeted Edge run; no current Chrome result recorded |
| AEQA-19 | Registered user completes a purchase | UI E2E | Regression | Implemented; expected address values in the reusable user JSON are still placeholders, so current validation blocks execution until they are replaced |
| AEQA-20 | Submit Contact Us form with a text attachment | UI E2E | Regression | Implemented; latest Chrome run failed on return Home when the public site redirected to `#google_vignette`; Edge not executed |
| API-001 | Products list is available | API | Smoke, Regression | Passed in the last API-only run (8/8 API tests) |
| API-002 | Brands list is available | API | Smoke, Regression | Passed in the last API-only run (8/8 API tests) |
| API-003 | Unsupported POST to products list | API | Regression | Passed in the last API-only run (8/8 API tests) |
| API-004 | Search without a parameter | API | Regression | Passed in the last API-only run (8/8 API tests) |
| API-005 | Login verification without email | API | Regression | Passed in the last API-only run (8/8 API tests) |
| API-006 | Login verification with invalid credentials | API | Regression | Passed in the last API-only run (8/8 API tests) |
| API-007 | Login verification with an empty email | API | Regression | Passed in the last API-only run (8/8 API tests) |
| API-008 | Search with a known term | API | Regression | Passed in the last API-only run (8/8 API tests) |

`AEQA-19` and `AEQA-20` use the Qase reporter wrapper with their existing IDs. API test names are local identifiers; the API specs do not currently use that Qase wrapper. A previous local Qase upload attempt returned `Unauthorized`, so successful result publication has not been verified.

## Getting started

### Prerequisites

- Node.js 22, matching the CI runtime.
- Git and npm.
- Chrome and Microsoft Edge for the UI projects. The API project does not require browser installation.

### Install

```bash
git clone https://github.com/roaragonesc/playwright-automation-framework.git
cd playwright-automation-framework
npm ci
npx playwright install chrome msedge
```

On GitHub Actions (Ubuntu), the workflow installs browser system dependencies with `npx playwright install --with-deps chrome msedge`.

### Configure local data

Copy `.env.example` to `.env` (PowerShell: `Copy-Item .env.example .env`). `.env` is excluded by `.gitignore`; never commit it.

AEQA-19 requires `E2E_TEST_USER_EMAIL` and `E2E_TEST_USER_PASSWORD` for an existing registered test account. Its expected first name, last name and delivery address are stored in `test-data/users/registered-e2e-user.json`. Replace every `REPLACE_WITH_...` value with the exact synthetic details registered on the demo site. The loader rejects placeholders rather than passing with incomplete data. These address fields are not GitHub variables or secrets.

AEQA-20 is unauthenticated and does not need credentials. Its form data and attachment definition are in `test-data/contact/AEQA-20.json`.

For local Qase publishing, use a valid `QASE_TESTOPS_API_TOKEN`; the example contains a placeholder and cannot authenticate. The GitHub workflow maps the repository secret `QASE_API_TOKEN` to the reporter's `QASE_TESTOPS_API_TOKEN` environment variable.

## Running tests

| Command | Runs |
| --- | --- |
| `npm test` | All discovered tests in Chrome, Edge and API projects |
| `npm run test:ui` | UI tests in Chrome and Edge |
| `npm run test:api` | API tests only |
| `npm run test:headed` | UI tests in headed Chrome and Edge |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test:report` | Opens the generated HTML report |
| `npx playwright test --grep "@smoke"` | Smoke-tagged tests across configured projects |
| `npx playwright test --grep "@regression"` | Regression-tagged tests across configured projects |

Run one case in one browser:

```bash
npx playwright test --project=ui-chrome --grep "AEQA-19"
npx playwright test --project=ui-edge --grep "AEQA-19"
npx playwright test --project=ui-chrome --grep "AEQA-20"
npx playwright test --project=ui-edge --grep "AEQA-20"
```

Quote `@smoke` and `@regression` when using PowerShell so the shell does not interpret `@` as syntax.

## CI/CD with GitHub Actions

The workflow is `.github/workflows/playwright.yml` and is triggered by:

- Pushes and pull requests targeting `main`, selecting Smoke.
- A nightly schedule, selecting Regression.
- `workflow_dispatch`, where the operator selects Smoke or Regression.

It uses Ubuntu and Node.js 22, runs `npm ci`, installs Chrome and Edge, then executes the selected tag across the configured browser and API projects. It uploads the HTML report and `test-results/` as artifacts for seven days. The workflow currently does **not** run `npm run typecheck`; typechecking is available locally through that script.

GitHub Actions receives `E2E_TEST_USER_EMAIL` and `E2E_TEST_USER_PASSWORD` from repository secrets, and `QASE_API_TOKEN` is passed to the reporter as `QASE_TESTOPS_API_TOKEN`. No secret values are stored in this repository. The badge above is a live indicator for the actual workflow, not a hard-coded success claim.

## Qase integration

The project includes `playwright-qase-reporter` 2.7.0 and the reporter in `playwright.config.ts`. UI specs for AEQA-19 and AEQA-20 use `test(qase(19, ...), ...)` and `test(qase(20, ...), ...)`, linking them to existing cases rather than creating browser-specific duplicates.

CI activates TestOps reporting with `QASE_MODE=testops`, project `AEQA`, and the `QASE_API_TOKEN` GitHub secret. Local `qase.config.json` is set to mode `off`; local publishing therefore requires valid reporter environment settings. Qase Test Plans are not used to select Playwright tests here: GitHub Actions chooses suites with `--grep` and `@smoke` / `@regression` tags.

## Playwright practices

- Page Objects hold named `Locator` properties and reusable interactions; scenario assertions remain in specs.
- Locators favour accessible roles and names, with stable `data-qa` or CSS selectors where the public site has no suitable semantic locator.
- Assertions use Playwright's retrying `expect` API; the tests do not use fixed `waitForTimeout()` sleeps.
- Dialog events are registered before their triggering action, including AEQA-20's confirmation dialog.
- Test-scoped fixtures, fresh browser contexts, JSON validation and failure traces support repeatable diagnosis.

The codebase still has a few `force: true` actions and positional locators in Page Objects; these are maintenance candidates, not recommended defaults. AEQA-19 uses one persistent demo account across browser projects, so its cart setup can contend if Chrome and Edge execute simultaneously.

## QA Framework Engineer agent

The existing [QA Framework Engineer custom agent](.github/agents/qa-framework-engineer.agent.md) supplies repository-specific guidance for test design, Qase, data management, debugging and CI. Select **QA Framework Engineer** from the agent picker in VS Code. It is an assistant for applying the framework's practices, not an automatic quality gate; compilation, linting and test results still need to be checked.

## Future improvements

- Replace the AEQA-19 address placeholders with the synthetic account's exact registered details, then re-verify both browsers.
- Investigate the public site's intermittent Google vignette affecting AEQA-20's Home navigation, without weakening the expected result.
- Isolate or serialise AEQA-19's shared account state to avoid Chrome/Edge cart contention.
- Add ESLint and compatible Playwright rules after approval, and include typechecking in CI.
- Verify a successful Qase result upload with an authorised token.

## Author

This repository is part of my QA Automation Engineer / SDET portfolio: [github.com/roaragonesc](https://github.com/roaragonesc).

## References

- [Automation Exercise test cases](https://automationexercise.com/test_cases)
- [Automation Exercise API documentation](https://automationexercise.com/api_list)
- [Playwright best practices](https://playwright.dev/docs/best-practices)
- [Playwright locators](https://playwright.dev/docs/locators)
- [Playwright assertions](https://playwright.dev/docs/test-assertions)
