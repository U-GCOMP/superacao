import { z } from 'zod';

export const UpdateImageRequestSchema = z.object({
  imageURL: z.string().min(0),
  id: z.number().int(),
});

export const UpdateImageResponseSchema = z.object({
  imageURL: z.string().min(0),
  id: z.number().int(),
});

export type UpdateImageRequestDTO = z.infer<typeof UpdateImageRequestSchema>;
export type UpdateImageResponseDTO = z.infer<typeof UpdateImageResponseSchema>;