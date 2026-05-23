import { z } from 'zod';
import { FetchEventListItemResponseSchema } from '../event/fetch-event-list-item.dto';
import { FetchUserRatingResponseSchema } from './fetch-user-rating.dto';

export const FetchUserProfileRequestSchema = z.object({
  email: z.email(),
});

export const FetchUserProfileResponseSchema = z.object({
  username: z.string().min(0),
  bio: z.string(),
  events_organized_count: z.number().int(),
  events_participated_count: z.number().int(),
  rating: z.number(),
  number_ratings: z.number().int(),
  imageUrl: z.url('URL de imagem inválido'),
  events_organized: z.array(FetchEventListItemResponseSchema),
  events_participated: z.array(FetchEventListItemResponseSchema),
  ratings: z.array(FetchUserRatingResponseSchema),
});

export type FetchUserProfileRequestDTO = z.infer<typeof FetchUserProfileRequestSchema>;
export type FetchUserProfileResponseDTO = z.infer<typeof FetchUserProfileResponseSchema>;
