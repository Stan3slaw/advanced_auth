import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

import { MAX_EMAIL_CHARACTERS, MAX_PASSWORD_CHARACTERS } from '../constants';

export class LoginUserDto {
  @MaxLength(MAX_EMAIL_CHARACTERS, {
    message: 'email max length is 60 characters',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @MaxLength(MAX_PASSWORD_CHARACTERS, {
    message: 'password max length is 60 characters',
  })
  @IsNotEmpty()
  readonly password: string;
}
