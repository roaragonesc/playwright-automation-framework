# Playwright Automation Framework

[![Playwright Tests](https://github.com/OWNER/playwright-automation-framework/actions/workflows/playwright.yml/badge.svg)](https://github.com/OWNER/playwright-automation-framework/actions/workflows/playwright.yml)

A portfolio-ready **TypeScript + Playwright** automation framework for [Automation Exercise](https://automationexercise.com/). It demonstrates **UI testing with Page Object Model (POM)**, **API testing with reusable client classes**, fixtures, reporting, and CI with GitHub Actions.

> Replace `OWNER` in the badge with your GitHub username once published. This starter is not yet verified against the live public website. Qase integration is planned, **not yet implemented**.

## Tech stack

- Playwright Test + TypeScript
- Page Object Model for UI and API client pattern for HTTP endpoints
- Playwright fixtures for dependency injection
- HTML and JUnit reports; screenshots, videos and traces on failure
- GitHub Actions for continuous integration

## Getting started

See **[SETUP.md](SETUP.md)** for a Windows/VS Code walkthrough, including GitHub publishing, troubleshooting, and optional Qase setup.

```powershell
npm install
npx playwright install chromium
npm run typecheck
npm run test:ui
npm run test:api
```

## Test commands

| Command | Purpose |
| --- | --- |
| `npm test` | Run all UI and API tests |
| `npm run test:ui` | Run UI tests in Chromium |
| `npm run test:api` | Run API tests |
| `npm run test:headed` | Run UI tests with browser visible |
| `npm run test:report` | Open HTML report |
| `npm run typecheck` | TypeScript type check |

## Architecture

```text
pages/             UI page objects (selectors + actions)
api/               Typed API clients and response models
fixtures/          Playwright fixture injection
tests/ui/          UI scenarios
tests/api/         API scenarios
.github/workflows/ GitHub Actions CI
playwright.config.ts
SETUP.md            Setup and configuration guide
```

## Coverage (starter)

**UI:** product search and invalid login. **API:** list products, list brands, unsupported method, missing search parameter, missing login email, invalid login. Eight example tests in total.

API responses may carry an application-level `responseCode` different from the HTTP status. The tests distinguish these. Public demo site availability, ads and bot protections may cause intermittent failures.

## Next improvements

- Add checkout/cart POM flows and more negative/edge cases.
- Add test data factories, schema validation and cross-browser execution.
- Connect Qase Free with a reporter and securely configured API token.
- Replace badge placeholder, add verified execution evidence and screenshots.

## Reference

- [UI test cases](https://automationexercise.com/test_cases)
- [API documentation](https://automationexercise.com/api_list)
- [Playwright docs](https://playwright.dev/docs/intro)
