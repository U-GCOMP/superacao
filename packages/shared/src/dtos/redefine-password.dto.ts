import { z } from 'zod';

export const RedefinePasswordRequestSchema = z.object({
  newPassword: z
    .string()
    .min(8, 'Minimum of 8 characters')
    .regex(/[A-Z]/, 'At least an uppercase letter')
    .regex(/[a-z]/, 'At least an undercase letter')
    .regex(/[\W_]/, 'At least an special character'),

  confirmNewPassword: z
    .string()
    .min(8, 'Minimum of 8 characters')
    .regex(/[A-Z]/, 'At least an uppercase letter')
    .regex(/[a-z]/, 'At least an undercase letter')
    .regex(/[\W_]/, 'At least an special character'),
});

export const RedefinePasswordResponseSchema = z.object({
  token: z.string(),
});

export type RedefinePasswordRequestDTO = z.infer<typeof RedefinePasswordRequestSchema>;
export type RedefinePasswordResponseDTO = z.infer<typeof RedefinePasswordResponseSchema>;
