import { Injectable } from '@nestjs/common';
import { UserModel } from '@project/shared';

@Injectable()
export class RegisterRepository {
  private mockedMap: { [key: string]: UserModel } = {
    'email@email.com': new UserModel('username1', 'email@email.com', '123'),
  };

  getUserByEmail(email: string): UserModel | null {
    return this.mockedMap[email] || null;
  }

  saveUser(user: UserModel): void {
    this.mockedMap[user.email] = user;
  }
}
