/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, pass: string): Promise<string> {
    const user = await this.authRepository.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: user.id, username: user.username, email: user.email };
    return this.jwtService.sign(payload);
  }

  async register(username: string, email: string, pass: string): Promise<string> {
    const userExists = await this.authRepository.getUserByEmail(email);

    if (userExists) {
      throw new ConflictException('Este e-mail já está em uso.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pass, salt);

    const newUser = await this.authRepository.saveUser({username, email, password: hashedPassword});

    const payload = { sub: newUser.id, username: newUser.username, email: newUser.email };
    return this.jwtService.sign(payload);
  }
}