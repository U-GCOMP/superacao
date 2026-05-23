import { z } from 'zod';

export const UpdateBioRequestSchema = z.object({
  bio: z.string().min(0),
  email: z.email(),
});

export const UpdateBioResponseSchema = z.object({
  token: z.string(),
});

export type UpdateBioRequestDTO = z.infer<typeof UpdateBioRequestSchema>;
export type UpdateBioResponseDTO = z.infer<typeof UpdateBioResponseSchema>;