import z from "zod";

export const FetchEventListQueryParametersSchema = z.object({
    page: z.coerce.number().min(1, 'Página deve ser pelo menos 1').default(1).optional(),
    pageSize: z.coerce.number().min(1, 'O tamanho da página deve ser pelo menos 1').default(10).optional(),
    search: z.string().optional(),
    date: z.coerce.date().optional(),
    isDescending: z.coerce.boolean().default(false).optional(),
})

export const FetchEventListItemResponseSchema = z.object({
    eventId: z.string().nonempty('ID do evento é requerido'),
    imageUrl: z.url('URL de imagem inválido'),
    title: z.string().nonempty('Título é requerido'),
    description: z.string().nonempty('Descrição é requerida'),
    volunteersCount: z.number().min(0, 'Contagem de voluntários não pode ser negativa'),
    maxVolunteers: z.number().min(1, 'Quantidade máxima de voluntários deve ser um número positivo'),
    status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELED']),
    date: z.coerce.date()
})

export type FetchEventListQueryParametersDTO = z.infer<typeof FetchEventListQueryParametersSchema>;
export type FetchEventListItemResponseDTO = z.infer<typeof FetchEventListItemResponseSchema>;