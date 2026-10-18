# Buenas prácticas de Playwright + TypeScript

Guía de estudio para un portfolio de QA Automation con Automation Exercise (Frontend y API).

## 1. Qué hace que un test sea bueno
Un test debe verificar un comportamiento observable, ser independiente, tener un nombre claro y fallar por una razón útil. Organízalo como **Arrange / Act / Assert** (preparar / actuar / comprobar).

```ts
import { test, expect } from '@playwright/test';

test('productos: muestra el catálogo', async ({ page }) => {
  await page.goto('https://automationexercise.com/products'); // Arrange
  const productsHeading = page.getByRole('heading', { name: 'All Products' });
  // Assert: el resultado visible es lo importante
  await expect(productsHeading).toBeVisible();
});
```

> Los ejemplos de UI deben contrastarse con la página real: sus nombres accesibles y estructura pueden cambiar.

## 2. `expect` normal frente a `await expect` (web-first)

**Normal:** comprueba un valor que ya tienes. No reintenta automáticamente:

```ts
expect(response.status()).toBe(200);
expect([1, 2, 3]).toHaveLength(3);
```

**Web-first:** comprueba un locator o página y reintenta durante un tiempo limitado:

```ts
await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
await expect(page).toHaveURL(/\/login/);
await expect(page.locator('.productinfo')).toHaveCount(34); // Solo si 34 está confirmado como requisito estable
```

**Evita:**

```ts
expect(await page.getByRole('button', { name: 'Login' }).isVisible()).toBe(true);
```

El código anterior toma una fotografía instantánea del estado y puede fallar si la interfaz aún está cargando.

### Assertions habituales
- `toBeVisible()`: elemento visible.
- `toBeHidden()`: oculto o ausente.
- `toHaveText('...')`: texto completo esperado.
- `toContainText('...')`: fragmento de texto.
- `toHaveValue('...')`: valor de input.
- `toBeEnabled()`: control habilitado.
- `toHaveCount(n)`: número de elementos.
- `toHaveURL(...)`: URL actual.
- `toHaveAttribute(name, value)`: atributo esperado.

**Regla:** elige la aserción más precisa que demuestre el requisito, sin fijar detalles irrelevantes.

## 3. Locators: orden recomendado

```ts
page.getByRole('button', { name: 'Signup / Login' });
page.getByLabel('Email Address');
page.getByPlaceholder('Name');
page.getByTestId('submit-button'); // Solo si existe ese atributo en la app
```

Los locators basados en accesibilidad suelen ser más claros. `getByTestId` es excelente cuando la aplicación ofrece identificadores estables. CSS y XPath no están prohibidos, pero los selectores basados en clases generadas o posiciones son frágiles.

```ts
// ❌ Frágil si se reordena la página
page.locator('div:nth-child(3) > button');

// ✅ Expresa intención cuando la UI tiene nombre accesible
page.getByRole('button', { name: 'Add to cart' });
```

Si hay varios botones iguales, acota la búsqueda al producto concreto.

## 4. Auto-waiting y sincronización

Playwright espera automáticamente condiciones necesarias para muchas acciones y las assertions web-first reintentan. Evita:

```ts
await page.waitForTimeout(3000); // ❌ Espera arbitraria
```

Si necesitas sincronizar una petición concreta, prepara la espera antes de la acción:

```ts
const responsePromise = page.waitForResponse(r =>
  r.url().includes('/api/') && r.request().method() === 'GET'
);
await page.getByRole('button', { name: 'Refresh' }).click();
const response = await responsePromise;
expect(response.ok()).toBe(true);
```

Este ejemplo es un patrón ilustrativo; no presupone que Automation Exercise tenga ese botón o endpoint.

## 5. Page Object Model (POM)
El Page Object encapsula locators y acciones; el test describe el escenario y verifica resultados.

```ts
// pages/LoginPage.ts
import type { Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.locator('[data-qa="login-email"]').fill(email);
    await this.page.locator('[data-qa="login-password"]').fill(password);
    await this.page.locator('[data-qa="login-button"]').click();
  }
}
```

Aquí los selectores `data-qa` son específicos de la aplicación y deben comprobarse. Evita que el Page Object esconda toda la lógica del test o que cada test duplique los locators.

## 6. API con Playwright: HTTP frente a lógica de negocio
Automation Exercise documenta endpoints que pueden devolver un `responseCode` dentro del cuerpo. **No confundas el estado HTTP con ese campo.** Verifica ambos de acuerdo con el contrato publicado.

