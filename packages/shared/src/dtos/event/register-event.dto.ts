import { z } from 'zod';

export const RegisterEventRequestSchema = z.object({
  title: z.string().min(1, 'Mínimo de 1 caracter'),
  description: z.string().min(1, 'Mínimo de 1 caracter'),
  maxSlots: z.coerce.number().int().min(1, 'Mínimo de 1 slot'),
  place: z.string().min(1, 'Mínimo de 1 caracter'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de tempo inválido, deve ser (HH:mm)'),
  imageURL: z.string().optional(), 
});

export const RegisterEventResponseSchema = z.object({
  token: z.string(),
});

export type RegisterEventRequestDTO = z.infer<typeof RegisterEventRequestSchema>;
export type RegisterEventResponseDTO = z.infer<typeof RegisterEventResponseSchema>;
