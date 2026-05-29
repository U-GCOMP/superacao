import { z } from 'zod';

export const SubscribeToEventRequestSchema = z.object({
  eventId: z.string(),
});

export const SubscribeToEventResponseSchema = z.object({
  eventId: z.string(),
  userId: z.number().int(),
});

export type SubscribeToEventRequestDTO = z.infer<typeof SubscribeToEventRequestSchema>;
export type SubscribeToEventResponseDTO = z.infer<typeof SubscribeToEventResponseSchema>;
