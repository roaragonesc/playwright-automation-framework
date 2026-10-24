import { test, expect } from '../../../../../fixtures/saucedemo/cart.fixture';

test('TC-3 @regression - Manage two cart products, remove them and log out', {
  annotation: [
    { type: 'testiny-case-id', description: '3' },
    { type: 'testiny-project-id', description: '1' },
    { type: 'testiny', description: 'https://app.testiny.io/p/1/testcases/tc/3/edit' },
    { type: 'testiny-plan', description: 'https://app.testiny.io/p/1/testplans/tp/1' },
    { type: 'product', description: 'saucedemo' },
    { type: 'priority', description: 'High' },
  ],
}, async ({ page, login, inventory, loginData, cart, header, cartData }) => {
  const [removed, retained] = cartData.products;
  const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  await test.step('1. Log in from a fresh context and verify an empty cart.', async () => {
    await login.open();
    await expect(login.loginButton).toBeVisible();
    await login.enterUsername(loginData.username);
    await login.enterPassword(loginData.password);
    await login.submit();
    await expect(page).toHaveURL(new URL(loginData.expected.inventoryPath, loginData.baseUrl).href);
    await expect(inventory.productsTitle).toBeVisible();
    await expect(login.authenticationError).toHaveCount(0);
    await expect(header.cartButton).toHaveAccessibleName('Cart, empty');
  });

  await test.step('2. Add the two named products and verify the cart count.', async () => {
    for (const product of cartData.products) {
      const item = inventory.products.item(product.name);
      await expect(item.root).toHaveCount(1);
      await expect(item.price).toHaveText(money(product.unitPriceCents));
      await item.addToCart();
      await expect(item.removeButton).toBeVisible();
    }
    await expect(header.cartButton).toHaveAccessibleName('Cart, 2 items');
  });

  await test.step('3. Verify both cart products, quantities, prices and combined price.', async () => {
    await header.openCart();
    await expect(page).toHaveURL(new URL(cartData.expected.cartPath, loginData.baseUrl).href);
    await expect(cart.title).toBeVisible();
    await expect(cart.products.items).toHaveCount(2);
    for (const product of cartData.products) {
      const item = cart.products.item(product.name);
      await expect(item.root).toHaveCount(1);
      await expect(item.name).toBeVisible();
      await expect(item.quantity).toHaveText('1');
      await expect(item.price).toHaveText(money(product.unitPriceCents));
    }
    const displayedPrices = await cart.products.prices.allTextContents();
    const combinedCents = displayedPrices.reduce((sum, price) => {
      expect(price).toMatch(/^\$\d+\.\d{2}$/);
      return sum + Number(price.slice(1).replace('.', ''));
    }, 0);
    expect(combinedCents).toBe(cartData.expected.combinedPriceCents);
  });

  await test.step('4. Remove the backpack and verify only the bike light remains.', async () => {
    await cart.products.item(removed.name).removeFromCart();
    await expect(cart.products.item(removed.name).root).toHaveCount(0);
    await expect(cart.products.items).toHaveCount(1);
    const remaining = cart.products.item(retained.name);
    await expect(remaining.name).toBeVisible();
    await expect(remaining.quantity).toHaveText('1');
    await expect(remaining.price).toHaveText(money(retained.unitPriceCents));
    await expect(header.cartButton).toHaveAccessibleName('Cart, 1 items');
  });

  await test.step('5. Remove the remaining product and verify the empty cart survives reload.', async () => {
    await cart.products.item(retained.name).removeFromCart();
    await expect(cart.products.items).toHaveCount(0);
    await expect(header.cartButton).toHaveAccessibleName('Cart, empty');
    await page.reload();
    await expect(cart.title).toBeVisible();
    await expect(cart.products.items).toHaveCount(0);
    await expect(header.cartButton).toHaveAccessibleName('Cart, empty');
  });

  await test.step('6. Continue shopping and verify both products are available to add again.', async () => {
    await cart.continueShopping();
    await expect(page).toHaveURL(new URL(loginData.expected.inventoryPath, loginData.baseUrl).href);
    await expect(inventory.productsTitle).toBeVisible();
    for (const product of cartData.products) {
      const item = inventory.products.item(product.name);
      await expect(item.addButton).toBeVisible();
      await expect(item.removeButton).toHaveCount(0);
    }
    await expect(header.cartButton).toHaveAccessibleName('Cart, empty');
  });

  await test.step('7. Log out and verify direct inventory access redirects to login.', async () => {
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
