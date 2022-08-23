import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

import { CreateUserDto, LoginUserDto } from '../users';
import { AuthService } from './auth.service';
import type { AuthResponseDto } from './dto/authResponse.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ValidationPipe())
  async create(@Body() createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    return this.authService.create(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<AuthResponseDto> {
    return this.authService.login(loginUserDto);
  }
}
