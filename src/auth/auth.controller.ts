import { Controller, Post, Body, Res, Req, Get, UnauthorizedException, BadRequestException } from '@nestjs/common';

import { Response, Request } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    try {
      return await this.authService.register(name, email, password);
    } catch (error) {
      throw new BadRequestException('Registration failed');
    }
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const token = await this.authService.login(email, password);
      response.cookie('token', token, { httpOnly: true });
      return { message: 'Login successful' };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @Get('get-user')
  async getUser(@Req() request: Request) {
    try {
      const user = await this.authService.getUser(request);
      return user;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token');
    return { message: 'Logout successful' };
  }
}
