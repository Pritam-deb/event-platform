import { describe, expect, it } from 'vitest';
import { parseEventsQuery } from './route';

describe('parseEventsQuery', () => {
    it('returns undefined pagination when no pagination params are provided', () => {
        const params = new URLSearchParams();
        const result = parseEventsQuery(params);
        expect(result.limit).toBeUndefined();
        expect(result.offset).toBeUndefined();
        expect(result.startDate).toBeUndefined();
        expect(result.endDate).toBeUndefined();
    });

    it('defaults limit when only offset is provided', () => {
        const params = new URLSearchParams({ offset: '40' });
        const result = parseEventsQuery(params);
        expect(result.limit).toBe(20);
        expect(result.offset).toBe(40);
    });

    it('parses limit and offset as integers', () => {
        const params = new URLSearchParams({ limit: '10', offset: '20' });
        const result = parseEventsQuery(params);
        expect(result.limit).toBe(10);
        expect(result.offset).toBe(20);
    });

    it('rejects invalid limit', () => {
        const params = new URLSearchParams({ limit: '-1', offset: '0' });
        expect(() => parseEventsQuery(params)).toThrow('Invalid limit');
    });

    it('rejects invalid offset', () => {
        const params = new URLSearchParams({ limit: '10', offset: '-5' });
        expect(() => parseEventsQuery(params)).toThrow('Invalid offset');
    });

    it('parses start_date and end_date as dates', () => {
        const params = new URLSearchParams({
            start_date: '2025-01-01',
            end_date: '2025-01-31',
        });
        const result = parseEventsQuery(params);
        expect(result.startDate?.toISOString()).toBe('2025-01-01T00:00:00.000Z');
        expect(result.endDate?.toISOString()).toBe('2025-01-31T23:59:59.999Z');
    });

    it('rejects invalid date formats', () => {
        const params = new URLSearchParams({ start_date: 'not-a-date' });
        expect(() => parseEventsQuery(params)).toThrow('Invalid start_date');
    });

    it('rejects start_date greater than end_date', () => {
        const params = new URLSearchParams({
            start_date: '2025-02-01',
            end_date: '2025-01-01',
        });
        expect(() => parseEventsQuery(params)).toThrow('start_date must be <= end_date');
    });
});

