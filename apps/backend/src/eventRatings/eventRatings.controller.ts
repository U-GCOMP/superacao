/* eslint-disable prettier/prettier */
import { Controller, Get, Query} from '@nestjs/common';
import { EventRatingService } from './eventRatings.service';

import { FetchEventRatingsEventRequestDTO,
  FetchEventRatingsEventRequestSchema,
  FetchEventRatingsEventResponseDTO,
} from '@project/shared';

@Controller('ratings') 
export class EventRatingController {
  constructor(private readonly eventRatingService: EventRatingService) {}

  @Get()
  async fetch(@Query() query: FetchEventRatingsEventRequestDTO): Promise<FetchEventRatingsEventResponseDTO[]> {
    const validQuery = FetchEventRatingsEventRequestSchema.parse(query);

    return await this.eventRatingService.fetch(validQuery.eventId);
  }
}
