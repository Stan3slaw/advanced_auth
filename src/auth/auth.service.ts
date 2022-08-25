import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import type { UserDocument } from '../users/schemas/users.schema';
import type { UserDto, LoginUserDto, CreateUserDto } from '../users';
import { UsersService } from '../users';
import type { AuthResponseDto } from './dto/auth-response.dto';
import type { AuthPayload } from './types/auth.types';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  create = async (user: CreateUserDto): Promise<AuthResponseDto> => {
    const existingUser = await this.usersService.findOneWithPassword(user.email);

    if (existingUser) {
      throw new BadRequestException('User with specified email already exists');
    } else {
      const { id, email } = await this.usersService.create(user);
      const payload = { email, id };

      const tokens = await this.getTokens(payload);
      await this.updateRefreshToken(id, tokens.refreshToken);

      return tokens;
    }
  };

  login = async (user: LoginUserDto): Promise<AuthResponseDto> => {
    const { id, email } = await this.usersService.findOneWithPassword(user.email);
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
}
