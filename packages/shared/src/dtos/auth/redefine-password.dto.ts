import { z } from 'zod';

export const RedefinePasswordRequestSchema = z.object({
  newPassword: z
    .string()
    .min(8, 'Mínimo de 8 caracteres')
    .regex(/[A-Z]/, 'Pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Pelo menos uma letra minúscula')
    .regex(/[\W_]/, 'Pelo menos um caracter especial'),
});

export const RedefinePasswordResponseSchema = z.object({
  token: z.string(),
});

export type RedefinePasswordRequestDTO = z.infer<typeof RedefinePasswordRequestSchema>;
export type RedefinePasswordResponseDTO = z.infer<typeof RedefinePasswordResponseSchema>;
