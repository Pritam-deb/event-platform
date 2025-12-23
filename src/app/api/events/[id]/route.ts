import { NextResponse } from 'next/server';
import { updateEventSchema } from '@/validators/event.schema';
import {
    getEventById,
    updateEvent,
    deleteEvent,
} from '@/services/event.service';
import { ApiResponse } from '@/utils/api-response';

export async function GET(
    req: Request,
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
    try {
        const { id } = await context.params;
        const body = updateEventSchema.parse(await req.json());
        console.log('Parsed body:', body);
        await updateEvent(id, body);

        return NextResponse.json({ data: null, error: null });
    } catch {
        return NextResponse.json(
            { data: null, error: 'Invalid request body' },
            { status: 400 }
        );
    }
}

export async function DELETE(
    _: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    await deleteEvent(id);
    return NextResponse.json({ data: null, error: null });
}