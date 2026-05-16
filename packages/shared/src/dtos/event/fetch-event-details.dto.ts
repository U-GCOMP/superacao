import z from "zod";

export const FetchEventDetailsRequestSchema = z.object({
    eventId: z.string().nonempty('Event ID is required'),
})

export const FetchEventDetailsResponseSchema = z.object({
    id: z.string().nonempty('Event ID is required'),
    title: z.string().nonempty('Title is required'),
    date: z.coerce.date(),
    description: z.string().nonempty('Description is required'),
    organizer: z.object({
        id: z.number().int().positive('Organizer ID must be a positive integer'),
        name: z.string().nonempty('Organizer name is required'),
    }),
    volunteersCount: z.number().min(0, 'Volunteers count cannot be negative'),
    maxVolunteers: z.number().min(1, 'Maximum volunteers must be a positive number'),
    status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELED']),
    imageUrl: z.url('Invalid image URL')
})

export type FetchEventDetailsRequestDTO = z.infer<typeof FetchEventDetailsRequestSchema>;
export type FetchEventDetailsResponseDTO = z.infer<typeof FetchEventDetailsResponseSchema>;