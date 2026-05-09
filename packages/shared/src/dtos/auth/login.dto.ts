import { z } from 'zod';

export const LoginRequestSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const LoginResponseSchema = z.object({
  token: z.string(),
});

export type LoginRequestDTO = z.infer<typeof LoginRequestSchema>;
export type LoginResponseDTO = z.infer<typeof LoginResponseSchema>;
