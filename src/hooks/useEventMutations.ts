import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    createEvent,
    updateEvent,
    deleteEvent
} from '@/services/events.api';
import type { Event } from '@/types/event';

export const useCreateEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });
};

export const useUpdateEvent = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: Partial<Event>) => updateEvent(id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['event', id] });
        },
    });
};




export const useDeleteEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });
};
