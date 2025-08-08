import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.generatedToken({
      email: req.user.email,
      _id: req.user._id,
    });
  }

  @Post('/forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.sendResetPasswordEmail(email);
  }

  @Post('/verify-token')
  async verifyToken(@Body() body: { token: string }) {
    return this.authService.verifyToken(body.token);
  }

  @Post('/reset-password')
  async resetPassword(@Body() body: { userId: string; password: string }) {
    return this.authService.resetPassword(body.userId, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
