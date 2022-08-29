import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';
import mongoose from 'mongoose';

import { User } from '../../users/schemas/users.schema';

export type EmailConfrimationTokenDocument = EmailConfrimationToken & Document;

@Schema()
export class EmailConfrimationToken {
  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  userId: User;
}

export const EmailConfrimationTokenSchema = SchemaFactory.createForClass(EmailConfrimationToken);
