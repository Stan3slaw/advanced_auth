import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true })
  email: string;

  @Prop()
  fullname: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
