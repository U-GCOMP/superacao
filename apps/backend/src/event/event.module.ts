import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventRepository } from './event.repository';
import { EventRatingsRepository } from './eventRatings.repository';
import { EventVolunteersRepository } from './eventVolunteers.repository';
import { EventRatings } from './entities/event-rating.entity';
import { EventVolunteers } from './entities/event-volunteers.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventRatings, EventVolunteers]),
    AuthModule,
  ],
  controllers: [EventController],
  providers: [
    EventService,
    EventRepository,
    EventRatingsRepository,
    EventVolunteersRepository,
  ],
  exports: [EventService],
})
export class EventModule {}
