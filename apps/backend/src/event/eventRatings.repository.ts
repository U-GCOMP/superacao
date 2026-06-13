import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
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

  async findUserRating(
    eventId: string,
    userId: number,
  ): Promise<EventRatings | null> {
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

  async fetchRawMetricsByEvent(eventId: string): Promise<
    {
      categoryId: string | number;
      average: string | number;
    }[]
  > {
    return this.typeormRepo
      .createQueryBuilder('rating')
      .select('rating.category_id', 'categoryId')
      .addSelect('AVG(rating.rating)', 'average')
      .addSelect('COUNT(rating.id)', 'totalVotes')
      .where('rating.event_id = :eventId', { eventId })
      .groupBy('rating.category_id')
      .getRawMany<{
        categoryId: string | number;
        average: string | number;
      }>();
  }

  async fetchAllRatingCommentsByEventId(
    eventId: string,
    limit?: number,
  ): Promise<{ comment: string }[]> {
    const ratings = await this.typeormRepo.find({
      where: {
        event_id: eventId,
        comment: Not(IsNull()),
      },
      select: {
        comment: true,
      },
      take: limit,
    });

    const comments = ratings.map((rating) => ({
      comment: rating.comment!,
    }));

    return comments;
  }
}
