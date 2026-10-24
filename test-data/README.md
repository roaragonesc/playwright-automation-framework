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

## SauceDemo checkout (Testiny TC-2)

`saucedemo/checkout.json` contains a named backpack, integer-cent prices and synthetic
customer information. The checkout fixture extends the product fixture, reusing the
existing login configuration without implicit navigation or shared storage state.
The spec keeps scenario assertions; product Page Objects and the shared product-list
component own interactions and selectors used by inventory, cart and overview.

The authorized demo journey logs in, adds one backpack, verifies cart and checkout
contents, checks the $29.99 subtotal, $2.40 tax and $32.39 calculated total, finishes
the order, verifies confirmation and an empty cart, then logs out and verifies that
direct inventory access redirects to login. It uses no real customer/payment data.
Browser context teardown discards client-side state; it does not delete remote orders.

TC-2 belongs to project 1 and is selected by TP-1's existing no-folder query. It is
`@regression`, not a separate E2E suite and not a Qase case. The Testiny workflow
discovers its numeric annotations without an additional workflow entry.

Run just this case with `SAUCEDEMO_PASSWORD` configured:

```powershell
$env:QASE_MODE = 'off'
npx playwright test 'TC-2-successful-checkout.spec.ts' --project=ui-chrome
npx playwright test 'TC-2-successful-checkout.spec.ts' --project=ui-edge
```

## SauceDemo cart management (Testiny TC-3)

`saucedemo/cart.json` defines two distinct products with integer-cent prices and their
combined price. Its validator rejects missing/invalid products, duplicates and an
inconsistent sum. The product cart fixture supplies this data lazily and shares the
cart/header Page Objects with the checkout fixture; no implicit login or navigation.

TC-3 adds a backpack ($29.99) and bike light ($9.99), verifies both rows and their
$39.98 combined price, removes the backpack by name and verifies the retained light,
then removes the light. It checks that the empty cart survives reload, returns to
the inventory, and logs out with a direct-inventory-access check. The cart does not
display a subtotal: the assertion sums displayed unit prices for the two quantity-1
rows. No checkout, order creation or payment occurs.

The regression case is linked to Testiny project 1 / TC-3 and selected by TP-1's
no-folder query. It is not published to Qase. With `SAUCEDEMO_PASSWORD` configured:

```powershell
$env:QASE_MODE = 'off'
npx playwright test 'TC-3-cart-management.spec.ts' --project=ui-chrome
npx playwright test 'TC-3-cart-management.spec.ts' --project=ui-edge
```