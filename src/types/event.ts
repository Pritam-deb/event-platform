export type EventDateValue = Date | string;

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
    startAt: EventDateValue;
    endAt: EventDateValue;
    isPublished: boolean;
    createdAt: EventDateValue;
    updatedAt: EventDateValue;
};

export type CreateEventInput = {
    title: string;
    description?: string;
    location?: string;
    totalTickets: number;
    eventStatus: Event['eventStatus'];
    eventType: Event['eventType'];
    eventTag?: string;
    startAt: Date;
    endAt: Date;
    isPublished?: boolean;
};

export type UpdateEventInput = Partial<CreateEventInput>;

export type PaginationMeta = {
    totalCount: number;
    currentPage: number;
    itemsPerPage: number;
    limit: number;
    offset: number;
};
