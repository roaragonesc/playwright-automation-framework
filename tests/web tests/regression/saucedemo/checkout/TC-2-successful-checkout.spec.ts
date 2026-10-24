import { test, expect } from '../../../../../fixtures/saucedemo/checkout.fixture';

test('TC-2 @regression - Successful checkout with one product and logout', {
  annotation: [
    { type: 'testiny-case-id', description: '2' },
    { type: 'testiny-project-id', description: '1' },
    { type: 'testiny', description: 'https://app.testiny.io/p/1/testcases/tc/2/edit' },
    { type: 'testiny-plan', description: 'https://app.testiny.io/p/1/testplans/tp/1' },
    { type: 'product', description: 'saucedemo' },
    { type: 'priority', description: 'High' },
  ],
}, async ({ page, login, inventory, loginData, header, cart, checkout, checkoutData }) => {
  const { product, customer, expected } = checkoutData;
  const url = (path: string) => new URL(path, loginData.baseUrl).href;
  const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const subtotal = product.unitPriceCents * product.quantity;
  const inventoryItem = inventory.products.item(product.name);
  const cartItem = cart.products.item(product.name);
  const overviewItem = checkout.products.item(product.name);

  await test.step('1. Log in from a fresh context and verify the empty cart.', async () => {
    await login.open();
    await expect(login.loginButton).toBeVisible();
    await login.enterUsername(loginData.username);
    await login.enterPassword(loginData.password);
    await login.submit();
    await expect(page).toHaveURL(url(loginData.expected.inventoryPath));
    await expect(inventory.productsTitle).toBeVisible();
    await expect(header.cartButton).toHaveAccessibleName('Cart, empty');
    await expect(login.authenticationError).toHaveCount(0);
  });

  await test.step('2. Add the named backpack and verify its price and cart badge.', async () => {
    await expect(inventoryItem.root).toHaveCount(1);
    await expect(inventoryItem.price).toHaveText(money(product.unitPriceCents));
    await inventoryItem.addToCart();
    await expect(inventoryItem.removeButton).toBeVisible();
    await expect(header.cartButton).toHaveAccessibleName(`Cart, ${product.quantity} items`);
  });

  await test.step('3. Open the cart and verify exactly one correct product.', async () => {
    await header.openCart();
    await expect(page).toHaveURL(url(expected.cartPath));
    await expect(cart.title).toBeVisible();
    await expect(cart.products.items).toHaveCount(1);
    await expect(cartItem.name).toBeVisible();
    await expect(cartItem.quantity).toHaveText(String(product.quantity));
    await expect(cartItem.price).toHaveText(money(product.unitPriceCents));
  });

  await test.step('4. Enter synthetic checkout information and verify the fields.', async () => {
    await cart.startCheckout();
    await expect(page).toHaveURL(url(expected.informationPath));
    await expect(checkout.informationTitle).toBeVisible();
    await checkout.fillInformation(customer);
    await expect(checkout.firstNameInput).toHaveValue(customer.firstName);
    await expect(checkout.lastNameInput).toHaveValue(customer.lastName);
    await expect(checkout.postalCodeInput).toHaveValue(customer.postalCode);
  });

  await test.step('5. Verify overview contents, subtotal, tax and calculated total.', async () => {
    await checkout.continueToOverview();
    await expect(page).toHaveURL(url(expected.overviewPath));
    await expect(checkout.overviewTitle).toBeVisible();
    await expect(checkout.error).toHaveCount(0);
    await expect(checkout.products.items).toHaveCount(1);
    await expect(overviewItem.name).toBeVisible();
    await expect(overviewItem.quantity).toHaveText(String(product.quantity));
    await expect(overviewItem.price).toHaveText(money(product.unitPriceCents));
    await expect(checkout.subtotal).toHaveText(`Item total: ${money(subtotal)}`);
    await expect(checkout.tax).toHaveText(`Tax: ${money(expected.taxCents)}`);
    await expect(checkout.total).toHaveText(`Total: ${money(subtotal + expected.taxCents)}`);
  });

  await test.step('6. Finish the demo order and verify confirmation and empty cart.', async () => {
    await checkout.finishOrder();
    await expect(page).toHaveURL(url(expected.completePath));
    await expect(checkout.completeTitle).toBeVisible();
    await expect(checkout.confirmation).toHaveText(expected.confirmation);
    await expect(checkout.dispatchMessage).toHaveText(expected.dispatchMessage);
    await expect(header.cartButton).toHaveAccessibleName('Cart, empty');
  });

  await test.step('7. Return to inventory and verify the product can be added again.', async () => {
    await checkout.backHome();
    await expect(page).toHaveURL(url(loginData.expected.inventoryPath));
    await expect(inventory.productsTitle).toBeVisible();
    await expect(inventoryItem.addButton).toBeVisible();
    await expect(inventoryItem.removeButton).toHaveCount(0);
    await expect(header.cartButton).toHaveAccessibleName('Cart, empty');
  });

  await test.step('8. Log out and verify that inventory is no longer accessible.', async () => {
    await header.logout();
    await expect(page).toHaveURL(loginData.baseUrl);
    await expect(login.usernameInput).toBeVisible();
    await expect(login.passwordInput).toBeVisible();
    await expect(login.loginButton).toBeVisible();
    await inventory.open();
    await expect(page).toHaveURL(loginData.baseUrl);
    await expect(login.loginButton).toBeVisible();
    await expect(inventory.productsTitle).toHaveCount(0);
  });
});
