import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserModel } from '@project/shared/src/models/user.model';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  update(newUsername: string, email: string): string {
    const user = this.userRepository.getUserByEmail(email);

    if (!user) {
      throw new Error('This user doesn`t exist.');
    }

    const updatedUser = new UserModel(newUsername, user.email, user.password);
    this.userRepository.saveUser(updatedUser);

    return 'fake-jwt-token';
  }
}
