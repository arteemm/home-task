export type RateLimitData = {
    ip: string,
    URL: string;
    date: Date;
};

export type RateLimitDataList = {
    limitId: string;
    rateLimits: RateLimitData[];
};
