import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  login(email: string, password: string): string {
    const userModel = this.authRepository.getUserByEmail(email);

    if (!userModel) throw new Error('Invalid credentials');

    const userEntity = userModel.toEntity();

    if (userEntity.password !== password)
      throw new Error('Invalid credentials');

    return 'fake-jwt-token';
  }
}
