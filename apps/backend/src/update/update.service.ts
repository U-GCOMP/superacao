import { Injectable } from '@nestjs/common';
import { UpdateRepository } from './update.repository';
import { UserModel } from '@project/shared';

@Injectable()
export class UpdateService {
  constructor(private readonly updateRepository: UpdateRepository) {}

  update(newUsername: string, email: string): string {
    const user = this.updateRepository.getUserByEmail(email);

    if (!user) {
      throw new Error('This user doesn`t exist.');
    }

    const updatedUser = new UserModel(newUsername, user.email, user.password);
    this.updateRepository.saveUser(updatedUser);

    return 'fake-jwt-token';
  }
}
