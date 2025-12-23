import { useQuery } from '@tanstack/react-query';
import { getEvents } from '@/services/events.api';

export const useEvents = () =>
    useQuery({
        queryKey: ['events'],
        queryFn: getEvents,
    });