# Test data

Keep reusable JSON grouped by domain. A key ending in `Env` names a required environment variable; the loader resolves it and omits the suffix. An object containing `$ref` reuses another JSON file or a JSON Pointer within it. Missing values and placeholder values fail with a message naming the missing variable or JSON field.

Never put passwords, tokens, personal account values, or real payment details in JSON. AEQA-19 requires only the registered account email and password; its address is sourced from the account and marked for a visibility assertion because no expected address values are supplied. The case selects the first available catalogue item at runtime because Qase does not specify a product name. Payment data in the AEQA-19 file is synthetic demonstration data.

Use `api/` for documented API test data when a case needs it; existing API tests are intentionally unchanged.

## SauceDemo login (Testiny TC-1)

`saucedemo/login.json` defines the public username, product URL and expected inventory screen.
The shared loader resolves `passwordEnv` from `SAUCEDEMO_PASSWORD`; set the value documented
in Testiny in the local environment or `.env`, never in versioned JSON. Missing credentials
fail explicitly. The product fixture overrides the Automation Exercise base URL only for
tests importing that fixture and disables traces to avoid retaining entered passwords.

TC-1 links to Testiny project 1, case 1 and plan 1 through Playwright annotations.
These URL annotations are report references. Numeric `testiny-project-id` and
`testiny-case-id` annotations are used by the API plan runner described in
[the Testiny integration guide](../tools/testiny/README.md). Do not assign this ID to Qase.

Run just this case in Chrome:

```powershell
$env:QASE_MODE = 'off'
npx playwright test 'TC-1-successful-login.spec.ts' --project=ui-chrome
```

The test checks the session after reload without logging out. Playwright still closes its
isolated browser context at teardown; it does not save or share the authenticated session.
The separate Testiny workflow injects `SAUCEDEMO_PASSWORD` and `TESTINY_API_KEY` from GitHub
Secrets. The Qase workflow selects only existing Automation Exercise regression and smoke
paths so it does not publish SauceDemo to Qase or run it against the wrong product.