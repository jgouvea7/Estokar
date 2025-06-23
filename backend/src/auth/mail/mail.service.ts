import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer'



@Injectable()
export class MailService {
    private transporter

    constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'estokar.suporte@gmail.com',
        pass: 'kqmt wmux lkvg uvxq',
      },
    });
  }

  async send({ to, subject, html }: { to: string; subject: string; html: string }) {
    const mailOptions = {
      from: '"Estokar" <contato.estokar@gmail.com>',
      to,
      subject,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  }
}