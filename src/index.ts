import { ENV } from './config/env';
import tasks from './extra/tools/scheduleTask';
/* eslint-disable unused-imports/no-unused-vars */
import { createRouter } from './route';

export default {
    async fetch(request: Request, env: any): Promise<Response> {
        try {
            ENV.merge(env);
            return createRouter().fetch(request);
        } catch (e) {
            console.error(e);
            return new Response(JSON.stringify({
                message: (e as Error).message,
                stack: (e as Error).stack,
            }), { status: 500 });
        }
    },
    async scheduled(event: Event, env: any, ctx: any) {
        try {
            const promises = [];
            for (const task of Object.values(tasks)) {
                promises.push(task(env));
            }
            await Promise.all(promises);
            console.log('All tasks done.');
        } catch (e) {
            console.error('Error in scheduled tasks:', e);
        }
    },
};
