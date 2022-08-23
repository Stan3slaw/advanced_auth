import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import type { UserDto, LoginUserDto, CreateUserDto } from '../users';
import { UsersService } from '../users';
import type { AuthResponseDto } from './dto/authResponse.dto';

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

      return {
        token: this.jwtService.sign(payload),
      };
    }
  };

  login = async (user: LoginUserDto): Promise<AuthResponseDto> => {
    const { id, email } = await this.usersService.findOneWithPassword(user.email);
    const payload = { email, id };

    return {
      token: this.jwtService.sign(payload),
    };
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

    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  };
}
