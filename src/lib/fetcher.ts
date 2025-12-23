export const fetcher = async <T>(
    input: RequestInfo,
    init?: RequestInit
): Promise<T> => {
    const res = await fetch(input, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            ...(init?.headers ?? {}),
        },
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Request failed');
    }

    return res.json();
};