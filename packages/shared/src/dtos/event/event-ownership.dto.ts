import { z } from 'zod';

export const EventOwnershipResponseSchema = z.object({
  owns: z.boolean(),
});

export type EventOwnershipResponseDTO = z.infer<typeof EventOwnershipResponseSchema>;
