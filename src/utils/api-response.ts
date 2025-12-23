export type ApiResponse<T, M = unknown> = {
    data: T | null;
    error: string | null;
    meta?: M;
};
