import type { UserDocument } from 'src/users/schemas/users.schema';

export type AuthPayload = {
  id: number;
  email: string;
};

export type EmailConfirmationPayload = Omit<UserDocument, 'password' | 'refreshToken' | 'fullname'>;

export type VerifiedEmailConfirmationTokenInfo = {
  id: string;
  email: string;
  status: string;
  iat: number;
  exp: number;
};
