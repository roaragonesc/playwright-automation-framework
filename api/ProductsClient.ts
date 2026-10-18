import { BaseApiClient } from './BaseApiClient';
import type { ProductsResponse, BrandsResponse, MessageResponse } from './models';
export class ProductsClient extends BaseApiClient {
  async getAll() { return this.parse<ProductsResponse>(await this.request.get('/api/productsList')); }
  async getBrands() { return this.parse<BrandsResponse>(await this.request.get('/api/brandsList')); }
  async search(term?: string) {
    return this.parse<ProductsResponse | MessageResponse>(await this.request.post('/api/searchProduct', { form: term === undefined ? {} : { search_product: term } }));
  }
  async unsupportedPost() { return this.parse<MessageResponse>(await this.request.post('/api/productsList')); }
}
