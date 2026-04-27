import { z } from 'zod';

export const UpdateRequestSchema = z.object({
  username: z.string().min(0),
  email: z.email(),
});

export const UpdateResponseSchema = z.object({
  token: z.string(),
});

export type UpdateRequestDTO = z.infer<typeof UpdateRequestSchema>;
export type UpdateResponseDTO = z.infer<typeof UpdateResponseSchema>;
