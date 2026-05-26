import { z } from 'zod';

export const UpdateBioRequestSchema = z.object({
  bio: z.string().min(0),
  id: z.number().int(),
});

export const UpdateBioResponseSchema = z.object({
  bio: z.string().min(0),
  id: z.number().int(),
});

export type UpdateBioRequestDTO = z.infer<typeof UpdateBioRequestSchema>;
export type UpdateBioResponseDTO = z.infer<typeof UpdateBioResponseSchema>;