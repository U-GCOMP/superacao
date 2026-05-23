import { z } from 'zod';

export const FetchUserRatingRequestSchema = z.object({
  email: z.email(),
});

export const FetchUserRatingResponseSchema = z.object({
  author_username: z.string().min(1),
  rating: z.number(),
  comment: z.string().catch(''),
});

export type FetchUserRatingRequestDTO = z.infer<typeof FetchUserRatingRequestSchema>;
export type FetchUserRatingResponseDTO = z.infer<typeof FetchUserRatingResponseSchema>;
