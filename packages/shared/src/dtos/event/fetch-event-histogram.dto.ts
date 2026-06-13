import z from "zod";

const EventHistogramEntrySchema = z.object({
    label: z.string().nonempty('O rótulo é obrigatório'),
    value: z.number().min(0, 'O valor deve ser um número não negativo').max(5, 'O valor deve ser no máximo 5'),
})

export const FetchEventHistogramRequestSchema = z.object({
    eventId: z.string().nonempty('ID do evento é obrigatório'),
})

export const FetchEventHistogramResponseSchema = z.object({
    histogram: z.array(EventHistogramEntrySchema),
})

export type FetchEventHistogramRequestDTO = z.infer<typeof FetchEventHistogramRequestSchema>;
export type FetchEventHistogramResponseDTO = z.infer<typeof FetchEventHistogramResponseSchema>;
