import { NextResponse } from 'next/server';
import { createEventSchema } from '@/validators/event.schema';
import { createEvent, getAllEvents } from '@/services/event.service';
import { ApiResponse } from '@/utils/api-response';

export async function GET() {
    const events = await getAllEvents();

    const response: ApiResponse<typeof events> = {
        data: events,
        error: null,
    };

    return NextResponse.json(response);
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
    } catch (error) {
        return NextResponse.json(
            { data: null, error: 'Invalid request body' },
            { status: 400 }
        );
    }
}