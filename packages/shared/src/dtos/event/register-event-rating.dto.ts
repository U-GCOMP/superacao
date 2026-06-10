import { z } from 'zod';

export const RegisterEventRatingRequestSchema = z.object({
  target_id: z.string().min(1),
  author_id: z.number().int().min(1),
  organized_rating: z.number().min(1, 'A nota mínima é 1').max(5, 'A nota máxima é 5'),
  punctuality_rating: z.number().min(1, 'A nota mínima é 1').max(5, 'A nota máxima é 5'),
  infrastructure_rating: z.number().min(1, 'A nota mínima é 1').max(5, 'A nota máxima é 5'),
  accessibility_rating: z.number().min(1, 'A nota mínima é 1').max(5, 'A nota máxima é 5'),
  comment: z.string().optional().nullable(),
});

export const RegisterEventRatingResponseSchema = z.object({
  target_id: z.string().min(1),
  author_id: z.number().int().min(1),
  organized_rating: z.number().min(1, 'A nota mínima é 1').max(5, 'A nota máxima é 5'),
  punctuality_rating: z.number().min(1, 'A nota mínima é 1').max(5, 'A nota máxima é 5'),
  infrastructure_rating: z.number().min(1, 'A nota mínima é 1').max(5, 'A nota máxima é 5'),
  accessibility_rating: z.number().min(1, 'A nota mínima é 1').max(5, 'A nota máxima é 5'),
  comment: z.string().optional().nullable(),
});

export type RegisterEventRatingRequestDTO = z.infer<typeof RegisterEventRatingRequestSchema>;
export type RegisterEventRatingResponseDTO = z.infer<typeof RegisterEventRatingResponseSchema>;
