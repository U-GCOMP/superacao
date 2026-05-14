/* eslint-disable prettier/prettier */
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async update(newUsername: string, email: string): Promise<string> {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      throw new ConflictException('This user doesn`t exist.');
    }

    user.username = newUsername;

    await this.userRepository.saveUser(user);

    return 'Success';
  }
}
