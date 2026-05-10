import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendResetPasswordEmail(email: string, code: string) {
    const html = `
<div
style="
background-color: #F5F5F5;
padding: 40px 20px;
font-family: Arial, Helvetica, sans-serif;
"
>
<div
style="
max-width: 500px;
margin: 0 auto;
background-color: #FFFFFF;
border-radius: 16px;
overflow: hidden;
box-shadow: 0 4px 12px rgba(0,0,0,0.08);
"
>
<div
style="
background-color: #F07848;
padding: 24px;
text-align: center;
" >
<h1
style="
color: #FFFFFF;
margin: 0;
font-size: 28px;
"
>
Redefinição de Senha
</h1>
</div>

<div style="padding: 32px;">
<p
style="
color: #333333;
font-size: 16px;
margin-bottom: 24px;
"
>
Recebemos uma solicitação para redefinir sua senha.
</p>

<p
style="
color: #333333;
font-size: 16px;
margin-bottom: 12px;
"
>
Utilize o código abaixo:
</p>

<div
style="
background-color: #F07848;
color: #FFFFFF;
text-align: center;
font-size: 36px;
font-weight: bold;
letter-spacing: 8px;
padding: 20px;
border-radius: 12px;
margin: 24px 0;
"
>
${code}
</div>

<p
style="
color: #666666;
font-size: 14px;
line-height: 1.6;
"
>
Este código expira em 10 minutos.
</p>

<p
style="
color: #666666;
font-size: 14px;
line-height: 1.6;
margin-top: 24px;
"
>
Se você não solicitou a redefinição da senha, ignore este email.
</p>
</div>
</div>
</div>
`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your password',
      html: html,
    });
  }
}
