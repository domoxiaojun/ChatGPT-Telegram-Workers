export interface CronTask {
    id: string;
    chatId: number;
    botToken: string;
    botName: string;
    cronExpr: string;
    timezone: string;
    prompt: string;
    enabled: boolean;
    createdAt: number;
    lastRunAt?: number;
    chatType: string;
    userId?: number;
}

export interface CronTaskStore {
    tasks: CronTask[];
}
