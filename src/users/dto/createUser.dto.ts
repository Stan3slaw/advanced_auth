import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

import { MAX_EMAIL_CHARACTERS, MAX_FULLNAME_CHARACTERS, MAX_PASSWORD_CHARACTERS } from '../constants';

export class CreateUserDto {
  @MaxLength(MAX_EMAIL_CHARACTERS, {
    message: 'Email max length is 60 characters',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @MaxLength(MAX_FULLNAME_CHARACTERS, {
    message: 'Fullname max length is 60 characters',
  })
  @IsNotEmpty()
  readonly fullname: string;

  @MaxLength(MAX_PASSWORD_CHARACTERS, {
    message: 'Password max length is 60 characters',
  })
  @IsNotEmpty()
  readonly password: string;
}
