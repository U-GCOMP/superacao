import { z } from 'zod';

export const EventSubscriptionResponseSchema = z.object({
  subscribed: z.boolean(),
});

export type EventSubscriptionResponseDTO = z.infer<typeof EventSubscriptionResponseSchema>;
