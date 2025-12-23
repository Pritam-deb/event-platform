import { useQuery } from '@tanstack/react-query';
import { getEventById } from '@/services/events.api';

export const useEventById = (id: string) =>
    useQuery({
        queryKey: ['event', id],
        queryFn: () => getEventById(id),
        enabled: Boolean(id),
    });