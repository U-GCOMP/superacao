import { z } from 'zod';

export const ConfirmCodeRequestSchema = z.object({
  code: z.string(),
});

export const ConfirmCodeResponseSchema = z.object({
  token: z.string(),
});

export type ConfirmCodeRequestDTO = z.infer<typeof ConfirmCodeRequestSchema>;
export type ConfirmCodeResponseDTO = z.infer<typeof ConfirmCodeResponseSchema>;
