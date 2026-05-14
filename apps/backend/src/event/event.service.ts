import { Injectable } from '@nestjs/common';
import { EventRepository } from './event.repository';
import {
  FetchEventQueryParametersDTO,
  FetchEventResponseDTO,
} from '@project/shared';

@Injectable()
export class EventService {
  constructor(private readonly eventsRepository: EventRepository) {}

  async fetchEvents(
    params: FetchEventQueryParametersDTO,
  ): Promise<FetchEventResponseDTO[]> {
    const events = await this.eventsRepository.findEvents(params);

    return events.map((event) => ({
      eventId: event.id,
      imageUrl:
        event.imageUrl ??
        'https://img.magnific.com/free-photo/beautiful-view-sunset-sea_23-2148019892.jpg?size=626&ext=jpg',
      title: event.title,
      description: event.description ?? '',
      volunteersCount: event.volunteers_count,
      maxVolunteers: event.volunteers_max,
      status: event.status,
      date: event.date,
    }));
  }
}
