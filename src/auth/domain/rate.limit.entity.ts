export class RateLimit {
    constructor(
        public limitId: string,
        public rateLimits: RateLimitData[],

    ) {}

    static create(dto: RateLimitData): RateLimit {
        return new this(
            this.createLimitId(dto.ip, dto.URL),
            [dto],
        )
    }

    static createLimitId(ip: string, URL: string) {
        return Buffer.from(ip + URL).toString('base64')
    }

    returnFirstRateLimitData() {
        return this.rateLimits[0];
    }
}

export type RateLimitData = {
    ip: string,
    URL: string;
    date: Date;
};
