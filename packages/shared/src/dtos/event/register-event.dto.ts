import { z } from 'zod';

export const RegisterEventRequestSchema = z.object({
  title: z.string().min(1, 'Minimum of a character'),
  description: z.string().min(1, 'Minimum of a character'),
  maxSlots: z.int().min(1, 'Minimum of a slot'),
  place: z.string().min(1, 'Minimum of a character'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format, must be (HH:mm)'),
  image: z.instanceof(File, { message: 'Select a valid image' })
    .refine((file) => file.size <= 5 * 1024 * 1024, 'The image must be less than 5MB')
    .refine((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), 'Unsupported format')
    .optional(),
});

export const RegisterEventResponseSchema = z.object({
  token: z.string(),
});

export type RegisterEventRequestDTO = z.infer<typeof RegisterEventRequestSchema>;
export type RegisterEventResponseDTO = z.infer<typeof RegisterEventResponseSchema>;
