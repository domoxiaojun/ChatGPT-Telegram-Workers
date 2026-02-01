// Log manager for collecting and broadcasting logs to WebSocket clients

interface LogEntry {
    timestamp: number;
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
}

class LogManager {
    private logs: LogEntry[] = [];
    private maxLogs = 1000;
    private clients: Set<any> = new Set();

    addLog(level: LogEntry['level'], message: string) {
        const entry: LogEntry = {
            timestamp: Date.now(),
            level,
            message,
        };

        this.logs.push(entry);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        // Broadcast to all connected WebSocket clients
        this.broadcast(entry);
    }

    getRecentLogs(count: number = 100): LogEntry[] {
        return this.logs.slice(-count);
    }

    addClient(client: any) {
        this.clients.add(client);
    }

    removeClient(client: any) {
        this.clients.delete(client);
    }

    private broadcast(entry: LogEntry) {
        const message = JSON.stringify(entry);
        this.clients.forEach((client) => {
            try {
                if (client.readyState === 1) { // WebSocket.OPEN
                    client.send(message);
                }
            } catch (e) {
                console.error('Failed to send log to client:', e);
                this.clients.delete(client);
            }
        });
    }
}

export const logManager = new LogManager();
