import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export interface ProductDetails {
  name: string;
  price: string;
  availability: string;
}

export class ProductsPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly firstAddToCartButton: Locator;
  readonly firstAvailableProductLink: Locator;
  private readonly productName: Locator;
  private readonly productPrice: Locator;
  private readonly productAvailability: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly addedToCartHeading: Locator;
  readonly addedToCartMessage: Locator;
  readonly viewCartLink: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.firstAddToCartButton = page.locator('.add-to-cart').first();
    this.firstAvailableProductLink = page.locator('a[href^="/product_details/"]').first();
    const productInformation = page.locator('.product-information');
    this.productName = productInformation.locator('h2');
    this.productPrice = productInformation.locator('span span').first();
    this.productAvailability = productInformation.locator('p').filter({ hasText: 'Availability:' });
    this.quantityInput = page.locator('#quantity');
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
    this.addedToCartHeading = page.getByRole('heading', { name: 'Added!', exact: true });
    this.addedToCartMessage = page.getByText('Your product has been added to cart.', { exact: true });
    this.viewCartLink = page.getByRole('link', { name: 'View Cart' });
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  async addFirstProductToCart() {
    await this.firstAddToCartButton.click({ force: true });
  }

  async openFirstAvailableProduct() {
    await this.firstAvailableProductLink.click();
  }

  async getProductDetails(): Promise<ProductDetails> {
    return {
      name: (await this.productName.innerText()).trim(),
      price: (await this.productPrice.innerText()).trim(),
      availability: (await this.productAvailability.innerText()).trim(),
    };
  }

  async setQuantityAndAddToCart(quantity: number) {
    await this.quantityInput.fill(String(quantity));
    await this.addToCartButton.click();
  }

  async viewCartFromConfirmation() {
    await this.viewCartLink.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async viewCart() {
    await this.page.goto('/view_cart');
  }
}
