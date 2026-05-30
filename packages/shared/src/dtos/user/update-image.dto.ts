import { z } from 'zod';

export const UpdateImageRequestSchema = z.object({
  image: z.custom<unknown>((val) => val && typeof val === 'object')
    .refine((file) => {
      const f = file as { size?: number; buffer?: { length: number } };
      const size = f?.size ?? f?.buffer?.length;
      return size ? size <= 5 * 1024 * 1024 : false;
    }, 'A imagem precisa ser menor que 5MB')
    .refine((file) => {
      const f = file as { mimetype?: string; type?: string };
      const type = f?.mimetype ?? f?.type;
      return type ? ['image/jpeg', 'image/png', 'image/webp'].includes(type) : false;
    }, 'Formato não suportado')
    .optional(),
});

export const UpdateImageResponseSchema = z.object({
  imageUrl: z.string(),
  id: z.number().int(),
});

export type UpdateImageRequestDTO = z.infer<typeof UpdateImageRequestSchema>;
export type UpdateImageResponseDTO = z.infer<typeof UpdateImageResponseSchema>;