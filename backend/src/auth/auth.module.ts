import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.auth';
import { JwtAuthGuard } from './jwt-auth.guard';
import { HttpModule } from '@nestjs/axios';
import { PasswordResetRepository } from './repository/password-reset.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { PasswordReset, PasswordResetSchema } from './repository/entity';
import { MailService } from './mail/mail.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'secretPassword',
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forFeature([
      {
        name: PasswordReset.name,
        schema: PasswordResetSchema,
      }
    ]),
    HttpModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtAuthGuard, PasswordResetRepository, MailService],
  controllers: [AuthController],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
