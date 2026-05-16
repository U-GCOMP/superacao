import { Injectable, NotFoundException } from '@nestjs/common';
import { EventRepository } from './event.repository';
import {
  FetchEventListQueryParametersDTO,
  FetchEventListItemResponseDTO,
} from '@project/shared';
import {
  FetchEventDetailsRequestDTO,
  FetchEventDetailsResponseDTO,
} from '@project/shared/src/dtos/event/fetch-event-details.dto';

@Injectable()
export class EventService {
  constructor(private readonly eventsRepository: EventRepository) {}

  async fetchEvents(
    params: FetchEventListQueryParametersDTO,
  ): Promise<FetchEventListItemResponseDTO[]> {
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

  async fetchEventDetails(
    params: FetchEventDetailsRequestDTO,
  ): Promise<FetchEventDetailsResponseDTO> {
    const event = await this.eventsRepository.findEventByIdWithOrganizerData(
      params.eventId,
    );

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    console.debug(event);

    return {
      id: event.id,
      imageUrl:
        event.imageUrl ??
        'https://img.magnific.com/free-photo/beautiful-view-sunset-sea_23-2148019892.jpg?size=626&ext=jpg',
      title: event.title,
      description: event.description ?? '',
      volunteersCount: event.volunteers_count,
      maxVolunteers: event.volunteers_max,
      status: event.status,
      date: event.date,
      organizer: {
        id: event.owner.id,
        name: event.owner.username,
      },
    };
  }
}
