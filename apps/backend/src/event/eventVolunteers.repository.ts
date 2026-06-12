import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventVolunteers } from './entities/event-volunteers.entity';

@Injectable()
export class EventVolunteersRepository {
  constructor(
    @InjectRepository(EventVolunteers)
    private readonly typeormRepo: Repository<EventVolunteers>,
  ) {}

  async saveSubscription(eventId: string, userId: number): Promise<void> {
    await this.typeormRepo.insert({
      event_id: eventId,
      user_id: userId,
    });
  }

  async getSubscription(
    eventId: string,
    userId: number,
  ): Promise<EventVolunteers | null> {
    return this.typeormRepo.findOne({
      where: {
        event_id: eventId,
        user_id: userId,
      },
    });
  }

  async getSubscriptions(userId: number): Promise<EventVolunteers[] | null> {
    return this.typeormRepo.find({ where: { user_id: userId } });
  }

  // NOTE: Hard deleting msm, porque entidade não tem atributo para soft delete
  async removeSingleSubscription(
    eventId: string,
    userId: number,
  ): Promise<void> {
    await this.typeormRepo.delete({
      event_id: eventId,
      user_id: userId,
    });
  }
}
