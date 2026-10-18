import { BaseApiClient } from './BaseApiClient';
import type { MessageResponse } from './models';
export class AuthClient extends BaseApiClient {
  async verifyLogin(email?: string, password?: string) {
    const form: Record<string, string> = {};
    if (email !== undefined) form.email = email;
    if (password !== undefined) form.password = password;
    return this.parse<MessageResponse>(await this.request.post('/api/verifyLogin', { form }));
  }
}
