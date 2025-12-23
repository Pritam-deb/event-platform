import { db } from '@/db';
import { events } from '@/db/schema/events';
import { eq } from 'drizzle-orm';
import {
    CreateEventInput,
    UpdateEventInput,
} from '@/types/event';


export const createEvent = async (input: CreateEventInput) => {
    const id = crypto.randomUUID();

    await db.insert(events).values({
        id,
        title: input.title,
        description: input.description ?? null,
        location: input.location ?? null,
        totalTickets: input.totalTickets,
        eventStatus: input.eventStatus,
        eventType: input.eventType,
        eventTag: input.eventTag ?? null,
        startAt: input.startAt,
        endAt: input.endAt,
        isPublished: input.isPublished ?? false,
    });

    return id;
};


export const getAllEvents = async () => {
    return db.select().from(events);
};

export const getEventById = async (id: string) => {
    const result = await db
        .select()
        .from(events)
        .where(eq(events.id, id));

    return result[0] ?? null;
};

export const updateEvent = async (
    id: string,
    input: UpdateEventInput
) => {
    console.log('Updating event with id:', id, 'and input:', input);
    await db
        .update(events)
        .set({
            ...input,
        })
        .where(eq(events.id, id));
};

export const deleteEvent = async (id: string) => {
    await db.delete(events).where(eq(events.id, id));
};