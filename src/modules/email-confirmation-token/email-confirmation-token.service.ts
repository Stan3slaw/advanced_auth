import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { Document } from 'mongoose';
import type { DeleteResult } from 'mongodb';

import type { CreateEmailConfirmationTokenDto } from './dto/create-email-confirmation-token.dto';
import type { EmailConfrimationTokenDocument } from './schemas/email-confirmation-token.schema';

@Injectable()
export class EmailConfirmationTokenService {
  constructor(
    @InjectModel('EmailConfrimationToken') private readonly tokenModel: Model<EmailConfrimationTokenDocument>,
  ) {}

  create = async (
    createEmailConfirmationTokenDto: CreateEmailConfirmationTokenDto,
  ): Promise<EmailConfrimationTokenDocument> => {
    const userToken = new this.tokenModel(createEmailConfirmationTokenDto);

    return userToken.save();
  };

  delete = async (userId: string, token: string): Promise<DeleteResult> => {
    return this.tokenModel.deleteOne({ userId, token });
  };

  exists = async (
    userId: string,
    token: string,
  ): Promise<Pick<Document<EmailConfrimationTokenDocument, unknown, unknown>, '_id'>> => {
    return this.tokenModel.exists({ userId, token });
  };
}
