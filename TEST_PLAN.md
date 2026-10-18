# Test Plan — Automation Exercise

**Project:** Playwright Automation Framework  
**Application under test (AUT):** [Automation Exercise](https://automationexercise.com/)  
**API reference:** [Automation Exercise API List](https://automationexercise.com/api_list)  
**Version:** 1.0 (initial plan)  
**Status:** Draft — baseline for review  
**Owner:** QA Automation Engineer  
**Stack:** Playwright Test, TypeScript, GitHub Actions, Qase (planned)

## 1. Purpose and objectives

This document defines the test strategy for the public Automation Exercise demo application and its documented API. The project is a portfolio demonstration of risk-based test design, maintainable automation, reliable assertions, CI practices, and transparent reporting.

Objectives:
- Verify critical user journeys and documented API behaviors.
- Detect regressions through independent, repeatable automated tests.
- Demonstrate Page Object Model (POM) for UI and reusable API clients for services.
- Produce actionable failure evidence (traces, screenshots, reports).
- Clearly distinguish implemented, executed, passing, failing, and planned coverage.

## 2. Scope

### 2.1 In scope — UI

| Feature | Representative scenarios | Priority |
|---|---|---|
| Authentication | Login with valid/invalid credentials, logout, error messaging | P0 |
| Registration | Account creation with unique test data, required fields, validation | P0 |
| Products | Catalog visibility, product details, search | P1 |
| Cart | Add/remove products, quantity and subtotal checks where available | P0 |
| Checkout | Navigation and order flow, only where safe test data and demo behavior permit | P1 |
| Contact form | Input validation and successful submission, avoiding spam | P2 |

### 2.2 In scope — API

Validate **only endpoints and methods documented in the live API reference**. Candidate areas include products, brands, product search, account verification and account operations, subject to confirming their current request/response contracts.

For each applicable endpoint, cover successful responses, invalid inputs, unsupported methods, response schemas and business rules. Where an endpoint changes data, use unique disposable test accounts and cleanup where supported.

### 2.3 Out of scope

- Production systems, third-party payments, real purchases and real personal data.
- Load/stress testing and penetration testing of this public demo.
- Exhaustive browser/device combinations in the initial version.
- Claims about accessibility or security compliance without a dedicated audit.

## 3. Test approach

### 3.1 Test levels and suites

| Suite | Goal | Trigger | Target duration |
|---|---|---|---|
| Smoke | Verify critical UI/API availability and essential journeys | Pull requests and pushes | Short |
| Regression | Broader functional coverage | Scheduled or manual runs | Best effort |
| API | Validate documented contracts and negative cases | Pull requests and pushes | Short |
| Cross-browser | Check important journeys in additional browsers | Manual/scheduled after stability | Best effort |

Target durations are goals, not measured performance commitments.

### 3.2 Test design techniques

- Positive and negative testing.
- Boundary value analysis and equivalence partitioning where meaningful.
- Data-driven testing for distinct input classes.
- Risk-based prioritization (P0 critical, P1 important, P2 supplementary).
- Independent tests with explicit setup, assertions and cleanup.

### 3.3 Automation standards

- **UI:** Page Object Model. Pages own locators and interactions; tests own business assertions.
- **API:** typed clients, reusable request helpers and explicit status/body checks.
- Prefer accessible locators (`getByRole`, `getByLabel`), then stable test IDs; avoid brittle CSS/XPath.
- Use Playwright web-first assertions (`await expect(locator).toBeVisible()`, `toHaveText()`, etc.).
- Never use arbitrary sleeps; rely on auto-waiting and condition-based waits.
- Do not swallow exceptions or weaken assertions to make tests pass.
- Keep credentials in environment variables/secrets; commit only `.env.example`.
- Use test-generated, non-sensitive data; avoid dependencies between tests.
- Avoid destructive operations on shared demo data; obtain approval for account deletion.
- Mark flaky or environment-blocked tests explicitly and document evidence.

## 4. Environments and test data

| Component | Environment |
|---|---|
| UI base URL | `https://automationexercise.com` |
| API documentation | `https://automationexercise.com/api_list` |
| Local execution | Windows, Node.js LTS, Playwright browsers |
| CI | GitHub Actions hosted runner (subject to plan limits) |
| Test management | Qase Free plan (integration planned) |

Use generated email addresses and disposable accounts. Never use actual customer information or real payment details. Public demo behavior and availability may change without notice; record such limitations rather than assuming a product defect.

## 5. Entry and exit criteria

### Entry criteria
- Dependencies install successfully and TypeScript typecheck completes.
- Target environment is reachable.
- Test cases have defined preconditions and expected outcomes.
- Required non-secret test data and configuration are available.

### Exit criteria for a release candidate
- All designated P0 smoke tests have been executed.
- No unexplained P0 failures remain.
- Failures are classified as application defect, automation defect, environment issue, or unresolved.
- Execution reports and relevant traces are attached or linked.
- Known limitations and skipped tests are documented.

A green pipeline is evidence of the executed checks, not proof of defect-free software.

## 6. Defect management

Each issue should include: unique ID, title, environment, severity/priority, steps to reproduce, expected result, actual result, screenshots/trace or response payload (without secrets), reproducibility, and current status.

Severity guidelines:
- **Critical:** essential flow blocked or severe data integrity issue.
- **High:** major feature broken with no practical workaround.
- **Medium:** partial failure or workaround available.
- **Low:** minor usability or cosmetic issue.

## 7. CI/CD and reporting

- Run smoke/API suites on pull requests and pushes to `main`, once stable.
- Keep UI and API jobs separable so failures are attributable.
- Upload Playwright HTML reports and traces as CI artifacts on failure (with appropriate retention).
- Add Qase reporting once credentials are configured as GitHub secrets; never commit API tokens.
- Review generated tests and changes in pull requests before merging.
- Optional scheduled regression runs should respect public demo availability and GitHub quotas.

## 8. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Public demo outages, throttling, or UI changes | Record environment failures; avoid aggressive retries and excessive parallelism |
| Shared mutable data | Generate unique data; isolate tests; clean up only where supported |
| Fragile selectors | Prefer semantic locators; centralize selectors in POM |
| Flaky asynchronous behavior | Web-first assertions, trace analysis, no fixed sleeps |
| API behavior differs from assumptions | Confirm contracts against current documentation and observed responses |
| AI-generated tests give false confidence | Human review of coverage, assertions and execution evidence |
| Duplicate project folders | Resolve repository structure before expanding automation |

## 9. Deliverables

- Version-controlled framework and setup documentation.
- UI Page Objects, API clients, fixtures and typed test data.
- Traceable test cases and coverage matrix.
- Automated test suites with clear assertions.
- Playwright execution reports and CI workflows.
- Defect reports and Qase results when integrated.

## 10. Coverage and execution tracking

Maintain a coverage matrix with these fields:

| Case ID | Feature | Scenario | Layer | Priority | Automation status | Last result | Evidence |
|---|---|---|---|---|---|---|---|
| UI-AUTH-001 | Authentication | Valid login | UI | P0 | To verify | Not executed | — |
| UI-AUTH-002 | Authentication | Invalid password | UI | P0 | Planned | Not executed | — |
| UI-CART-001 | Cart | Add product | UI | P0 | Planned | Not executed | — |
| API-PROD-001 | Products | Retrieve product list | API | P0 | To verify | Not executed | — |
| API-SEARCH-001 | Search | Search product | API | P1 | Planned | Not executed | — |

**Status definitions:** Planned = not implemented; To verify = implementation may exist but not reviewed; Automated = code implemented and reviewed; Passed/Failed = outcome of a dated execution; Blocked = execution prevented by a documented dependency.

## 11. Review and maintenance

Update this plan when scope, risks, environments or CI triggers change. Record test execution dates and results separately from the plan. Before publishing the portfolio, validate the repository structure, current application behavior, and actual CI status.
