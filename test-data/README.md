# Test data

Keep reusable JSON grouped by domain. A key ending in `Env` names a required environment variable; the loader resolves it and omits the suffix. An object containing `$ref` reuses another JSON file or a JSON Pointer within it. Missing values and placeholder values fail with a message naming the missing variable or JSON field.

Never put passwords, tokens, personal account values, or real payment details in JSON. AEQA-19 requires only the registered account email and password; its address is sourced from the account and marked for a visibility assertion because no expected address values are supplied. The case selects the first available catalogue item at runtime because Qase does not specify a product name. Payment data in the AEQA-19 file is synthetic demonstration data.

Use `api/` for documented API test data when a case needs it; existing API tests are intentionally unchanged.