```ts
import { test, expect } from '@playwright/test';

test('API: lista de productos', async ({ request }) => {
  const response = await request.get('https://automationexercise.com/api/productsList');
  expect(response.status()).toBe(200); // Verificar contrato real

  const body: unknown = await response.json();
  expect(body).toEqual(expect.objectContaining({
    responseCode: 200,
    products: expect.any(Array),
  }));
});
```

**Más pruebas útiles:** método no permitido, búsqueda sin parámetro, credenciales inválidas, creación y eliminación de cuentas de prueba (con precaución). No supongas códigos sin revisar la documentación y observar la respuesta.

## 7. API Client Pattern

```ts
// api/ProductsClient.ts
import type { APIRequestContext } from '@playwright/test';

export class ProductsClient {
  constructor(private readonly request: APIRequestContext) {}

  list() {
    return this.request.get('https://automationexercise.com/api/productsList');
  }
}
```

El test comprueba el resultado; el cliente construye la petición. Con muchos endpoints, usa `baseURL` y modelos tipados/validación de esquemas.

## 8. Fixtures y aislamiento
- Usa las fixtures de Playwright (`page`, `request`) para obtener contextos de prueba.
- Cada test debe poder ejecutarse solo y en cualquier orden.
- No compartas una cuenta mutable entre tests paralelos si pueden interferirse.
- Para datos creados, genera identificadores únicos y limpia únicamente lo que creó el test.
- Evita guardar credenciales en código o repositorios públicos.

## 9. Errores frecuentes

| Error | Alternativa |
| --- | --- |
| `waitForTimeout(5000)` | Assertions con retry o espera de evento concreto |
| `expect(await locator.isVisible()).toBe(true)` | `await expect(locator).toBeVisible()` |
| Afirmar solo que el botón fue pulsado | Comprobar el resultado funcional |
| Usar `nth(0)` por defecto | Locator semántico y acotado |
| Tests que dependen del anterior | Datos y precondiciones independientes |
| `try/catch` que ignora errores | Dejar fallar con evidencia útil |
| `test.only` en commit | Ejecutar mediante filtros CLI |
| Aumentar timeouts ante cualquier fallo | Investigar causa, selector y entorno |

## 10. Ejecución y depuración

```powershell
npx playwright test
npx playwright test tests/ui --headed
npx playwright test tests/api
npx playwright test --debug
npx playwright show-report
npx playwright test --trace on
```

Las trazas ayudan a diagnosticar fallos, pero pueden contener datos de prueba sensibles. No las publiques sin revisarlas.

## 11. Checklist para code review
- [ ] El nombre del test expresa escenario y resultado.
- [ ] El expected result está basado en un requisito o comportamiento confirmado.
- [ ] El test es independiente y repetible.
- [ ] Los locators son estables y legibles.
- [ ] No hay esperas arbitrarias.
- [ ] Se usan assertions que comprueban el comportamiento.
- [ ] La lógica UI/API está encapsulada en POM/clients.
- [ ] No hay secretos ni datos sensibles.
- [ ] El test se ha ejecutado y el resultado está documentado.

## 12. Ejercicios para aprender
1. Escribe un test que compruebe que la página de productos muestra su encabezado.
2. Prueba un login inválido: verifica el mensaje de error, no solo el click.
3. Añade una prueba API que compruebe el esquema básico de la lista de productos.
4. Añade un caso negativo de API según un método o parámetro documentado.
5. Refactoriza un test con selectores duplicados hacia un Page Object.
6. Provoca un fallo intencional, abre el HTML report y explica qué evidencia muestra.

## 13. Cómo explicarlo en una entrevista
"Uso Playwright con TypeScript y separo los tests UI mediante Page Object Model y los tests API mediante clientes reutilizables. Prefiero locators semánticos y assertions web-first porque reducen la fragilidad ante cargas asíncronas. Mantengo los tests aislados y verifico resultados funcionales, no solo acciones. Integro la ejecución en GitHub Actions y reviso trazas y reportes antes de considerar un test estable."

## Referencias
- https://playwright.dev/docs/best-practices
- https://playwright.dev/docs/test-assertions
- https://playwright.dev/docs/locators
- https://playwright.dev/docs/pom
- https://playwright.dev/docs/api-testing
- https://automationexercise.com/api_list
