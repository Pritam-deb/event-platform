import { fetcher } from '@/lib/fetcher';
import { CreateEventInput, Event, PaginationMeta, UpdateEventInput } from '@/types/event';

export type GetEventsParams = {
    limit?: number;
    offset?: number;
    start_date?: string;
    end_date?: string;
};

export const getEvents = async (params?: GetEventsParams) => {
    const qs = new URLSearchParams();
    if (params?.limit != null) qs.set('limit', String(params.limit));
    if (params?.offset != null) qs.set('offset', String(params.offset));
    if (params?.start_date) qs.set('start_date', params.start_date);
    if (params?.end_date) qs.set('end_date', params.end_date);

    const url = qs.toString() ? `/api/events?${qs.toString()}` : '/api/events';
    const res = await fetcher<{ data: Event[]; meta?: PaginationMeta }>(url);
    return { items: res.data, meta: res.meta };
};

export const getEventById = async (id: string) => {
    const res = await fetcher<{ data: Event }>(`/api/events/${id}`);
    return res.data;
};

export const createEvent = async (input: CreateEventInput) => {
    const res = await fetcher<{ data: { id: string } }>('/api/events', {
        method: 'POST',
        body: JSON.stringify(input),
    });
    return res.data;
};

export const updateEvent = async (
    id: string,
    input: UpdateEventInput
) => {
    await fetcher(`/api/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(input),
    });
};

export const deleteEvent = async (id: string) => {
    await fetcher(`/api/events/${id}`, {
        method: 'DELETE',
    });
};
