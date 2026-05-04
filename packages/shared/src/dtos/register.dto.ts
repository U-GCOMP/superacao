import { z } from 'zod';

export const RegisterRequestSchema = z.object({
  username: z.string().min(0),
  email: z.email(),
  password: z
    .string()
    .min(8, 'Minimum of 8 characters')
    .regex(/[A-Z]/, 'At least an uppercase letter')
    .regex(/[a-z]/, 'At least an undercase letter')
    .regex(/[\W_]/, 'At least an special character'),
});

export const RegisterResponseSchema = z.object({
  token: z.string(),
});

export type RegisterRequestDTO = z.infer<typeof RegisterRequestSchema>;
export type RegisterResponseDTO = z.infer<typeof RegisterResponseSchema>;
