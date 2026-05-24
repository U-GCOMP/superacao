import { z } from 'zod';

export const UpdateUsernameRequestSchema = z.object({
  username: z.string().min(0),
  id: z.number().int(),
});

export const UpdateUsernameResponseSchema = z.object({
  token: z.string(),
});

export type UpdateUsernameRequestDTO = z.infer<typeof UpdateUsernameRequestSchema>;
export type UpdateUsernameResponseDTO = z.infer<typeof UpdateUsernameResponseSchema>;
