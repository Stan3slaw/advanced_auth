import type { User } from '../schemas/users.schema';

export type UserDto = Omit<User, 'password'>;
