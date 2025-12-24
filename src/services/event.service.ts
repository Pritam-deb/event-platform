import { getDb } from '@/db';
import { events } from '@/db/schema/events';
import { and, desc, eq, gte, lte, sql } from 'drizzle-orm';
import {
    CreateEventInput,
    UpdateEventInput,
} from '@/types/event';


export const createEvent = async (input: CreateEventInput) => {
    const id = crypto.randomUUID();
    const db = getDb();

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
    const db = getDb();
    return db.select().from(events);
};

type ListEventsOptions = {
    limit?: number;
    offset?: number;
    startDate?: Date;
    endDate?: Date;
};

export const listEvents = async (opts: ListEventsOptions) => {
    const db = getDb();
    const conditions = [];

    if (opts.startDate) conditions.push(gte(events.endAt, opts.startDate));
    if (opts.endDate) conditions.push(lte(events.startAt, opts.endDate));

    const whereClause = conditions.length ? and(...conditions) : undefined;

    const baseQuery = db.select().from(events);
    const filteredQuery = whereClause ? baseQuery.where(whereClause) : baseQuery;

    const orderedQuery = filteredQuery.orderBy(desc(events.startAt));
    const safeOffset = opts.offset ?? 0;
    const safeLimit = opts.limit;

    const countPromise = (async () => {
        const countBase = db
            .select({ count: sql<number>`count(*)` })
            .from(events);
        const countQuery = whereClause ? countBase.where(whereClause) : countBase;
        const result = await countQuery;
        return Number(result[0]?.count ?? 0);
    })();

    const [allItems, totalRows] = await Promise.all([orderedQuery, countPromise]);

    const items =
        typeof safeLimit === 'number'
            ? allItems.slice(safeOffset, safeOffset + safeLimit)
            : safeOffset > 0
                ? allItems.slice(safeOffset)
                : allItems;

    return { items, totalCount: totalRows };
};

export const getEventById = async (id: string) => {
    const db = getDb();
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
    const db = getDb();
    const updateValues = Object.fromEntries(
        Object.entries(input).filter(([, value]) => value !== undefined)
    ) as UpdateEventInput;
    await db
        .update(events)
        .set({
            ...updateValues,
        })
        .where(eq(events.id, id));
};

export const deleteEvent = async (id: string) => {
    const db = getDb();
    await db.delete(events).where(eq(events.id, id));
};
