import { z } from 'zod';

export const RecoverPasswordRequestSchema = z.object({
  code: z.string(),
});

export const RecoverPasswordResponseSchema = z.object({
  token: z.string(),
});

export type RecoverPasswordRequestDTO = z.infer<typeof RecoverPasswordRequestSchema>;
export type RecoverPasswordResponseDTO = z.infer<typeof RecoverPasswordResponseSchema>;
