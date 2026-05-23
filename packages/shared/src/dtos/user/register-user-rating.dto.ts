import { z } from 'zod';

export const RegisterUserRatingRequestSchema = z.object({
  target_id: z.number().int(),
  author_id: z.number().int(),
  rating: z.number().min(0, 'A nota mínima é 0').max(5, 'A nota máxima é 5'),
  comment: z.string().optional().nullable(),
});

export const RegisterUserRatingResponseSchema = z.object({
  token: z.string(),
});

export type RegisterUserRatingRequestDTO = z.infer<typeof RegisterUserRatingRequestSchema>;
export type RegisterUserRatingResponseDTO = z.infer<typeof RegisterUserRatingResponseSchema>;
