import { Body, Controller, Get, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

import { User } from '../users/decorators/user.decorator';
import { AuthService } from './auth.service';
import type { AuthResponseDto } from './dto/auth-response.dto';
import { AccessTokenGuard } from './guards/access-token.guard';
import { LoginGuard } from './guards/login.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { SignupUserDto } from './dto/signup-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ValidationPipe())
  async signup(@Body() createUserDto: SignupUserDto): Promise<void> {
    return this.authService.signup(createUserDto);
  }

  @UseGuards(LoginGuard)
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<AuthResponseDto> {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  async logout(@User('id') currentUserId: number): Promise<void> {
    this.authService.logout(currentUserId);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(
    @User('email') currentUserEmail: string,
    @User('refreshToken') refreshToken: string,
  ): Promise<AuthResponseDto> {
    return this.authService.refreshTokens(currentUserEmail, refreshToken);
  }

  @Get('confirm')
  async confirmEmail(@Query(ValidationPipe) query: ConfirmEmailDto): Promise<AuthResponseDto> {
    return this.authService.confirmEmail(query.token);
  }
}
