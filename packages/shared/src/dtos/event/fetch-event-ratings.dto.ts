import { z } from 'zod';

export const FetchEventRatingsEventRequestSchema = z.object({
  eventId: z.string().min(1, 'Minimum of a character'),
});

export const FetchEventRatingsEventResponseSchema = z.object({
  authorId: z.string(),
  categoryId: z.number(),
  rating: z.number(),
  comment: z.string().nullable(),
});

export type FetchEventRatingsEventRequestDTO = z.infer<typeof FetchEventRatingsEventRequestSchema>;
export type FetchEventRatingsEventResponseDTO = z.infer<typeof FetchEventRatingsEventResponseSchema>;