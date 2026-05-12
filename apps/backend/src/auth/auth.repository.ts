import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(Users)
    private readonly typeormRepo: Repository<Users>,
  ) {}

  async getUserByEmail(email: string): Promise<Users | null> {
    return this.typeormRepo.findOne({ where: { email } });
  }

  async saveUser(userData: Partial<Users>): Promise<Users> {
    const newUser = this.typeormRepo.create(userData);
    return this.typeormRepo.save(newUser);
  }

  async getUserById(id: number): Promise<Users | null> {
    return this.typeormRepo.findOne({ where: { id } });
  }
}
