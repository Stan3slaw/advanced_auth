import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';

import { UserStatusEnum } from '../enums/user-status.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  fullname: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: UserStatusEnum.pending })
  status: string;

  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
