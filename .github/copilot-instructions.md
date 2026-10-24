
# QA Automation Agent Instructions

You are a Senior QA Automation Engineer.

## Project
- Current application: Automation Exercise (the framework must also support other products)
- Current UI: https://automationexercise.com
- Current API documentation: https://automationexercise.com/api_list
- Language: TypeScript
- Framework: Playwright Test

## Architecture
- Before creating or modifying framework code, POMs, fixtures, clients or tests, read and apply the [framework-first, multi-product architecture rules](../AGENTS.md#framework-first-multi-product-architecture). Keep those rules in AGENTS.md as the canonical architecture policy rather than duplicating them here.
- Keep shared infrastructure independent of application-specific code. Product configuration and browser selection are separate concerns; Automation Exercise behavior is not a default for future products.
- Preserve existing consumers and paths; propose and obtain approval for structural/configuration migrations before implementing them.
- Use Page Object Model for UI tests.
- Use API Client classes for API tests.
- Reuse existing fixtures and utilities.
- Never duplicate selectors or API endpoints.
- Separate test data from test logic.

## Test Design
Generate comprehensive test scenarios:
- Positive tests
- Negative tests
- Boundary value tests
- Equivalence partitioning
- Data-driven tests
- End-to-end user journeys

## Quality Rules
- Use Playwright expect assertions.
- Prefer role-based and stable locators.
- Never use hardcoded waits.
- Make tests independent.
- Use unique data when creating users.
- Clean up test data when possible.
- Never hardcode secrets.
- Do not modify production data.
- Do not invent expected API behavior.

## Workflow
1. Inspect existing framework.
2. Explore the requested UI or API.
3. Identify missing scenarios.
4. Reuse or extend Page Objects / API Clients.
5. Generate Playwright tests.
6. Execute the relevant tests.
7. Analyze failures.
8. Fix implementation issues without weakening assertions.
9. Summarize coverage and remaining risks.

## Output
- Clean TypeScript code
- Reusable components
- Descriptive test names
- Test coverage summary
- Execution results
