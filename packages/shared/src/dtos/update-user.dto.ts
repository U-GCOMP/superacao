import { z } from 'zod';

export const UpdateUserRequestSchema = z.object({
  username: z.string().min(0),
  email: z.email(),
});

export const UpdateUserResponseSchema = z.object({
  token: z.string(),
});

export type UpdateUserRequestDTO = z.infer<typeof UpdateUserRequestSchema>;
export type UpdateUserResponseDTO = z.infer<typeof UpdateUserResponseSchema>;
