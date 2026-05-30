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

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userRatingsRepository: UserRatingsRepository,
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

  async updateImage(newImageURL: string, id: number): Promise<string> {
    const user = await this.userRepository.getUserByID(id);

    if (!user) {
      throw new NotFoundException('Esse usuário não existe.');
    }

    user.imageUrl = newImageURL;

    await this.userRepository.saveUser(user);

    return 'Success';
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

    user.deleted_at = new Date();

    await this.userRepository.saveUser(user);

    return 'Success';
  }

  async fetchUserProfile(id: number): Promise<FetchUserProfileResponseDTO> {
    const user = await this.userRepository.getUserWithEventsByID(id);

    if (!user) {
      throw new NotFoundException('Esse usuário não existe.');
    }

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

    // NOTE: Hand`t made repository at the time, so it is what it is
    const userRatings = (user.ratings_received || [])
      .filter((review) => review.author !== null && review.author !== undefined)
      .map((review) => ({
        author_username: review.author.username,
        rating: review.rating,
        comment: review.comment ?? '',
      }));

    const averageRating =
      user.rating_count && user.rating_count > 0
        ? Number((user.rating_sum / user.rating_count).toFixed(1))
        : 0;

    const profileData = {
      id: user.id,
      username: user.username,
      bio: user.bio ?? '',
      imageUrl: user.imageUrl,
      events_organized_count: organizedEvents.length,
      events_participated_count: participatedEvents.length,
      rating: averageRating,
      number_ratings: user.rating_count ?? 0,
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

    if (rating < 0 || rating > 5) {
      throw new ConflictException(
        'A avaliação deve ser um valor inteiro entre 0 e 5',
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
