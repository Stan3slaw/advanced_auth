import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

import { MAX_EMAIL_CHARACTERS, MAX_FULLNAME_CHARACTERS, MAX_PASSWORD_CHARACTERS } from '../constants';

export class SignupUserDto {
  @MaxLength(MAX_EMAIL_CHARACTERS, {
    message: 'email max length is 60 characters',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @MaxLength(MAX_FULLNAME_CHARACTERS, {
    message: 'fullname max length is 60 characters',
  })
  @IsNotEmpty()
  readonly fullname: string;

  @MaxLength(MAX_PASSWORD_CHARACTERS, {
    message: 'password max length is 60 characters',
  })
  @IsNotEmpty()
  readonly password: string;
}
