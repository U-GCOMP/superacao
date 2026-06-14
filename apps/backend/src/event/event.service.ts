import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { EventRepository } from './event.repository';
import { EventRatingsRepository } from './eventRatings.repository';
import { EventVolunteersRepository } from './eventVolunteers.repository';
import {
  FetchEventListQueryParametersDTO,
  FetchEventListItemResponseDTO,
  RegisterEventRequestDTO,
  EventSubscriptionResponseDTO,
  EventOwnershipResponseDTO,
  RegisterEventRatingRequestDTO,
  RegisterEventRatingResponseDTO,
  RegisterEventRatingResponseSchema,
  FetchEventHistogramResponseDTO,
  FetchEventWordCloudResponseDTO,
} from '@project/shared';
import {
  FetchEventDetailsRequestDTO,
  FetchEventDetailsResponseDTO,
} from '@project/shared/src/dtos/event/fetch-event-details.dto';
import {
  SubscribeToEventResponseSchema,
  SubscribeToEventResponseDTO,
} from '@project/shared/src/dtos/event/subscribe-to-event.dto';
import { ConfigService } from '@nestjs/config';

import { randomUUID } from 'crypto';
import { join } from 'path';
import { AuthRepository } from '../auth/auth.repository';
import { mkdir, writeFile, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import { EventCategoriesEnum } from './enums/event-category.enum';
import { WORD_CLOUD_BLACK_LIST } from './constants/word-cloud-black-list';

@Injectable()
export class EventService {
  constructor(
    private readonly eventsRepository: EventRepository,
    private readonly eventRatingRepository: EventRatingsRepository,
    private readonly eventVolunteersRepository: EventVolunteersRepository,
    private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService,
  ) {}

  async fetchEvents(
    params: FetchEventListQueryParametersDTO,
  ): Promise<FetchEventListItemResponseDTO[]> {
    const events = await this.eventsRepository.findEvents(params);

    return events.map((event) => ({
      eventId: event.id,
      imageUrl:
        event.imageUrl && !event.imageUrl.startsWith('http')
          ? `http://localhost:3000/events/image/${event.imageUrl}`
          : (event.imageUrl ?? 'https://i.ibb.co/pvnYzhb4/fundo.jpg'), //Rapha, had to alter here from your original implementation, in onder to have actual url application URL that browser understands, otherwise even with imageURL stored inside DB wouldn`t load browser
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
      throw new NotFoundException('Evento não encontrado');
    }

    const ratingsGroupedByAuthor: Record<
      string,
      {
        id: string;
        userId: string;
        userName: string;
        comment: string;
        sum: number;
        count: number;
      }
    > = {};

    if (event.ratings && event.ratings.length > 0) {
      event.ratings.forEach((entry) => {
        if (!entry.author) {
          return;
        }

        const authorKey = String(entry.author_id);

        if (!ratingsGroupedByAuthor[authorKey]) {
          ratingsGroupedByAuthor[authorKey] = {
            id: entry.id,
            userId: authorKey,
            userName: entry.author.username,
            comment: entry.comment || '',
            sum: 0,
            count: 0,
          };
        }

        ratingsGroupedByAuthor[authorKey].sum += entry.rating;
        ratingsGroupedByAuthor[authorKey].count += 1;

        if (entry.comment && !ratingsGroupedByAuthor[authorKey].comment) {
          ratingsGroupedByAuthor[authorKey].comment = entry.comment;
        }
      });
    }

    const formattedRatings = Object.values(ratingsGroupedByAuthor).map(
      (group) => ({
        id: group.id,
        userId: group.userId,
        userName: group.userName,
        comment: group.comment,
        score:
          group.count > 0 ? Number((group.sum / group.count).toFixed(2)) : 1,
      }),
    );

    const totalUsersWhoVoted = formattedRatings.length;

    const averageScore =
      totalUsersWhoVoted > 0
        ? formattedRatings.reduce((acc, item) => acc + item.score, 0) /
          totalUsersWhoVoted
        : 0;

    const balancedRatingSum = Number(
      (averageScore * totalUsersWhoVoted).toFixed(2),
    );

    let organizerData = {
      id: 0,
      name: 'Usuário não encontrado',
    };

    if (event.owner) {
      organizerData = {
        id: event.owner.id,
        name: event.owner.username ?? 'Usuário não encontrado',
      };
    }

    let volunteers: { id: string; name: string }[] | undefined = undefined;

    if (event.status === 'COMPLETED' && event.volunteers) {
      const activeVolunteers = event.volunteers.filter(
        (vol) => vol.user !== null && vol.user !== undefined,
      );

      volunteers = activeVolunteers.map((vol) => ({
        id: String(vol.user?.id),
        name: vol.user?.username ?? 'Usuário Desconhecido',
      }));
    }

    return {
      id: event.id,
      imageUrl:
        event.imageUrl && !event.imageUrl.startsWith('http')
          ? `http://localhost:3000/events/image/${event.imageUrl}`
          : (event.imageUrl ?? 'https://i.ibb.co/pvnYzhb4/fundo.jpg'),
      title: event.title,
      description: event.description ?? '',
      volunteersCount: event.volunteers_count,
      place: event.place,
      subscriptionDeadlineDate: event.volunteers_subscription_deadline_date,
      maxVolunteers: event.volunteers_max,
      status: event.status,
      date: event.date,
      organizer: organizerData,
      rating_sum: balancedRatingSum,
      rating_count: totalUsersWhoVoted,
      ratings: formattedRatings,
      volunteers: volunteers,
    };
  }

  async deleteEventImage(filename: string): Promise<void> {
    const imagesPath = this.configService.get<string>('IMAGES_PATH_EVENTS');

    if (!imagesPath) {
      throw new Error('IMAGES_PATH_EVENTS não definido');
    }

    const fullPath = join(imagesPath, filename);

    try {
      await unlink(fullPath);
    } catch {
      console.debug("file doesn't exists");
    }
  }

  async createImageUrl(image: Express.Multer.File): Promise<string> {
    const imagesPath = this.configService.get<string>('IMAGES_PATH_EVENTS');

    if (!imagesPath) {
      throw new Error('IMAGES_PATH_EVENTS não definido');
    }

    if (!existsSync(imagesPath)) {
      await mkdir(imagesPath, { recursive: true });
    }

    const mimeExtensions: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
    };

    const extension = mimeExtensions[image.mimetype];

    if (!extension) {
      throw new Error('Tipo de imagem não suportado');
    }

    const fileName = `${randomUUID()}${extension}`;

    const fullPath = join(imagesPath, fileName);

    await writeFile(fullPath, image.buffer);

    return fileName;
  }

  async updateEvent(
    params: RegisterEventRequestDTO,
    ownerId: number,
    eventId: string,
    image: Express.Multer.File,
  ): Promise<string> {
    if (params.startDate >= params.endDate) {
      throw new BadRequestException(
        'A data de início deve ser anterior à data de término',
      );
    }

    const owner = await this.authRepository.getUserById(ownerId);

    if (!owner) {
      throw new ForbiddenException('Um evento precisa ter um proprietário');
    }

    const event =
      await this.eventsRepository.getEventByIdWithOwnerInfo(eventId);

    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    if (ownerId !== event.owner.id) {
      throw new ForbiddenException(
        'O usuário atual não é o proprietário deste evento.',
      );
    }

    // Defaults to default image
    //let imageUrl = 'https://i.ibb.co/pvnYzhb4/fundo.jpg';
    // Defaults to previous image
    let imageUrl = event.imageUrl;
    if (image) {
      const prevImageUrl = event.imageUrl;
      if (prevImageUrl) {
        const pattern =
          /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[a-zA-Z0-9]+)$/;
        const match = prevImageUrl.match(pattern);
        if (match?.[0]) {
          await this.deleteEventImage(match[0]);
        }
      }
      imageUrl = await this.createImageUrl(image);
    }

    if (params.maxSlots < event.volunteers_max) {
      throw new BadRequestException(
        'O número máximo de vagas não pode ser reduzido',
      );
    }

    const endDate = new Date(params.endDate);

    if (endDate < event.volunteers_subscription_deadline_date) {
      throw new BadRequestException(
        'A data limite para inscrições não pode ser adiantada',
      );
    }

    const date = new Date(params.startDate);
    const [hours, minutes] = params.startTime.split(':').map(Number);
    date.setHours(hours, minutes, 0, 0);

    event.title = params.title;
    event.description = params.description;
    event.place = params.place;
    event.volunteers_max = params.maxSlots;
    event.date = date;
    event.volunteers_subscription_deadline_date = params.endDate;
    event.imageUrl = imageUrl;

    await this.eventsRepository.saveEvent(event);

    return event.id;
  }

  async registerEvent(
    params: RegisterEventRequestDTO,
    ownerId: number,
    image: Express.Multer.File,
  ): Promise<string> {
    if (params.startDate >= params.endDate) {
      throw new BadRequestException(
        'A data de início deve ser anterior à data de término',
      );
    }

    let imageUrl = 'https://i.ibb.co/pvnYzhb4/fundo.jpg';
    if (image) {
      imageUrl = await this.createImageUrl(image);
    }

    const owner = await this.authRepository.getUserById(ownerId);

    if (!owner) {
      throw new ForbiddenException('Um evento deve ter um proprietário');
    }

    const event = await this.eventsRepository.registerEvent(
      params,
      owner,
      imageUrl,
    );
    return event.id;
  }

  async subscribeEvent(
    event_id: string,
    user_id: number,
  ): Promise<SubscribeToEventResponseDTO> {
    const event = await this.eventsRepository.getEventById(event_id);

    // NOTE: .findOne from typeorm standard behavior is to either return one or nothing, so this fucker of LSP seems to not enjoy that it can be null or undefined event, even though we all know event is gonna exist because user is gonna subscribe to an event trough its own event details page, that was accessed through event listing (that only brings events that exist). So this mf is here only to not use attribute "?" after event on the other ifs
    if (!event) {
      throw new NotFoundException('O evento especificado não existe.');
    }

    if (event.status != 'SCHEDULED') {
      throw new ConflictException('Esse evento já ocorreu ou está cancelado');
    }

    if (event.volunteers_count > event?.volunteers_max) {
      throw new ConflictException('Esse evento está lotado');
    }

    const subscription = await this.eventVolunteersRepository.getSubscription(
      event_id,
      user_id,
    );

    if (subscription) {
      throw new ConflictException('Usuário já inscrito em evento');
    }

    await this.eventVolunteersRepository.saveSubscription(event_id, user_id);

    await this.eventsRepository.saveEvent({
      id: event.id,
      volunteers_count: event.volunteers_count + 1,
    });

    const responsePayload = {
      eventId: event_id,
      userId: user_id,
    };

    return SubscribeToEventResponseSchema.parse(responsePayload);
  }

  async eventSubscription(
    userId: number,
    eventId: string,
  ): Promise<EventSubscriptionResponseDTO> {
    const subscription = await this.eventVolunteersRepository.getSubscription(
      eventId,
      userId,
    );

    return {
      subscribed: !!subscription,
    };
  }

  async eventOwnership(
    userId: number,
    eventId: string,
  ): Promise<EventOwnershipResponseDTO> {
    const event =
      await this.eventsRepository.getEventByIdWithOwnerInfo(eventId);

    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    const owns = event.owner.id == userId;

    return {
      owns,
    };
  }

  async deactivateEvent(eventId: string, userId: number): Promise<void> {
    const event =
      await this.eventsRepository.findEventByIdWithOrganizerData(eventId);

    // Nao eh para cair em nenhum desses if, pois o front ja vai tratar isso,
    // i.e. o botao soh vai aparecer se o user for o dono e se o evento nao estiver
    // nem cancelado nem concluido, apenas coloquei como guardrail por seguranca
    if (!event) {
      throw new NotFoundException('Evento não encontrado.');
    }

    if (event.owner.id !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para desativar este evento. Apenas o organizador pode realizar esta ação.',
      );
    }

    if (event.status === 'CANCELED') {
      throw new ConflictException('Este evento já está cancelado.');
    }

    if (event.status === 'COMPLETED') {
      throw new ConflictException(
        'Não é possível cancelar um evento que já foi concluído.',
      );
    }

    await this.eventsRepository.saveEvent({
      id: event.id,
      status: 'CANCELED',
    });
  }

  async deactivateAllDeactivatedUserEvents(userId: number): Promise<void> {
    const events = await this.eventsRepository.getEventsByUserId(userId);

    console.log('EVENTOS ENCONTRADOS PARA O USER:', events);

    if (!events || events.length === 0) {
      return;
    }

    const scheduledEvents = events.filter(
      (event) => event.status === 'SCHEDULED',
    );

    if (scheduledEvents.length === 0) {
      return;
    }

    for (const event of scheduledEvents) {
      await this.eventsRepository.saveEvent({
        id: event.id,
        status: 'CANCELED',
      });
    }
  }

  async unsubscribeAllEventsDeactivatedUser(userId: number): Promise<void> {
    const subscriptions =
      (await this.eventVolunteersRepository.getSubscriptions(userId)) ?? [];

    if (subscriptions.length === 0) return;

    for (const sub of subscriptions) {
      const event = await this.eventsRepository.getEventById(sub.event_id);

      if (event && event.status === 'SCHEDULED') {
        await this.eventsRepository.decrementVolunteersCount(event.id);

        await this.eventVolunteersRepository.removeSingleSubscription(
          event.id,
          userId,
        );
      }
    }
  }

  async registerEventRating(
    params: RegisterEventRatingRequestDTO,
  ): Promise<RegisterEventRatingResponseDTO> {
    const event = await this.eventsRepository.getEventById(params.target_id);
    if (!event) {
      throw new NotFoundException('O evento especificado não existe.');
    }

    if (event.status !== 'COMPLETED') {
      throw new BadRequestException(
        'Apenas eventos concluídos podem ser avaliados.',
      );
    }

    const isParticipant = await this.eventsRepository.isUserParticipant(
      params.target_id,
      params.author_id,
    );

    if (!isParticipant) {
      throw new ForbiddenException(
        'Apenas usuários que participaram do evento podem avaliá-lo.',
      );
    }

    const existingRating = await this.eventRatingRepository.findUserRating(
      params.target_id,
      params.author_id,
    );

    if (existingRating) {
      throw new ConflictException('Você já avaliou este evento.');
    }

    await this.eventRatingRepository.saveEventRating(params);

    return RegisterEventRatingResponseSchema.parse({
      target_id: params.target_id,
      author_id: params.author_id,
      organized_rating: params.organized_rating,
      punctuality_rating: params.punctuality_rating,
      infrastructure_rating: params.infrastructure_rating,
      accessibility_rating: params.accessibility_rating,
      comment: params.comment,
    });
  }

  async checkIfVolunteerParticipatedInCompletedEvent(
    organizerId: number,
    volunteerId: number,
  ): Promise<boolean> {
    return this.eventsRepository.checkIfVolunteerParticipatedInCompletedEvent(
      organizerId,
      volunteerId,
    );
  }

  async fetchEventHistogram(params: {
    eventId: string;
  }): Promise<FetchEventHistogramResponseDTO> {
    const eventExists = await this.eventsRepository.eventExists(params.eventId);

    if (!eventExists) {
      throw new NotFoundException('O evento especificado não existe.');
    }

    const eventRawMetrics =
      await this.eventRatingRepository.fetchRawMetricsByEvent(params.eventId);

    const result: FetchEventHistogramResponseDTO = {
      histogram: eventRawMetrics.map((metric) => {
        const categoryId = Number(metric.categoryId);

        const label = EventCategoriesEnum[categoryId] || 'Outros';
        const value = parseFloat(Number(metric.average).toFixed(1));

        return {
          label,
          value,
        };
      }),
    };

    return result;
  }

  async fetchEventMostCommentedWords(params: {
    eventId: string;
    limit?: number;
  }): Promise<FetchEventWordCloudResponseDTO> {
    const eventExists = await this.eventsRepository.eventExists(params.eventId);

    if (!eventExists) {
      throw new NotFoundException('O evento especificado não existe.');
    }

    const comments =
      await this.eventRatingRepository.fetchAllRatingCommentsByEventId(
        params.eventId,
        params.limit,
      );

    const wordCounts: Record<string, number> = {};

    for (const comment of comments) {
      const cleanText = comment.comment
        .toLowerCase()
        .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'\n\r]/g, ' ');

      const words = cleanText.split(/\s+/);

      for (const word of words) {
        if (!word || word.length <= 2 || WORD_CLOUD_BLACK_LIST.has(word)) {
          continue;
        }

        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    }

    const result: FetchEventWordCloudResponseDTO = Object.entries(wordCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .map(([word, count]) => ({ word, count }));

    return result;
  }
}
