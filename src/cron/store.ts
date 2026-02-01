import type { CronTask } from './types';
import { ENV } from '../config/env';
import { log } from '../log/logger';

const CRON_TASKS_KEY = 'cron_tasks';
const MAX_TASKS_PER_CHAT = 10;

export async function loadAllTasks(): Promise<CronTask[]> {
    try {
        const data = await ENV.DATABASE.get(CRON_TASKS_KEY);
        if (!data) {
            return [];
        }
        const parsed = JSON.parse(data);
        return parsed.tasks || [];
    } catch (e) {
        log.error('Failed to load cron tasks:', (e as Error).message);
        return [];
    }
}

export async function saveAllTasks(tasks: CronTask[]): Promise<void> {
    try {
        await ENV.DATABASE.put(CRON_TASKS_KEY, JSON.stringify({ tasks }));
    } catch (e) {
        log.error('Failed to save cron tasks:', (e as Error).message);
        throw e;
    }
}

export async function addTask(task: CronTask): Promise<void> {
    const tasks = await loadAllTasks();

    // Check max tasks per chat
    const chatTasks = tasks.filter(t => t.chatId === task.chatId);
    if (chatTasks.length >= MAX_TASKS_PER_CHAT) {
        throw new Error(`Maximum ${MAX_TASKS_PER_CHAT} tasks per chat reached`);
    }

    tasks.push(task);
    await saveAllTasks(tasks);
}

export async function removeTask(id: string): Promise<boolean> {
    const tasks = await loadAllTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
        return false;
    }
    tasks.splice(index, 1);
    await saveAllTasks(tasks);
    return true;
}

export async function updateTask(id: string, updates: Partial<CronTask>): Promise<boolean> {
    const tasks = await loadAllTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
        return false;
    }
    tasks[index] = { ...tasks[index], ...updates };
    await saveAllTasks(tasks);
    return true;
}

export async function getTasksForChat(chatId: number): Promise<CronTask[]> {
    const tasks = await loadAllTasks();
    return tasks.filter(t => t.chatId === chatId);
}

export async function getTaskById(id: string): Promise<CronTask | undefined> {
    const tasks = await loadAllTasks();
    return tasks.find(t => t.id === id);
}
