import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, pass: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { email } });

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
    const userExists = await this.userRepository.findOne({ where: { email } });

    if (userExists) {
      throw new ConflictException('Este e-mail já está em uso.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pass, salt);

    const newUser = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });
    
    await this.userRepository.save(newUser);

    const payload = { sub: newUser.id, username: newUser.username, email: newUser.email };
    return this.jwtService.sign(payload);
  }
}