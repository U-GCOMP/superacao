/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { EventRatingRepository } from './eventRatings.repository';
import { FetchEventRatingsEventResponseDTO } from '@project/shared';

@Injectable()
export class EventRatingService {
  constructor(private readonly eventRatingRepository: EventRatingRepository) {}

  async fetch(event_id: string): Promise<FetchEventRatingsEventResponseDTO[]> {
    const eventRatings = await this.eventRatingRepository.fetchEventRatings(event_id);

    return eventRatings.map((rating) => ({
      authorId: rating.author_id,
      categoryId: rating.category_id, 
      rating: rating.rating,
      comment: rating.comment || '',
    }));
  }
}
