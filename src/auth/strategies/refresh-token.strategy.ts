import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import type { AuthPayload } from '../types/auth.types';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('refreshToken.secret'),
      passReqToCallback: true,
    });
  }

  validate = (req: Request, { id, email }: AuthPayload): AuthPayload & { refreshToken: string } => {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();

    return { refreshToken, id, email };
  };
}
