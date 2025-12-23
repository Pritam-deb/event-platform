import { useQuery } from '@tanstack/react-query';
import { getEvents, GetEventsParams } from '@/services/events.api';

export const useEvents = (params?: GetEventsParams) =>
    useQuery({
        queryKey: ['events', params ?? null],
        queryFn: () => getEvents(params),
    });
