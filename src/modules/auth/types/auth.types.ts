import type { UserDocument } from '../../users/schemas/users.schema';

export interface AuthPayload {
  id: number;
  email: string;
}

export interface VerifiedEmailConfirmationTokenInfo {
  id: string;
  email: string;
  status: string;
  iat: number;
  exp: number;
}

export type EmailConfirmationPayload = Omit<UserDocument, 'password' | 'refreshToken' | 'fullname'>;
