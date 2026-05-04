import { z } from 'zod';

export const RedefinePasswordEmailRequestSchema = z.object({
  email: z.email(),
});

export const RedefinePasswordEmailResponseSchema = z.object({
  token: z.string(),
});

export type RedefinePasswordEmailRequestDTO = z.infer<typeof RedefinePasswordEmailRequestSchema>;
export type RedefinePasswordEmailResponseDTO = z.infer<typeof RedefinePasswordEmailResponseSchema>;