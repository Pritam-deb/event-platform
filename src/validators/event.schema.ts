import { z } from 'zod';

export const createEventSchema = z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    location: z.string().optional(),

    totalTickets: z.number().int().nonnegative(),
    eventStatus: z.enum(['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED']),
    eventType: z.enum(['ONLINE', 'OFFLINE']),
    eventTag: z.string().optional(),

    startAt: z.coerce.date(),
    endAt: z.coerce.date(),

    isPublished: z.boolean().optional(),
});

export const updateEventSchema = createEventSchema.partial();
