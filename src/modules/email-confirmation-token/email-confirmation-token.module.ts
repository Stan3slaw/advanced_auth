import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EmailConfirmationTokenService } from './email-confirmation-token.service';
import { EmailConfrimationTokenSchema } from './schemas/email-confirmation-token.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'EmailConfrimationToken', schema: EmailConfrimationTokenSchema }])],
  providers: [EmailConfirmationTokenService],
  exports: [EmailConfirmationTokenService],
})
export class EmailConfirmationTokenModule {}
