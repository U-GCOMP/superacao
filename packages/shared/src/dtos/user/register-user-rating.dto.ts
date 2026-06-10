import { z } from 'zod';

export const RegisterUserRatingRequestSchema = z.object({
  target_id: z.number().int(),
  author_id: z.number().int(),
  rating: z.number().min(1, 'A nota mínima é 1').max(5, 'A nota máxima é 5'),
  comment: z.string().optional().nullable(),
});

export const RegisterUserRatingResponseSchema = z.object({
  target_id: z.number().int(),
  author_id: z.number().int(),
  rating: z.number().min(1, 'A nota mínima é 1').max(5, 'A nota máxima é 5'),
  comment: z.string().optional().nullable(),
});

export type RegisterUserRatingRequestDTO = z.infer<typeof RegisterUserRatingRequestSchema>;
export type RegisterUserRatingResponseDTO = z.infer<typeof RegisterUserRatingResponseSchema>;
