import { Module } from '@nestjs/common';
import { EventRatingService } from './eventRatings.service';
import { EventRatingController } from './eventRatings.controller';
import { EventRatingRepository } from './eventRatings.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventRatings } from './entities/event-rating.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventRatings])],
  controllers: [EventRatingController],
  providers: [EventRatingService, EventRatingRepository],
})
export class EventRatingModule {}
