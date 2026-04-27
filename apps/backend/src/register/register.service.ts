import { Injectable } from '@nestjs/common';
import { RegisterRepository } from './register.repository';
import { UserModel } from '@project/shared';

@Injectable()
export class RegisterService {
  constructor(private readonly registerRepository: RegisterRepository) {}

  register(username: string, email: string, password: string): string {
    const userAlreadyExists = this.registerRepository.getUserByEmail(email);

    if (userAlreadyExists) {
      throw new Error('This email is already used.');
    }

    const newUser = new UserModel(username, email, password);
    this.registerRepository.saveUser(newUser);

    // Lacking e-mail confirmation. Probably gonna end-up doing separate module for that, since other functionalities are gonna use e-mail sending

    return 'fake-jwt-token';
  }
}
