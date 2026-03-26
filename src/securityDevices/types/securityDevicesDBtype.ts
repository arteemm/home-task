export type CurrentSessions = {
    ip: string;
    title: string;
    lastActiveDate: number;
    deviceId: string;
    originalUrl: string;
};

export type SecurityDevicesDBtype = {
    userId: string;
    currentSessions: CurrentSessions[]
};
