import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './modules/auth';
import { UsersModule } from './modules/users';
import configuration from './config/configuration';

ConfigModule.forRoot();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL),
    ConfigModule.forRoot({
      load: [configuration],
    }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
