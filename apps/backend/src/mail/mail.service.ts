import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { passwordRecoverHTML, registerHTML } from './mail.htmls';
import { register } from 'module';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendResetPasswordEmail(email: string, code: string) {
    const html = passwordRecoverHTML(code);

    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your password',
      html: html,
    });
  }

  async sendWelcomeEmail(email: string, username: string) {
    const html = registerHTML(username)

    await this.mailerService.sendMail({
      to: email,
      subject: 'Bem-vindo(a) ao SuperAção!',
      html: html,
    });
  }
}
