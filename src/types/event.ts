export type Event = {
    id: string;
    title: string;
    description: string | null;
    location: string | null;
    ticketSold: number;
    totalTickets: number;
    eventStatus: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    eventType: 'ONLINE' | 'OFFLINE';
    eventTag: string | null;
    eventAttendees: number;
    eventRevenue: string;
    startAt: Date;
    endAt: Date;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type CreateEventInput = {
    title: string;
    description?: string;
    location?: string;
    totalTickets: number;
    eventStatus: string;
    eventType: string;
    eventTag?: string;
    startAt: Date;
    endAt: Date;
    isPublished?: boolean;
};

export type UpdateEventInput = Partial<CreateEventInput>;