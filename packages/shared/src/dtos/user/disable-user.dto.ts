import { z } from 'zod';

export const DisableUserRequestSchema = z.object({
  id: z.number().int(),
});

export const DisableUserResponseSchema = z.object({
  token: z.string(),
});

export type DisableUserRequestDTO = z.infer<typeof DisableUserRequestSchema>;
export type DisableUserResponseDTO = z.infer<typeof DisableUserResponseSchema>;
