import { Injectable } from '@nestjs/common';
import { UserModel } from './models/user.model';

@Injectable()
export class AuthRepository {
  getUserByEmail(email: string): UserModel | null {
    const mockedMap: { [key: string]: UserModel } = {
      'email@email.com': new UserModel('1', 'email@email.com', '123'),
      'admin@email.com': new UserModel('2', 'admin@email.com', '123'),
    };

    return mockedMap[email] || null;
  }
}
