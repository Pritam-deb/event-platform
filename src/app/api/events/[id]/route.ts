import { NextResponse } from 'next/server';
import { updateEventSchema } from '@/validators/event.schema';
import {
    getEventById,
    updateEvent,
    deleteEvent,
} from '@/services/event.service';
import { ApiResponse } from '@/utils/api-response';

export async function GET(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const event = await getEventById(id);

    if (!event) {
        return NextResponse.json(
            { data: null, error: 'Event not found' },
            { status: 404 }
        );
    }

    const response: ApiResponse<typeof event> = {
        data: event,
        error: null,
    };

    return NextResponse.json(response);
}

export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const json = await req.json().catch(() => null);
    const parsed = updateEventSchema.safeParse(json);

    if (!parsed.success) {
        return NextResponse.json(
            { data: null, error: 'Invalid request body' },
            { status: 400 }
        );
    }

    const existing = await getEventById(id);
    if (!existing) {
        return NextResponse.json(
            { data: null, error: 'Event not found' },
            { status: 404 }
        );
    }

    try {
        await updateEvent(id, parsed.data);
        return NextResponse.json({ data: null, error: null });
    } catch {
        return NextResponse.json(
            { data: null, error: 'Failed to update event' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const existing = await getEventById(id);
    if (!existing) {
        return NextResponse.json(
            { data: null, error: 'Event not found' },
            { status: 404 }
        );
    }
    await deleteEvent(id);
    return NextResponse.json({ data: null, error: null });
}
