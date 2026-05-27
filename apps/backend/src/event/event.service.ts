import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventRepository } from './event.repository';
import { EventRatingsRepository } from './eventRatings.repository';
import {
  FetchEventListQueryParametersDTO,
  FetchEventListItemResponseDTO,
  RegisterEventRequestDTO,
  FetchEventRatingsEventResponseDTO,
  FetchUserSubscribedEventDTO,
} from '@project/shared';
import {
  FetchEventDetailsRequestDTO,
  FetchEventDetailsResponseDTO,
} from '@project/shared/src/dtos/event/fetch-event-details.dto';
import { Users } from '../auth/entities/user.entity';
import { ConfigService } from '@nestjs/config';

import { randomUUID } from 'crypto';
import { join } from 'path';
import { writeFile } from 'fs/promises';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class EventService {
  constructor(
    private readonly eventsRepository: EventRepository,
    private readonly eventRatingRepository: EventRatingsRepository,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  private readonly DEFAULT_EVENT_IMAGE = 'https://i.ibb.co/pvnYzhb4/fundo.jpg';

  async fetchEvents(
    params: FetchEventListQueryParametersDTO,
  ): Promise<FetchEventListItemResponseDTO[]> {
    const events = await this.eventsRepository.findEvents(params);

    return events.map((event) => ({
      eventId: event.id,
      imageUrl: event.imageUrl ?? this.DEFAULT_EVENT_IMAGE,
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
      imageUrl: event.imageUrl ?? 'https://i.ibb.co/pvnYzhb4/fundo.jpg',
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

  async createImageUrl(image: Express.Multer.File): Promise<string> {
    const imagesPath = this.configService.get<string>('IMAGES_PATH');

    if (!imagesPath) {
      throw new Error('IMAGES_PATH is not defined');
    }

    const mimeExtensions: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
    };

    const extension = mimeExtensions[image.mimetype];

    if (!extension) {
      throw new Error('Unsupported image type');
    }

    const fileName = `${randomUUID()}${extension}`;

    const fullPath = join(imagesPath, fileName);

    await writeFile(fullPath, image.buffer);

    return fileName;
  }

  async registerEvent(
    params: RegisterEventRequestDTO,
    owner: Users,
    image: Express.Multer.File | undefined,
  ): Promise<string> {
    if (params.startDate >= params.endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    let imageUrl = 'https://i.ibb.co/pvnYzhb4/fundo.jpg';
    if (image) {
      const filename = await this.createImageUrl(image);
      imageUrl =
        this.configService.get<string>('BASE_URL') +
        '/events/image/' +
        filename;
    }

    const event = await this.eventsRepository.registerEvent(
      params,
      owner,
      imageUrl,
    );
    return event.id;
  }

  async fetchEventRatings(
    event_id: string,
  ): Promise<FetchEventRatingsEventResponseDTO[]> {
    const eventRatings =
      await this.eventRatingRepository.fetchEventRatings(event_id);

    return eventRatings.map((rating) => ({
      authorId: rating.author_id,
      categoryId: rating.category_id,
      rating: rating.rating,
      comment: rating.comment || '',
    }));
  }

  async getUserSubscribedEvents(
    email: string,
  ): Promise<FetchUserSubscribedEventDTO[]> {
    const user = await this.userRepository.getUserWithEventsByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const events = user.events_participated;

    return events.map((e) => ({
      eventId: e.event.id,
      date: e.event.date,
      description: e.event.description,
      title: e.event.title,
      imageUrl: e.event.imageUrl ?? this.DEFAULT_EVENT_IMAGE,
      maxVolunteers: e.event.volunteers_max,
      status: e.event.status,
      volunteersCount: e.event.volunteers_count,
    }));
  }
}
