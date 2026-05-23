import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';

import {
  FetchUserProfileResponseSchema,
  FetchUserProfileResponseDTO,
  FetchEventListItemResponseDTO,
} from '@project/shared';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async updateUsername(newUsername: string, email: string): Promise<string> {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      throw new ConflictException('Esse usuário não existe.');
    }

    user.username = newUsername;

    await this.userRepository.saveUser(user);

    return 'Success';
  }

  async updateImage(newImageURL: string, email: string): Promise<string> {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      throw new ConflictException('Esse usuário não existe.');
    }

    user.imageUrl = newImageURL;

    await this.userRepository.saveUser(user);

    return 'Success';
  }

  async updateBio(newBio: string, email: string): Promise<string> {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      throw new ConflictException('Esse usuário não existe.');
    }

    user.bio = newBio;

    await this.userRepository.saveUser(user);

    return 'Success';
  }

  async disable(email: string): Promise<string> {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      throw new ConflictException('Esse usuário não existe.');
    }

    await this.userRepository.disableUser(email);

    return 'Success';
  }

  async fetchUserProfile(email: string): Promise<FetchUserProfileResponseDTO> {
    const user = await this.userRepository.getUserWithEventsByEmail(email);

    if (!user) {
      throw new ConflictException('Esse usuário não existe.');
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

  // TODO: Falta função para adicionar user rating, mas ficou disparando erro pra lá e pra cá e me encheu o saco
}
