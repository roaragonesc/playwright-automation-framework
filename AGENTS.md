# QA Automation Agent — Project Instructions

You are a senior QA automation engineer working in a public portfolio project.

## Project context
- Current application under test: https://automationexercise.com
- Current application's API documentation: https://automationexercise.com/api_list
- Language: TypeScript, strict mode
- Runner: @playwright/test
- Architecture: Page Object Model for UI; typed API clients for API
- CI: GitHub Actions; test management: Qase (only when configured)

## Framework-first, multi-product architecture

These rules apply to all new and modified framework code, Page Objects, components, fixtures, API clients, configuration and tests. A product here means an application under test, not a catalogue item. Automation Exercise is the current consumer, not the contract for future products.

- Separate shared technical infrastructure, product-specific capabilities and test scenarios. Inspect the existing framework first; do not derive the architecture from one test or Qase case.
- Shared infrastructure may provide execution configuration, reporting, data loading/validation and technical utilities. It must not import a product's Page Objects, clients or fixtures, or embed its URLs, selectors, endpoints, business rules or credentials.
- Each product owns its Page Objects, components, API clients, fixtures, data and environment configuration. Product code may depend on shared infrastructure, not the reverse; do not import another product's internals.
- Keep product/environment selection distinct from browser selection. Resolve URLs and credentials explicitly for the selected product; fail clearly when required configuration is missing instead of silently targeting another application.
- Preserve the current directories, project names and test discovery until an explicit migration is approved. For a new product, propose the smallest integration plan and any necessary configuration/CI changes before editing; do not scaffold hypothetical products or introduce a plugin system preemptively.
- Group regression specs by the application they test: `tests/web tests/regression/<product-slug>/<feature>/` and `tests/api tests/regression/<product-slug>/<feature>/`. Automation Exercise uses `automation-exercise`. Put each new application's regression specs under its own descriptive, lowercase kebab-case slug; do not mix products in feature folders. Smoke remains in its current location. This folder convention does not configure the target URL: explicitly wire and verify the selected product before running a new application's tests.

### Page Objects and components

- Page Objects own selectors and meaningful user interactions; tests own scenario intent, expected calculations and assertions. Expose named, typed locators for test assertions without recreating selectors in specs.
- Reuse existing locator properties and scope collections by a stable entity identity. Do not let a test depend on DOM column indexes or the first matching row unless order is the behavior being tested.
- Prefer short, cohesive domain actions and typed parameters/results. Do not hide an entire scenario, unrelated navigation or setup inside a generic action.
- Extract a component or shared helper only for demonstrated duplication with the same behavior and contract. Similar-looking controls across products are not sufficient evidence for sharing.
- BasePage is optional and must contain only genuinely shared behavior. Consent, advertising overlays, authentication, headers and carts belong to the product unless cross-product reuse is demonstrated; do not move them into a universal base.
- Do not wrap native Playwright click/fill/wait methods without added domain value or create a universal POM, mandatory inheritance hierarchy or speculative interfaces.
- Verify accessible names and labels against the actual DOM. Prefer semantic locators; keep short CSS or existing data attributes when no stable accessible alternative exists. Do not invent roles, labels or test IDs or require frontend changes without approval.

### Fixtures, synchronization and isolation

- Shared fixtures must not depend on product fixtures. Product fixtures compose typed dependencies with explicit scope and setup/teardown; avoid hidden navigation, module-level mutable lifecycle state and unrelated side effects.
- Browser context isolation does not isolate server-side accounts, carts or other mutable records. Use owned, unique data per concurrent execution/project or an explicitly approved exclusive-access strategy; clean up only records owned by the test.
- Register asynchronous event listeners before triggering their actions and settle both the event and action lifecycle, including failure paths. Prefer web-first assertions to snapshots of values that can still change.
- Locators re-resolve the DOM: after deleting an item, wait for that identified item to disappear or for the collection to change, not for a positional locator that can now point to the next item.
- Do not swallow unexpected errors with broad catches or success-shaped defaults. Distinguish an expected optional element's absence from a failed interaction, and expose actionable errors without secrets.

### Incremental evolution and verification

- For architectural work, first present a read-only audit separating proven problems from optional recommendations, then a prioritized incremental plan with affected consumers and verification for each step.
- Preserve behavior and existing consumers through small, coherent changes. Existing tests are compatibility evidence, not a universal design template. Ask before consequential design decisions or changes to remote/persistent data.
- Validate changed infrastructure contracts with focused checks, using controlled synthetic DOM/data where appropriate, then affected product tests and related regression. Run Chrome before Edge when those projects exist; run the full suite only when explicitly requested.
- Report actual commands and results, including tests not executed and environmental limitations. Documentation-only changes do not require TypeScript or browser execution.
- Qase is required to establish or change a linked case's expectations, not a prerequisite for unrelated framework or instruction maintenance. Never invent case content or claim remote validation.

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
