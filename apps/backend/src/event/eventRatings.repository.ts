import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventRatings } from './entities/event-rating.entity';
import { Users } from '../auth/entities/user.entity';

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
      .andWhere('user.is_deleted = :deleted', { deleted: false })
      .getMany();
  }
}
