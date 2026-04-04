import { SessionDto } from '../types/session.dto';

export class SecurityDevices {
    constructor(
        public userId: string,
        public currentSessions: CurrentSessions[],
    ) {}

    static create(userId: string, dto: CurrentSessions): SecurityDevices {
        return new this(
            userId,
            [dto],
        )
    }
}

export type CurrentSessions = {
    ip: string;
    title: string;
    lastActiveDate: number;
    deviceId: string;
    originalUrl: string;
};
