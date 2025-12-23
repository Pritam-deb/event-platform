import { fetcher } from '@/lib/fetcher';
import { Event } from '@/types/event';

export const getEvents = async () => {
    const res = await fetcher<{ data: Event[] }>('/api/events');
    return res.data;
};