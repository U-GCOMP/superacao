import { Injectable } from '@nestjs/common';
import { UserModel } from './models/user.model';

@Injectable()
export class AuthRepository {
  private mockedMap: { [key: string]: UserModel } = {
    'email@email.com': new UserModel('1', 'email@email.com', '123'),
    'admin@email.com': new UserModel('2', 'admin@email.com', '123'),
  };

  getUserByEmail(email: string): UserModel | null {
    return this.mockedMap[email] || null;
  }

  saveUser(user: UserModel): void {
    this.mockedMap[user.email] = user;
  }
}
