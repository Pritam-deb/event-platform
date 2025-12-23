import { fetcher } from '@/lib/fetcher';
import { Event } from '@/types/event';

export const getEvents = async () => {
    const res = await fetcher<{ data: Event[] }>('/api/events');
    return res.data;
};

export const getEventById = async (id: string) => {
    const res = await fetcher<{ data: Event }>(`/api/events/${id}`);
    return res.data;
};

export const createEvent = async (input: Partial<Event>) => {
    const res = await fetcher<{ data: { id: string } }>('/api/events', {
        method: 'POST',
        body: JSON.stringify(input),
    });
    return res.data;
};

export const updateEvent = async (
    id: string,
    input: Partial<Event>
) => {
    await fetcher(`/api/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(input),
    });
};