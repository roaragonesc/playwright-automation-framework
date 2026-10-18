import type { APIRequestContext, APIResponse } from '@playwright/test';
export type ApiResult<T> = { httpStatus: number; body: T; response: APIResponse };
export abstract class BaseApiClient {
  constructor(protected readonly request: APIRequestContext) {}
  protected async parse<T>(response: APIResponse): Promise<ApiResult<T>> {
    return { httpStatus: response.status(), body: await response.json() as T, response };
  }
}
