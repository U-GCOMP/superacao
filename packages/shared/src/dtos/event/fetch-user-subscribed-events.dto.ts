import z from "zod";

export const FetchUserSubscribedEvent = z.object({
    eventId: z.string().nonempty('ID do evento é requerido'),
    imageUrl: z.url('URL de imagem inválido'),
    title: z.string().nonempty('Título é requerido'),
    description: z.string().nonempty('Descrição é requerida'),
    volunteersCount: z.number().min(0, 'Contagem de voluntários não pode ser negativa'),
    maxVolunteers: z.number().min(1, 'Quantidade máxima de voluntários deve ser um número positivo'),
    status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELED']),
    date: z.coerce.date()
})

export type FetchUserSubscribedEventDTO = z.infer<typeof FetchUserSubscribedEvent>;
