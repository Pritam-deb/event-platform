import { describe, expect, it, vi } from 'vitest';

vi.mock('@/services/event.service', () => ({
    createEvent: vi.fn(),
    listEvents: vi.fn(),
}));

import { GET } from './route';
import { listEvents } from '@/services/event.service';

type Meta = {
    totalCount: number;
    currentPage: number;
    itemsPerPage: number;
    limit: number;
    offset: number;
};

type Body = {
    data: unknown;
    error: string | null;
    meta?: Meta;
};

describe('GET /api/events', () => {
    it('returns meta with correct pagination values', async () => {
        vi.mocked(listEvents).mockResolvedValue({
            items: Array.from({ length: 10 }, (_, i) => ({ id: String(i) })),
            totalCount: 42,
        } as never);

        const res = await GET(
            new Request('http://localhost/api/events?limit=10&offset=20')
        );
        const body = (await res.json()) as Body;

        expect(body.error).toBeNull();
        expect(Array.isArray(body.data)).toBe(true);
        expect((body.data as unknown[])).toHaveLength(10);
        expect(body.meta).toEqual({
            totalCount: 42,
            currentPage: 3,
            itemsPerPage: 10,
            limit: 10,
            offset: 20,
        });
    });

    it('is backward compatible by always returning data array', async () => {
        vi.mocked(listEvents).mockResolvedValue({
            items: [{ id: 'a' }, { id: 'b' }],
            totalCount: 2,
        } as never);

        const res = await GET(new Request('http://localhost/api/events'));
        const body = (await res.json()) as Body;

        expect(Array.isArray(body.data)).toBe(true);
        expect((body.data as unknown[])).toHaveLength(2);
        expect(body.meta?.totalCount).toBe(2);
    });
});
