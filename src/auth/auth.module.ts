import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.auth';

@Module({
  imports: [
    JwtModule, 
    HttpModule, 
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
