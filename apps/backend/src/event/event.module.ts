import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventRepository } from './event.repository';
import { EventRatingsRepository } from './eventRatings.repository';
import { EventRatings } from './entities/event-rating.entity';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventRatings]),
    AuthModule,
    UserModule,
  ],
  controllers: [EventController],
  providers: [EventService, EventRepository, EventRatingsRepository],
  exports: [EventService],
})
export class EventModule {}
