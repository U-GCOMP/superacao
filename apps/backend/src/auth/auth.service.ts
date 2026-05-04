import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { UserModel } from '@project/shared/src/models/user.model';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  login(email: string, password: string): string {
    const user = this.authRepository.getUserByEmail(email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (user.password !== password) throw new Error('Invalid credentials');

    return 'fake-jwt-token';
  }

  register(username: string, email: string, password: string): string {
    const user = this.authRepository.getUserByEmail(email);

    if (user) {
      throw new Error('This email is already used.');
    }

    const newUser = new UserModel(username, email, password);
    this.authRepository.saveUser(newUser);

    // Lacking e-mail confirmation. Probably gonna end-up doing separate module for that, since other functionalities are gonna use e-mail sending

    return 'fake-jwt-token';
  }
}
