import { z } from 'zod';

export const DeactivateEventParamSchema = z.object({
  eventId: z.uuid('ID do evento inválido'),
});

export type DeactivateEventParamDTO = z.infer<typeof DeactivateEventParamSchema>;