import { qase } from 'playwright-qase-reporter';
import { test, expect } from '../../../../fixtures/aeqa19.fixture';

test.beforeEach(async ({ home, login, cart, purchaseData }) => {
  await home.open();
  await home.goToLogin();
  await login.login(purchaseData.user.email, purchaseData.user.password);
  await expect(home.page.locator('header')).toContainText('Logged in as');
  await home.goToCart();
  await cart.ensureCartIsEmpty();
  await expect(cart.emptyMessage).toBeVisible();
  await login.logout();
});

test(qase(19, 'AEQA-19 @regression - complete purchase with a registered user'), async ({
  home,
  login,
  products,
  cart,
  checkout,
  payment,
  purchaseData,
}) => {
  let selectedProduct: Awaited<ReturnType<typeof products.getProductDetails>>;

  await test.step('1. Navigate to the Automation Exercise homepage.', async () => {
    await home.open();
    await expect(home.page).toHaveURL(/\/$/);
  });

  await test.step('2. Click the Signup / Login button.', async () => {
    await home.goToLogin();
    await expect(home.page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
  });

  await test.step('3. Enter registered credentials and click Login.', async () => {
    await login.login(purchaseData.user.email, purchaseData.user.password);
    await expect(home.page.locator('header')).toContainText('Logged in as');
  });

  await test.step('4. Click Products in the navigation menu.', async () => {
    await home.goToProducts();
    await expect(home.page.getByRole('heading', { name: 'All Products' })).toBeVisible();
    await expect(home.page.locator('a[href^="/product_details/"]').first()).toBeVisible();
  });

  await test.step('5. Select an available product and click View Product.', async () => {
    await products.openFirstAvailableProduct();
    selectedProduct = await products.getProductDetails();
    expect(selectedProduct.name).not.toBe('');
    expect(selectedProduct.price).toMatch(/^Rs\.\s*\d+/);
    expect(selectedProduct.availability).toContain('Availability: In Stock');
  });

  await test.step('6. Set the product quantity and add it to the cart.', async () => {
    await products.setQuantityAndAddToCart(purchaseData.product.quantity);
    await expect(products.addedToCartHeading).toBeVisible();
    await expect(products.addedToCartMessage).toBeVisible();
    await expect(products.viewCartLink).toBeVisible();
  });

  await test.step('7. Click View Cart and verify the product details.', async () => {
    await products.viewCartFromConfirmation();
    await expect(cart.itemRow).toBeVisible();
    await expect(cart.productName).toHaveText(selectedProduct.name);
    await expect(cart.unitPrice).toHaveText(selectedProduct.price);
    await expect(cart.quantity).toHaveText(String(purchaseData.product.quantity));
    await expect(cart.totalPrice).toHaveText(selectedProduct.price);
  });

  await test.step('8. Click Proceed To Checkout.', async () => {
    await cart.proceedToCheckout();
    await expect(home.page.getByRole('heading', { name: 'Address Details' })).toBeVisible();
    await expect(home.page.getByRole('heading', { name: 'Review Your Order' })).toBeVisible();
  });

  await test.step('9. Verify the registered delivery address is displayed and order details match.', async () => {
    await expect(checkout.deliveryAddress).toBeVisible();
    const addressContent = (await checkout.deliveryAddress.innerText())
      .replace(/your delivery address/i, '')
      .trim();
    expect(addressContent).not.toBe('');
    const orderItemRow = checkout.orderItemRow(selectedProduct.name);
    await expect(orderItemRow).toBeVisible();
    await expect(orderItemRow.getByRole('cell').nth(2)).toHaveText(selectedProduct.price);
    await expect(orderItemRow.getByRole('cell').nth(3)).toHaveText(String(purchaseData.product.quantity));
    await expect(orderItemRow.getByRole('cell').nth(4)).toHaveText(selectedProduct.price);
    await expect(checkout.orderTotal).toHaveText(selectedProduct.price);
  });

  await test.step('10. Enter the documented order comment.', async () => {
    await checkout.orderComment.fill(purchaseData.order.comment);
    await expect(checkout.orderComment).toHaveValue(purchaseData.order.comment);
  });

  await test.step('11. Click Place Order and verify the payment form.', async () => {
    await checkout.placeOrderButton.click();
    await expect(home.page).toHaveURL(/\/payment$/);
    await expect(payment.cardholderName).toBeVisible();
    await expect(payment.cardNumber).toBeVisible();
    await expect(payment.cvv).toBeVisible();
    await expect(payment.expiryMonth).toBeVisible();
    await expect(payment.expiryYear).toBeVisible();
  });

  await test.step('12. Enter synthetic payment details and verify the fields.', async () => {
    await payment.fillPaymentDetails(purchaseData.payment);
    await expect(payment.cardholderName).toHaveValue(purchaseData.payment.cardholderName);
    await expect(payment.cardNumber).toHaveValue(purchaseData.payment.cardNumber);
    await expect(payment.cvv).toHaveValue(purchaseData.payment.cvv);
    await expect(payment.expiryMonth).toHaveValue(purchaseData.payment.expiryMonth);
    await expect(payment.expiryYear).toHaveValue(purchaseData.payment.expiryYear);
  });

  await test.step('13. Click Pay and Confirm Order.', async () => {
    await payment.payAndConfirmButton.click();
    await expect(home.page.getByText(purchaseData.expected.confirmationMessage)).toBeVisible();
  });

  await test.step('14. Verify the order confirmation message.', async () => {
    await expect(home.page.getByText(purchaseData.expected.confirmationMessage, { exact: true })).toBeVisible();
  });
});