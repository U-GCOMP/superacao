/* eslint-disable prettier/prettier */
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { MailService } from '../mail/mail.service';
import { JwtResetPasswordPayload } from './interfaces/jwt-reset-password-payload.interface';
import { AuthRepository } from './auth.repository';
import { PasswordRepository } from './password.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,

    private readonly passwordRepository: PasswordRepository,

    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  // REMOVE: Example
  sayHello(): string {
    return 'Hello';
  }

  async login(email: string, pass: string): Promise<string> {
    const user = await this.authRepository.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };
    return this.jwtService.sign<JwtPayload>(payload);
  }

  async genPassword(pass: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pass, salt);

    return hashedPassword;
  }

  async register(
    username: string,
    email: string,
    pass: string,
    bio?: string,
  ): Promise<string> {
    const userExists = await this.authRepository.getUserByEmail(email);

    if (userExists) {
      throw new ConflictException('Este e-mail já está em uso.');
    }

    const hashedPassword = await this.genPassword(pass);

    const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}`; 

    const newUser = await this.authRepository.saveUser({
      username,
      email,
      password: hashedPassword,
      bio: bio ?? undefined,
      imageUrl: avatarUrl,
    });

    this.mailService
      .sendWelcomeEmail(newUser.email, newUser.username)
      .catch((err) => {
        // Apenas loga o erro no console caso o envio falhe
        console.error('Erro ao enviar e-mail de boas-vindas:', err);
      });

    const payload = {
      sub: newUser.id,
      username: newUser.username,
      email: newUser.email,
    };
    return this.jwtService.sign(payload);
  }

  async redefinePassword(token: string, newPassword: string): Promise<string> {
    let payload: JwtResetPasswordPayload;

    try {
      payload =
        await this.jwtService.verifyAsync<JwtResetPasswordPayload>(token);
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    if (payload.type !== 'reset-password') {
      throw new UnauthorizedException(
        'Token inválido para redefinição de senha',
      );
    }

    const id = payload.sub;
    const user = await this.authRepository.getUserById(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    user.password = await this.genPassword(newPassword);
    await this.authRepository.saveUser(user);

    return this.login(user.email, newPassword);
  }

  generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async recoverPassword(email: string): Promise<void> {
    const user = await this.authRepository.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const request = await this.passwordRepository.createRequest(
      user,
      this.generateCode(),
      new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    );

    await this.mailService.sendResetPasswordEmail(email, request.code);
  }

  async confirmCode(code: string): Promise<string> {
    const request = await this.passwordRepository.findByCode(code);

    if (!request) {
      throw new BadRequestException('Código inválido');
    }

    if (request.used_at) {
      throw new BadRequestException('Código já utilizado');
    }

    if (request.expires_at < new Date()) {
      throw new BadRequestException('Código expirado');
    }

    request.used_at = new Date();

    await this.passwordRepository.updateRequest(request);

    const token = this.jwtService.sign<JwtResetPasswordPayload>(
      {
        sub: request.user.id,
        type: 'reset-password',
      },
      {
        expiresIn: '10m',
      },
    );

    return token;
  }
}
