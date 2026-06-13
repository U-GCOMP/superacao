import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventRatings } from './entities/event-rating.entity';
import { Users } from '../auth/entities/user.entity';
import { RegisterEventRatingRequestDTO } from '@project/shared';

@Injectable()
export class EventRatingsRepository {
  constructor(
    @InjectRepository(EventRatings)
    private readonly typeormRepo: Repository<EventRatings>,
  ) {}

  async fetchEventRatings(event_id: string): Promise<EventRatings[]> {
    return this.typeormRepo
      .createQueryBuilder('eventRating')
      .innerJoinAndSelect(Users, 'user', 'user.id = eventRating.author_id')
      .where('eventRating.event_id = :eventId', { eventId: event_id })
      .getMany();
  }

  async findUserRating(eventId: string, userId: number): Promise<EventRatings | null> {
    return this.typeormRepo.findOne({
      where: {
        event_id: eventId,
        author_id: userId,
      },
    });
  }

  async saveEventRating(params: RegisterEventRatingRequestDTO): Promise<void> {
    const safeComment = params.comment ?? undefined;

    const ratingsToSave = [
      {
        event_id: params.target_id,
        author_id: params.author_id,
        category_id: 1,
        rating: params.organized_rating,
        comment: safeComment,
      },
      {
        event_id: params.target_id,
        author_id: params.author_id,
        category_id: 2,
        rating: params.punctuality_rating,
        comment: safeComment, 
      },
      {
        event_id: params.target_id,
        author_id: params.author_id,
        category_id: 3,
        rating: params.infrastructure_rating,
        comment: safeComment,
      },
      {
        event_id: params.target_id,
        author_id: params.author_id,
        category_id: 4,
        rating: params.accessibility_rating,
        comment: safeComment,
      },
    ];

    const createdRatings = this.typeormRepo.create(ratingsToSave);
    
    await this.typeormRepo.save(createdRatings);
  }
}
