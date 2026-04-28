import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { UserModel } from './models/user.model';

@Injectable()
export class AuthRepository {
  private mockedMap: { [key: string]: UserEntity } = {
    'email@email.com': new UserEntity('1', 'email@email.com', '123'),
    'admin@email.com': new UserEntity('2', 'admin@email.com', '123'),
  };

  getUserByEmail(email: string): UserEntity | null {
    return this.mockedMap[email] || null;
  }

  saveUser(user: UserModel): void {
    const userEntity = user.toEntity();

    this.mockedMap[user.email] = userEntity;
  }
}
