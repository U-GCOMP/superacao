import { z } from 'zod';

export const RegisterRequestSchema = z.object({
  username: z.string().min(1, 'Mínimo de 1 caracter'),
  email: z.email(),
  password: z
    .string()
    .min(8, 'Mínimo de 8 caracteres')
    .regex(/[A-Z]/, 'Pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Pelo menos uma letra minúscula')
    .regex(/[\W_]/, 'Pelo menos um caracter especial'),
  bio: z.string().optional().nullable(),
});

export const RegisterResponseSchema = z.object({
  token: z.string(),
});

export type RegisterRequestDTO = z.infer<typeof RegisterRequestSchema>;
export type RegisterResponseDTO = z.infer<typeof RegisterResponseSchema>;
