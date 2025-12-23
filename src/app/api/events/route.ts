import { NextResponse } from 'next/server';
import { createEventSchema } from '@/validators/event.schema';
import { createEvent, listEvents } from '@/services/event.service';
import { ApiResponse } from '@/utils/api-response';

const MAX_LIMIT = 200;
const DEFAULT_LIMIT = 20;

function parseIsoDate(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return { ok: false as const, error: 'Date is empty' };

    const dateOnly = /^\d{4}-\d{2}-\d{2}$/;
    if (dateOnly.test(trimmed)) {
        const date = new Date(`${trimmed}T00:00:00.000Z`);
        if (Number.isNaN(date.getTime())) {
            return { ok: false as const, error: 'Invalid date' };
        }
        return { ok: true as const, date, isDateOnly: true as const };
    }

    const date = new Date(trimmed);
    if (Number.isNaN(date.getTime())) {
        return { ok: false as const, error: 'Invalid date' };
    }
    return { ok: true as const, date, isDateOnly: false as const };
}

export function parseEventsQuery(searchParams: URLSearchParams) {
    const limitRaw = searchParams.get('limit') ?? undefined;
    const offsetRaw = searchParams.get('offset') ?? undefined;
    const startRaw = searchParams.get('start_date') ?? undefined;
    const endRaw = searchParams.get('end_date') ?? undefined;

    const hasOffset = offsetRaw != null;
    const hasLimit = limitRaw != null;

    const limit = (() => {
        if (!hasLimit && !hasOffset) return undefined;
        if (!hasLimit) return DEFAULT_LIMIT;
        const n = Number(limitRaw);
        if (!Number.isInteger(n) || n <= 0) throw new Error('Invalid limit');
        if (n > MAX_LIMIT) throw new Error(`Limit must be <= ${MAX_LIMIT}`);
        return n;
    })();

    const offset = (() => {
        if (!hasLimit && !hasOffset) return undefined;
        if (!hasOffset) return 0;
        const n = Number(offsetRaw);
        if (!Number.isInteger(n) || n < 0) throw new Error('Invalid offset');
        return n;
    })();

    const startDate = (() => {
        if (!startRaw) return undefined;
        const out = parseIsoDate(startRaw);
        if (!out.ok) throw new Error('Invalid start_date');
        return out.date;
    })();

    const endDate = (() => {
        if (!endRaw) return undefined;
        const out = parseIsoDate(endRaw);
        if (!out.ok) throw new Error('Invalid end_date');
        if (out.isDateOnly) {
            const endOfDay = new Date(out.date);
            endOfDay.setUTCHours(23, 59, 59, 999);
            return endOfDay;
        }
        return out.date;
    })();

    if (startDate && endDate && startDate.getTime() > endDate.getTime()) {
        throw new Error('start_date must be <= end_date');
    }

    return { limit, offset, startDate, endDate };
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const { limit, offset, startDate, endDate } = parseEventsQuery(searchParams);

        const { items, totalCount } = await listEvents({
            limit,
            offset,
            startDate,
            endDate,
        });

        const safeLimit = limit ?? items.length;
        const safeOffset = offset ?? 0;
        const currentPage =
            safeLimit > 0 ? Math.floor(safeOffset / safeLimit) + 1 : 1;

        const response: ApiResponse<typeof items, {
            totalCount: number;
            currentPage: number;
            itemsPerPage: number;
            limit: number;
            offset: number;
        }> = {
            data: items,
            error: null,
            meta: {
                totalCount,
                currentPage,
                itemsPerPage: safeLimit,
                limit: safeLimit,
                offset: safeOffset,
            },
        };

        return NextResponse.json(response);
    } catch (err) {
        const message =
            err instanceof Error ? err.message : 'Invalid query parameters';
        return NextResponse.json({ data: null, error: message }, { status: 400 });
    }
}

export async function POST(req: Request) {
    try {
        const body = createEventSchema.parse(await req.json());
        const id = await createEvent(body);

        const response: ApiResponse<{ id: string }> = {
            data: { id },
            error: null,
        };

        return NextResponse.json(response, { status: 201 });
    } catch {
        return NextResponse.json(
            { data: null, error: 'Invalid request body' },
            { status: 400 }
        );
    }
}
