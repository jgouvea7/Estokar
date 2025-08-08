import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { JwtPayloadDto } from './dto/jwtpayload.dto';
import { PasswordResetRepository } from './repository/password-reset.repository';
import { MailService } from './mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly passwordResetRepository: PasswordResetRepository,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async singIn(email: string, password: string): Promise<any> {
    const response = await firstValueFrom(
      this.httpService.get(`http://localhost:3001/users/${email}`)
    );

    const user = response.data;

    if (!user) {
      throw new UnauthorizedException("Email ou senha incorreto");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new UnauthorizedException("Email ou senha incorreto");
    }

    return user;
  }

  async generatedToken(payload: JwtPayloadDto) {
    console.log(payload)
    return {
      access_token: this.jwtService.sign(
        { email: payload.email, sub: payload._id },
        {
          secret: 'secretPassword',
        }
      ),
    };
  }

  async sendResetPasswordEmail(email: string) {
    const response = await firstValueFrom(
      this.httpService.get(`http://localhost:3001/users/${email}`)
    );

    const user = response.data;

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await this.passwordResetRepository.save({
      token,
      userId: user._id,
      expires,
    });

    await this.mailService.send({
      to: user.email,
      subject: 'Código de verificação',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 500px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="background-color: #0e7490; padding: 20px; color: white; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">Estokar</h1>
              <p style="margin: 0; font-size: 16px;">Redefinição de senha</p>
            </div>
            <div style="padding: 30px; color: #333;">
              <p>Olá,</p>
              <p>Recebemos uma solicitação para redefinir sua senha. Use o código abaixo para continuar:</p>
              <div style="text-align: center; margin: 30px 0;">
                <span style="display: inline-block; background-color: #e2e8f0; padding: 15px 25px; font-size: 22px; font-weight: bold; border-radius: 8px; letter-spacing: 2px;">
                  ${token}
                </span>
              </div>
              <p>Se você não solicitou essa redefinição, pode ignorar este e-mail.</p>
              <p style="margin-top: 30px;">Atenciosamente,<br><strong>Equipe Estokar</strong></p>
            </div>
            <div style="background-color: #f1f5f9; text-align: center; padding: 15px; font-size: 12px; color: #94a3b8;">
              © ${new Date().getFullYear()} Estokar. Todos os direitos reservados.
            </div>
          </div>
        </div>
      `,
    });
  }

  async verifyToken(token: string) {
    const resetRecord = await this.passwordResetRepository.findByToken(token);

    if (!resetRecord || resetRecord.expires < new Date()) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    

    return { userId: resetRecord.userId };
  }

  async resetPassword(userId: string, password: string) {
    if (!userId || !password) {
      throw new BadRequestException('Dados inválidos');
    }

    await firstValueFrom(
      this.httpService.patch(`http://localhost:3001/users/${userId}/password`, {
        password,
      })
    );

    await this.passwordResetRepository.deleteAllForUser(userId);
  }
}
