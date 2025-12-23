import { NextResponse } from 'next/server';
import { updateEventSchema } from '@/validators/event.schema';
import {
    getEventById,
    updateEvent,
    deleteEvent,
} from '@/services/event.service';
import { ApiResponse } from '@/utils/api-response';

export async function GET(
    _: Request,
    { params }: { params: { id: string } }
) {
    const event = await getEventById(params.id);

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
    { params }: { params: { id: string } }
) {
    try {
        const body = updateEventSchema.parse(await req.json());
        await updateEvent(params.id, body);

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
    { params }: { params: { id: string } }
) {
    await deleteEvent(params.id);
    return NextResponse.json({ data: null, error: null });
}