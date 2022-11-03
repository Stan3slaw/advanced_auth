import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { EmailConfirmationTokenModule } from '../email-confirmation-token/email-confirmation-token.module';
import { EmailModule } from '../email/email.module';
import { UsersModule } from '../users';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { LoginStrategy } from './strategies/login.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: configService.get<string>('jwt.expiresIn') },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    PassportModule,
    EmailModule,
    EmailConfirmationTokenModule,
  ],
  controllers: [AuthController],
  providers: [ConfigService, AuthService, LoginStrategy, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
