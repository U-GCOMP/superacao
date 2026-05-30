import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRatings } from './entities/user-ratings.entity';

@Injectable()
export class UserRatingsRepository {
  constructor(
    @InjectRepository(UserRatings)
    private readonly typeormRepo: Repository<UserRatings>,
  ) {}

  async createUserRating(
    authorId: number,
    targetId: number,
    rating: number,
    comment?: string,
  ): Promise<UserRatings> {
    const newUserRating = this.typeormRepo.create({
      author_id: authorId,
      target_id: targetId,
      rating: rating,
      comment: comment,
    });

    return this.typeormRepo.save(newUserRating);
  }
}
