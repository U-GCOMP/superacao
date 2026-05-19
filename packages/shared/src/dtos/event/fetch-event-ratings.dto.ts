import { z } from 'zod';

export const FetchEventRatingsEventRequestSchema = z.object({
  eventId: z.string().min(1, 'Mínimo de 1 caracter'),
});

export const FetchEventRatingsEventResponseSchema = z.object({
  authorId: z.string(),
  categoryId: z.number(),
  rating: z.number(),
  comment: z.string().nullable(),
});

export type FetchEventRatingsEventRequestDTO = z.infer<typeof FetchEventRatingsEventRequestSchema>;
export type FetchEventRatingsEventResponseDTO = z.infer<typeof FetchEventRatingsEventResponseSchema>;