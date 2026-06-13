import { z } from 'zod';

export const FetchUserRatingRequestSchema = z.object({
  id: z.number().int(),
});

export const FetchUserRatingResponseSchema = z.object({
  author_id: z.number().int(),
  author_username: z.string().min(1),
  rating: z.number(),
  comment: z.string().catch(''),
});

export type FetchUserRatingRequestDTO = z.infer<typeof FetchUserRatingRequestSchema>;
export type FetchUserRatingResponseDTO = z.infer<typeof FetchUserRatingResponseSchema>;
