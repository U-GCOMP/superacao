import {
  Injectable,
  ForbiddenException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserRatingsRepository } from './userRatings.repository';

import {
  FetchUserProfileResponseSchema,
  FetchUserProfileResponseDTO,
  FetchEventListItemResponseDTO,
  RegisterUserRatingResponseSchema,
  RegisterUserRatingResponseDTO,
} from '@project/shared';
import { join } from 'path';
import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { EventService } from '../event/event.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userRatingsRepository: UserRatingsRepository,
    private readonly configService: ConfigService,
    private readonly eventService: EventService,
  ) {}

  async updateUsername(newUsername: string, id: number): Promise<string> {
    const user = await this.userRepository.getUserByID(id);

    if (!user) {
      throw new NotFoundException('Esse usuário não existe.');
    }

    user.username = newUsername;

    await this.userRepository.saveUser(user);

    return 'Success';
  }

  async createImageUrl(image: Express.Multer.File): Promise<string> {
    const imagesPath = this.configService.get<string>('IMAGES_PATH_USERS');

    if (!imagesPath) {
      throw new Error('IMAGES_PATH_USERS is not defined');
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
      throw new Error('Unsupported image type');
    }

    const fileName = `${randomUUID()}${extension}`;
    const fullPath = join(imagesPath, fileName);

    await writeFile(fullPath, image.buffer);

    return fileName;
  }

  async updateImage(file: Express.Multer.File, id: number): Promise<string> {
    const user = await this.userRepository.getUserByID(id);

    if (!user) {
      throw new NotFoundException('Esse usuário não existe.');
    }

    const fileName = await this.createImageUrl(file);

    user.imageUrl = fileName;

    await this.userRepository.saveUser(user);

    return fileName;
  }

  async updateBio(newBio: string, id: number): Promise<string> {
    const user = await this.userRepository.getUserByID(id);

    if (!user) {
      throw new NotFoundException('Esse usuário não existe.');
    }

    user.bio = newBio;

    await this.userRepository.saveUser(user);

    return 'Success';
  }

  async disable(id: number): Promise<string> {
    const user = await this.userRepository.getUserByID(id);

    if (!user) {
      throw new NotFoundException('Esse usuário não existe.');
    }

    // NOTE: To turn all SCHEDULED events organized by user into CANCELED
    await this.eventService.deactivateAllDeactivatedUserEvents(id);

    // NOTE: To remove all subscriptions as volunteer on people`s events
    await this.eventService.unsubscribeAllEventsDeactivatedUser(id);

    user.deleted_at = new Date();

    await this.userRepository.saveUser(user);

    return 'Success';
  }

  async fetchUserProfile(id: number): Promise<FetchUserProfileResponseDTO> {
    const user = await this.userRepository.getUserWithEventsByID(id);

    if (!user) {
      throw new NotFoundException('Esse usuário não existe.');
    }

    console.debug(user);

    const organizedEvents: FetchEventListItemResponseDTO[] = (
      user.events_organized || []
    ).map((event) => ({
      eventId: event.id,
      imageUrl: event.imageUrl ?? 'https://i.ibb.co/pvnYzhb4/fundo.jpg',
      title: event.title,
      description: event.description ?? '',
      volunteersCount: event.volunteers_count,
      maxVolunteers: event.volunteers_max,
      status: event.status,
      date: event.date,
    }));

    const participatedEvents: FetchEventListItemResponseDTO[] = (
      user.events_participated || []
    ).map((pivot) => {
      const event = pivot.event;

      return {
        eventId: event.id,
        imageUrl: event.imageUrl ?? 'https://i.ibb.co/pvnYzhb4/fundo.jpg',
        title: event.title,
        description: event.description ?? '',
        volunteersCount: event.volunteers_count,
        maxVolunteers: event.volunteers_max,
        status: event.status,
        date: event.date,
      };
    });

    const userRatings = (user.ratings_received || []).flatMap((review) => {
      if (!review.author) return [];

      return [
        {
          author_username: review.author.username,
          rating: review.rating,
          comment: review.comment ?? '',
        },
      ];
    });

    const activeRatingsCount = userRatings.length;

    const totalActiveRatingSum = userRatings.reduce(
      (acc, curr) => acc + curr.rating,
      0,
    );

    const averageRating =
      activeRatingsCount > 0
        ? Number((totalActiveRatingSum / activeRatingsCount).toFixed(2))
        : 0;

    const profileData = {
      id: user.id,
      username: user.username,
      bio: user.bio ?? '',
      // prettier-ignore
      imageUrl: user.imageUrl ? (user.imageUrl.startsWith('https://') ? user.imageUrl : `http://localhost:3000/users/image/${user.imageUrl}`) : null, //Note: Deals with both standard image coming from API (which has https as prefix) and with images uploaded by user (which have the necessity to put prefix)
      events_organized_count: organizedEvents.length,
      events_participated_count: participatedEvents.length,
      rating: averageRating,
      number_ratings: activeRatingsCount,
      events_organized: organizedEvents,
      events_participated: participatedEvents,
      ratings: userRatings,
    };

    return FetchUserProfileResponseSchema.parse(profileData);
  }

  async createUserRating(
    authorId: number,
    targetId: number,
    rating: number,
    comment?: string,
  ): Promise<RegisterUserRatingResponseDTO> {
    if (authorId === targetId) {
      throw new ForbiddenException('Você não pode avaliar a si mesmo');
    }

    if (rating < 1 || rating > 5) {
      throw new ConflictException(
        'A avaliação deve ser um valor inteiro entre 1 e 5',
      );
    }

    await this.userRatingsRepository.createUserRating(
      authorId,
      targetId,
      rating,
      comment,
    );

    const response = {
      target_id: targetId,
      author_id: authorId,
      rating: rating,
      comment: comment,
    };

    return RegisterUserRatingResponseSchema.parse(response);
  }
}
