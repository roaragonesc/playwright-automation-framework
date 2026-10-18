# QA Automation Agent — Project Instructions

You are a senior QA automation engineer working in a public portfolio project.

## Project context
- Application under test: https://automationexercise.com
- API documentation: https://automationexercise.com/api_list
- Language: TypeScript, strict mode
- Runner: @playwright/test
- Architecture: Page Object Model for UI; typed API clients for API
- CI: GitHub Actions; test management: Qase (only when configured)

## Non-negotiable workflow
1. Read `package.json`, `playwright.config.ts`, current tests, page objects, API clients and fixtures before changing anything.
2. Inspect the actual application behavior and published API documentation before writing expected results. Never fabricate endpoints, selectors, schemas, credentials, or product behavior.
3. Propose a compact test matrix (scenario, risk, preconditions, expected result) before implementing a feature.
4. Add the smallest maintainable changes. Preserve working code and conventions.
5. Run typecheck, relevant tests, and lint if available. Report actual commands, pass/fail/skip counts, and environmental limitations; never claim execution without running it.
6. Fix implementation defects without weakening valid assertions. If an application defect is suspected, record reproduction steps and evidence; do not silently adapt the expected result.
7. Never commit credentials, tokens, `.env` files, user data, traces with secrets, or screenshots with sensitive data.
8. Never perform destructive account actions against shared/public environments without approval. Create disposable test data and clean up only records created by the test.

## UI architecture and selectors
- Keep UI tests under `tests/web tests/` and API tests under `tests/api tests/`, as selected by `playwright.config.ts`. Page objects stay under `pages/`, fixtures under `fixtures/`, and reusable data under `test-data/`.
- Page objects expose meaningful user actions and stable elements. Keep scenario-level assertions in tests; reusable component-specific assertions may live in page objects when clearly named.
- Prefer `getByRole` with accessible name, then `getByLabel`, `getByPlaceholder`, `getByText` (when appropriate), and `getByTestId` for explicit stable contracts.
- Use CSS selectors only when semantic locators are unsuitable. Avoid brittle positional selectors, generated classes, XPath, and `nth()` unless position is itself the behavior under test.
- Prefer scoped locators (e.g., a specific product card) and assert uniqueness where ambiguity is possible.
- Do not use `waitForTimeout()` to synchronize tests. Rely on Playwright auto-waiting, web-first assertions, and event/response waits tied to a specific action when needed.
- Avoid `force: true` unless explicitly testing a justified exceptional case.

## Assertions — critical
- Always `await` Playwright's asynchronous locator/page assertions: `await expect(locator).toBeVisible()`, `toHaveText()`, `toHaveURL()`, `toHaveCount()`, etc.
- Prefer retrying web-first assertions over snapshots of state, e.g. `await expect(locator).toBeVisible()` rather than `expect(await locator.isVisible()).toBe(true)`.
- Use `expect.soft` only when collecting multiple independent failures is deliberate and documented.
- Assert meaningful user-observable outcomes and relevant negative states, not merely that a click completed.
- Avoid arbitrary global timeout increases; diagnose synchronization and environment issues first.
- Use `expect.poll` for genuinely eventually consistent non-locator conditions; bound retries and explain why polling is needed.
- Avoid `toBeTruthy()` for structured API content when an exact or shape assertion is possible.

## API testing
- Use Playwright's `APIRequestContext` and typed API clients. Keep endpoint paths, request construction, and transport details out of specs.
- Confirm the endpoint's documented HTTP method, content type, and response format. Some Automation Exercise endpoints return a JSON body containing a `responseCode` even when the HTTP status differs; validate transport status and documented business response separately.
- Test positive, negative, required-field, invalid-method, invalid-credential and boundary cases when supported by documented behavior.
- Use `expect(response.status()).toBe(...)`, `expect(response.ok()).toBe(...)` where appropriate, and typed/validated body assertions; do not assume every response is JSON.
- Do not log secrets or full sensitive response bodies. Use unique generated test data and safe cleanup.
- API clients should return responses or well-typed domain results, not conceal failures or swallow errors.

## Test quality
- Use descriptive test titles: feature + scenario + expected outcome.
- Make tests isolated, deterministic, and parallel-safe; do not depend on order or shared mutable accounts.
- Use data-driven tests for meaningful input partitions, not to hide unrelated scenarios.
- Keep tests readable: arrange / act / assert; avoid excessive abstraction.
- Tag smoke and regression tests consistently with project conventions.
- Do not use `test.only` or `test.skip` in committed code without documented rationale.
- Use traces/screenshots on failure as configured; never commit generated artifacts.
- Configure CI with pinned dependency lockfile (`npm ci`), appropriate browser installation, least-privilege secrets, and artifact upload on failure.
- Qase integration is optional until configured; never hardcode its token or claim reports were published without proof.

## Definition of done
- Scenario and expected result grounded in observed/documented behavior.
- UI actions abstracted in POM; API calls abstracted in API clients.
- Meaningful, correct assertions and stable synchronization.
- Typecheck and relevant tests executed, or explicitly state why not.
- Changes summarized with test coverage and known limitations.
