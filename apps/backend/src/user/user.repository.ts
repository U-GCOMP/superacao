import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../auth/entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(Users)
    private readonly typeormRepo: Repository<Users>,
  ) {}

  async getUserByEmail(email: string): Promise<Users | null> {
    return this.typeormRepo.findOne({ where: { email } });
  }

  async saveUser(userData: Partial<Users>): Promise<Users> {
    const User = this.typeormRepo.create(userData);
    return this.typeormRepo.save(User);
  }

  async disableUser(email: string): Promise<string> {
    await this.typeormRepo.update({ email }, { is_deleted: true });
    return 'Usuário desativado com sucesso';
  }
}
