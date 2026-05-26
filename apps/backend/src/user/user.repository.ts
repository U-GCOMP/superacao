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

  async getUserByID(id: number): Promise<Users | null> {
    return this.typeormRepo.findOne({ where: { id } });
  }

  async saveUser(userData: Partial<Users>): Promise<Users> {
    const User = this.typeormRepo.create(userData);
    return this.typeormRepo.save(User);
  }

  async getUserWithEventsByID(id: number): Promise<Users | null> {
    return this.typeormRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.events_organized', 'events_organized')
      .leftJoinAndSelect('user.events_participated', 'events_participated')
      .leftJoinAndSelect('events_participated.event', 'event')
      .leftJoinAndSelect('user.ratings_received', 'ratings_received')
      .leftJoinAndSelect(
        'ratings_received.author',
        'author',
        'author.is_deleted = :isDeleted',
        { isDeleted: false },
      )
      .where('user.id = :id', { id })
      .getOne();
  }
}
