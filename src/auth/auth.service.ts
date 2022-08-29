import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { userStatusEnum } from '../users/enums/user-status.enum';
import { EmailService } from '../email/email.service';
import { EmailConfirmationTokenService } from '../email-confirmation-token/email-confirmation-token.service';
import type { UserDocument } from '../users/schemas/users.schema';
import type { UserDto, LoginUserDto, CreateUserDto } from '../users';
import { UsersService } from '../users';
import type { AuthResponseDto } from './dto/auth-response.dto';
import type { AuthPayload, EmailConfirmationPayload, VerifiedEmailConfirmationTokenInfo } from './types/auth.types';
import { EMAIL_CONFIRMATION_ROUTE } from './constants/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailConfirmationTokenService: EmailConfirmationTokenService,
    private readonly emailService: EmailService,
  ) {}

  create = async (user: CreateUserDto): Promise<void> => {
    const existingUser = await this.usersService.findOneWithPassword(user.email);

    if (existingUser) {
      throw new BadRequestException('User with specified email already exists');
    } else {
      const { id, email, status } = await this.usersService.create(user);
      const payload = { id, email, status };
      await this.sendConfirmation(payload as EmailConfirmationPayload);
    }
  };

  login = async (user: LoginUserDto): Promise<AuthResponseDto> => {
    const { id, email, status } = await this.usersService.findOneWithPassword(user.email);

    if (status !== userStatusEnum.active) {
      throw new ForbiddenException('Please confirm your email');
    }

    const payload = { email, id };

    const tokens = await this.getTokens(payload);
    await this.updateRefreshToken(id, tokens.refreshToken);

    return tokens;
  };

  logout = async (userId: number): Promise<UserDocument> => {
    return this.usersService.update(userId, { refreshToken: null });
  };

  validateUser = async (email: string, password: string): Promise<UserDto> => {
    const user = await this.usersService.findOneWithPassword(email);

    if (!user) {
      throw new NotFoundException('User with specified email does not exist');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new BadRequestException('Incorrect password');
    }

    const userWithoutPasswordAndRefreshToken = { email: user.email, fullname: user.fullname };

    return userWithoutPasswordAndRefreshToken;
  };

  updateRefreshToken = async (userId: number, refreshToken: string): Promise<void> => {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  };

  getTokens = async (payload: AuthPayload): Promise<AuthResponseDto> => {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET || 'secret',
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIREIN || '120s',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'secret',
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIREIN || '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  };

  refreshTokens = async (email: string, refreshToken: string): Promise<AuthResponseDto> => {
    const user = await this.usersService.findOneWithPassword(email);

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access denied');
    }
    const isRefreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!isRefreshTokenMatches) {
      throw new ForbiddenException('Access denied');
    }
    const payload = { id: user.id, email: user.email };

    const tokens = await this.getTokens(payload);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  };

  confirmEmail = async (token: string): Promise<AuthResponseDto> => {
    const data = await this.verifyEmailConfirmationToken(token);
    const user = await this.usersService.findOneWithPassword(data.email);

    await this.emailConfirmationTokenService.delete(data.id, token);

    if (user && user.status === userStatusEnum.pending) {
      user.status = userStatusEnum.active;

      await user.save();
      const payload = { id: user.id, email: user.email };
      const tokens = await this.getTokens(payload);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    }
    throw new BadRequestException('Confirmation error');
  };

  sendConfirmation = async (payload: EmailConfirmationPayload): Promise<void> => {
    const emailConfrimationToken = await this.jwtService.signAsync(payload, {
      secret: process.env.EMAIL_CONFIRMATION_SECRET || 'secret',
      expiresIn: process.env.EMAIL_CONFIRMATION_TOKEN_EXPIREIN || '1d',
    });
    const confirmLink = EMAIL_CONFIRMATION_ROUTE + emailConfrimationToken;

    await this.emailConfirmationTokenService.create({ token: emailConfrimationToken, userId: payload.id });
    await this.emailService.send(payload.email, confirmLink);
  };

  private verifyEmailConfirmationToken = async (token): Promise<VerifiedEmailConfirmationTokenInfo> => {
    try {
      const data = await this.jwtService.verifyAsync(token, {
        secret: process.env.EMAIL_CONFIRMATION_SECRET || 'secret',
      });

      const tokenExists = await this.emailConfirmationTokenService.exists(data.id, token);

      if (tokenExists) {
        return data;
      }
      throw new UnauthorizedException();
    } catch (error) {
      throw new UnauthorizedException();
    }
  };
}
