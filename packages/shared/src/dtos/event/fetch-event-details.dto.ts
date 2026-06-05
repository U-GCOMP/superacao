import z from "zod";

const EventRatingSchema = z.object({
    id: z.string(),
    userName: z.string().nonempty('Nome do usuário é requerido'),
    comment: z.string().optional().nullable(), 
    score: z.number().min(1).max(5), 
});

export const FetchEventDetailsRequestSchema = z.object({
    eventId: z.string().nonempty('ID do evento é requerido'),
})

export const FetchEventDetailsResponseSchema = z.object({
    id: z.string().nonempty('ID do evento é requerido'),
    title: z.string().nonempty('Título é requerido'),
    place: z.string().nonempty('Local é requerido'),
    date: z.coerce.date(),
    subscriptionDeadlineDate: z.coerce.date(),
    description: z.string().nonempty('Descrição é requerida'),
    organizer: z.object({
        id: z.number().int().positive('O ID do organizador deve ser um inteiro positivo'),
        name: z.string().nonempty('Nome do organizador é requerido'),
    }),
    volunteersCount: z.number().min(0, 'Contagem de voluntários não pode ser negativa'),
    maxVolunteers: z.number().min(1, 'Quantidade máxima de voluntários deve ser um número positivo'),
    status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELED']),
    imageUrl: z.url('URL de imagem inválido'),
    rating_sum: z.number(),
    rating_count: z.number().int(),
    ratings: z.array(EventRatingSchema),
})

export type FetchEventDetailsRequestDTO = z.infer<typeof FetchEventDetailsRequestSchema>;
export type FetchEventDetailsResponseDTO = z.infer<typeof FetchEventDetailsResponseSchema>;