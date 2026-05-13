import z from "zod";

export const FetchEventQueryParametersSchema = z.object({
    page: z.coerce.number().min(1, 'Page must be at least 1').default(1).optional(),
    pageSize: z.coerce.number().min(1, 'Page size must be at least 1').default(10).optional(),
    search: z.string().optional(),
    date: z.coerce.date().optional(),
    isDescending: z.coerce.boolean().default(false).optional(),
})

export const FetchEventResponseSchema = z.object({
    eventId: z.string().nonempty('Event ID is required'),
    imageUrl: z.url('Invalid image URL'),
    title: z.string().nonempty('Title is required'),
    description: z.string().nonempty('Description is required'),
    volunteersCount: z.number().min(0, 'Volunteers count cannot be negative'),
    maxVolunteers: z.number().min(1, 'Maximum volunteers must be a positive number'),
    status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELED']),
    date: z.coerce.date()
})

export type FetchEventQueryParametersDTO = z.infer<typeof FetchEventQueryParametersSchema>;
export type FetchEventResponseDTO = z.infer<typeof FetchEventResponseSchema>;