export type ApiEnvelope<T> = { responseCode: number; message?: string } & T;
export interface Product { id: number; name: string; price: string; brand: string; category: unknown }
export type ProductsResponse = ApiEnvelope<{ products: Product[] }>;
export type BrandsResponse = ApiEnvelope<{ brands: Array<{ id: number; brand: string }> }>;
export type MessageResponse = ApiEnvelope<Record<string, never>>;
