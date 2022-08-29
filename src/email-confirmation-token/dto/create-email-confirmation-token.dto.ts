import { IsString } from 'class-validator';
import * as mongoose from 'mongoose';

export class CreateEmailConfirmationTokenDto {
  @IsString()
  token: string;

  @IsString()
  userId: mongoose.Types.ObjectId;
}
