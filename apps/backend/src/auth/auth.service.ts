import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Users } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { PasswordResetRequest } from './entities/reset-password-request.entity';
import { MailService } from '../mail/mail.service';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtResetPasswordPayload } from './interfaces/jwt-reset-password-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,

    @InjectRepository(PasswordResetRequest)
    private readonly passwordRepository: Repository<PasswordResetRequest>,

    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  // REMOVE: Example
  sayHello(): string {
    return 'Hello';
  }

  async login(email: string, pass: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { email } });

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
  ): Promise<string> {
    const userExists = await this.userRepository.findOne({ where: { email } });

    if (userExists) {
      throw new ConflictException('Este e-mail já está em uso.');
    }

    const hashedPassword = await this.genPassword(pass);

    const newUser = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);

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
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    user.password = await this.genPassword(newPassword);
    await this.userRepository.save(user);

    return this.login(user.email, newPassword);
  }

  generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async recoverPassword(email: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const request = this.passwordRepository.create({
      user,
      code: this.generateCode(),
      used_at: null,
      expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    await this.passwordRepository.save(request);

    await this.mailService.sendResetPasswordEmail(email, request.code);
  }

  async confirmCode(code: string): Promise<string> {
    const request = await this.passwordRepository.findOne({
      where: {
        code: code,
      },
      relations: ['user'],
    });

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

    await this.passwordRepository.save(request);

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
