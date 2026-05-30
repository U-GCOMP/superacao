import z from "zod";

export const FetchEventListQueryParametersSchema = z.object({
    page: z.coerce.number().min(1, 'Página deve ser pelo menos 1').default(1).optional(),
    pageSize: z.coerce.number().min(1, 'O tamanho da página deve ser pelo menos 1').default(10).optional(),
    // Se vier string vazia, transforma em undefined, se nao, valida como string
    search: z.preprocess((val) => val === '' ? undefined : val, z.string().optional()),
    // Se vier string vazia, transforma em undefined, se nao, converte para Date
    date: z.preprocess((val) => val === '' ? undefined : val, z.coerce.date().optional()),
    // Converte a string 'true' da URL para o boolean true, o resto eh false
    isDescending: z.preprocess(
        (val) => val === 'true' || val === true, 
        z.boolean().default(false).optional()
    ),
});

export const FetchEventListItemResponseSchema = z.object({
    eventId: z.string().nonempty('ID do evento é requerido'),
    imageUrl: z.string(), //Note: Rapha, had to change this because was too restrictive
    title: z.string().nonempty('Título é requerido'),
    description: z.string().nonempty('Descrição é requerida'),
    volunteersCount: z.number().min(0, 'Contagem de voluntários não pode ser negativa'),
    maxVolunteers: z.number().min(1, 'Quantidade máxima de voluntários deve ser um número positivo'),
    status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELED']),
    date: z.coerce.date()
})

export type FetchEventListQueryParametersDTO = z.infer<typeof FetchEventListQueryParametersSchema>;
export type FetchEventListItemResponseDTO = z.infer<typeof FetchEventListItemResponseSchema>;