import z from "zod";

export const FetchEventWordCloudRequestSchema = z.object({
    eventId: z.string().nonempty('ID do evento é obrigatório'),
    limit: z.number().int().positive().optional(),
})

export const FetchEventWordCloudResponseSchema = z.array(
        z.object({
            word: z.string().nonempty('A palavra é obrigatória'),
            count: z.number().min(1, 'A contagem deve ser um número positivo'),
        })
    )

export type FetchEventWordCloudRequestDTO = z.infer<typeof FetchEventWordCloudRequestSchema>;
export type FetchEventWordCloudResponseDTO = z.infer<typeof FetchEventWordCloudResponseSchema>;