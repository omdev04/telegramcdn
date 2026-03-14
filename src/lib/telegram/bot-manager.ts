export interface TelegramDocument {
    file_id: string;
    file_unique_id?: string;
}

export interface TelegramPhotoSize {
    file_id: string;
    file_unique_id?: string;
}

export interface TelegramMessage {
    message_id: number;
    chat: {
        id: number;
    };
    document?: TelegramDocument;
    photo?: TelegramPhotoSize[];
}

interface BotConfig {
    token: string;
    channelId: string;
    name: string;
}

interface BotHealth {
    isHealthy: boolean;
    lastCheck: number;
    consecutiveFailures: number;
    requestCount: number;
    errorCount: number;
    avgResponseTime: number;
    totalResponseTime: number;
}

class TelegramBotManager {
    private bots: BotConfig[] = [];
    private botHealth: Map<string, BotHealth> = new Map();
    private currentBotIndex = 0;
    private readonly MAX_FAILURES = 3;
    private readonly HIGH_TRAFFIC_THRESHOLD = 100;
    private simulatedFailures: Set<string> = new Set();

    constructor() {
        this.initializeBots();
    }

    simulateFailure(botName: string, active: boolean) {
        if (active) {
            this.simulatedFailures.add(botName);
            const health = this.botHealth.get(botName);
            if (health) {
                health.isHealthy = false;
                health.errorCount++;
            }
            return;
        }

        this.simulatedFailures.delete(botName);
        const health = this.botHealth.get(botName);
        if (health) {
            health.isHealthy = true;
            health.consecutiveFailures = 0;
            health.lastCheck = Date.now();
        }
    }

    private initializeBots() {
        let bot1Token = process.env.TELEGRAM_BOT_TOKEN_1;
        let bot1Channel = process.env.TELEGRAM_CHANNEL_ID_1;

        if (!bot1Token || !bot1Channel) {
            bot1Token = process.env.TELEGRAM_BOT_TOKEN;
            bot1Channel = process.env.TELEGRAM_CHANNEL_ID;
        }

        const bot2Token = process.env.TELEGRAM_BOT_TOKEN_2;
        const bot2Channel = process.env.TELEGRAM_CHANNEL_ID_2;

        if (bot1Token && bot1Channel) {
            this.bots.push({ token: bot1Token, channelId: bot1Channel, name: "bot-1" });
            this.botHealth.set("bot-1", this.createHealthStatus());
        }

        if (bot2Token && bot2Channel) {
            this.bots.push({ token: bot2Token, channelId: bot2Channel, name: "bot-2" });
            this.botHealth.set("bot-2", this.createHealthStatus());
        }

        if (this.bots.length === 0) {
            return;
        }
    }

    private createHealthStatus(): BotHealth {
        return {
            isHealthy: true,
            lastCheck: Date.now(),
            consecutiveFailures: 0,
            requestCount: 0,
            errorCount: 0,
            avgResponseTime: 0,
            totalResponseTime: 0,
        };
    }

    private async callTelegramApi<T>(bot: BotConfig, method: string, body?: BodyInit): Promise<T> {
        if (this.simulatedFailures.has(bot.name)) {
            throw new Error(`Simulated failure for ${bot.name}`);
        }

        const response = await fetch(`https://api.telegram.org/bot${bot.token}/${method}`, {
            method: body ? "POST" : "GET",
            body,
        });

        if (!response.ok) {
            throw new Error(`Telegram API ${method} failed with ${response.status}`);
        }

        const payload = await response.json() as {
            ok: boolean;
            result?: T;
            description?: string;
        };

        if (!payload.ok || typeof payload.result === "undefined") {
            throw new Error(payload.description || `Telegram API ${method} failed`);
        }

        return payload.result;
    }

    private async sendDocument(bot: BotConfig, buffer: Buffer, filename: string): Promise<TelegramMessage> {
        const formData = new FormData();
        const fileBytes = Uint8Array.from(buffer).buffer as ArrayBuffer;
        formData.append("chat_id", bot.channelId);
        formData.append("document", new Blob([fileBytes]), filename);

        return this.callTelegramApi<TelegramMessage>(bot, "sendDocument", formData);
    }

    private async getFilePath(bot: BotConfig, fileId: string): Promise<string> {
        const result = await this.callTelegramApi<{ file_path: string }>(
            bot,
            "getFile",
            new URLSearchParams({ file_id: fileId }),
        );

        return result.file_path;
    }

    private getLeastLoadedBot(): BotConfig | null {
        if (this.bots.length === 0) {
            return null;
        }

        let leastLoadedBot = this.bots[0];
        let lowestLoad = this.botHealth.get(leastLoadedBot.name)?.requestCount ?? Infinity;

        for (const bot of this.bots) {
            const health = this.botHealth.get(bot.name);
            if (health && health.isHealthy && health.requestCount < lowestLoad) {
                leastLoadedBot = bot;
                lowestLoad = health.requestCount;
            }
        }

        return leastLoadedBot;
    }

    private getNextBot(): BotConfig | null {
        if (this.bots.length === 0) {
            return null;
        }

        let attempts = 0;
        while (attempts < this.bots.length) {
            const bot = this.bots[this.currentBotIndex];
            const health = this.botHealth.get(bot.name);

            if (health?.isHealthy && health.requestCount < this.HIGH_TRAFFIC_THRESHOLD) {
                this.currentBotIndex = (this.currentBotIndex + 1) % this.bots.length;
                return bot;
            }

            this.currentBotIndex = (this.currentBotIndex + 1) % this.bots.length;
            attempts++;
        }

        return this.getLeastLoadedBot();
    }

    private markSuccess(botName: string, startedAt: number) {
        const health = this.botHealth.get(botName);
        if (!health) {
            return;
        }

        const responseTime = Math.max(Date.now() - startedAt, 0);
        health.isHealthy = true;
        health.lastCheck = Date.now();
        health.consecutiveFailures = 0;
        health.totalResponseTime += responseTime;
        health.avgResponseTime = health.totalResponseTime / Math.max(health.requestCount, 1);
    }

    private markFailure(botName: string) {
        const health = this.botHealth.get(botName);
        if (!health) {
            return;
        }

        health.errorCount++;
        health.consecutiveFailures++;
        health.lastCheck = Date.now();
        if (health.consecutiveFailures >= this.MAX_FAILURES) {
            health.isHealthy = false;
        }
    }

    async uploadToTelegram(buffer: Buffer, filename: string): Promise<TelegramMessage> {
        const result = await this.uploadToTelegramWithMeta(buffer, filename);
        return result.message;
    }

    async uploadToTelegramWithMeta(buffer: Buffer, filename: string): Promise<{ message: TelegramMessage; botName: string }> {
        let bot = this.getNextBot();
        if (!bot) {
            throw new Error("No Telegram bots available");
        }

        let attempt = 0;
        const maxAttempts = this.bots.length;

        while (attempt < maxAttempts) {
            const health = this.botHealth.get(bot.name);
            if (!health) {
                throw new Error("Bot health status unavailable");
            }

            try {
                health.requestCount++;
                const startedAt = Date.now();
                const message = await this.sendDocument(bot, buffer, filename);
                this.markSuccess(bot.name, startedAt);
                return { message, botName: bot.name };
            } catch (error) {
                this.markFailure(bot.name);
                attempt++;
                if (attempt >= maxAttempts) {
                    throw error;
                }

                const nextBot = this.getNextBot();
                if (!nextBot) {
                    throw error;
                }

                bot = nextBot;
            }
        }

        throw new Error("All bots failed to upload");
    }

    async getTelegramFileLink(fileId: string): Promise<string | null> {
        for (const bot of this.bots) {
            const health = this.botHealth.get(bot.name);
            if (!health?.isHealthy) {
                continue;
            }

            try {
                const startedAt = Date.now();
                const filePath = await this.getFilePath(bot, fileId);
                this.markSuccess(bot.name, startedAt);
                return `https://api.telegram.org/file/bot${bot.token}/${filePath}`;
            } catch (error) {
                this.markFailure(bot.name);
                console.error(`Failed to get file link from ${bot.name}:`, error);
            }
        }

        return null;
    }

    async getFileLinkFromBot(botName: string, fileId: string): Promise<string | null> {
        const bot = this.bots.find((candidate) => candidate.name === botName);
        if (!bot) {
            return null;
        }

        try {
            const startedAt = Date.now();
            const filePath = await this.getFilePath(bot, fileId);
            this.markSuccess(bot.name, startedAt);
            return `https://api.telegram.org/file/bot${bot.token}/${filePath}`;
        } catch (error) {
            this.markFailure(bot.name);
            console.error(`Failed to get file link from ${botName}:`, error);
            return this.getTelegramFileLink(fileId);
        }
    }

    async deleteMessage(chatId: string | number, messageId: number): Promise<boolean> {
        for (const bot of this.bots) {
            try {
                const startedAt = Date.now();
                await this.callTelegramApi<boolean>(
                    bot,
                    "deleteMessage",
                    new URLSearchParams({
                        chat_id: String(chatId),
                        message_id: String(messageId),
                    }),
                );
                this.markSuccess(bot.name, startedAt);
                return true;
            } catch (error) {
                this.markFailure(bot.name);
                const message = error instanceof Error ? error.message : String(error);
                if (!message.includes("message to delete not found")) {
                    console.error(`Error deleting from ${bot.name}:`, error);
                }
            }
        }

        return false;
    }

    async sendMessage(text: string): Promise<boolean> {
        const bot = this.getNextBot();
        if (!bot) {
            console.error("No Telegram bots available for sending message");
            return false;
        }

        try {
            const health = this.botHealth.get(bot.name);
            if (health) {
                health.requestCount++;
            }

            const startedAt = Date.now();
            await this.callTelegramApi<TelegramMessage>(
                bot,
                "sendMessage",
                new URLSearchParams({
                    chat_id: bot.channelId,
                    text,
                    parse_mode: "HTML",
                }),
            );
            this.markSuccess(bot.name, startedAt);
            return true;
        } catch (error) {
            this.markFailure(bot.name);
            console.error(`Failed to send message via ${bot.name}:`, error);
            return false;
        }
    }

    getBotStats() {
        const stats = Array.from(this.botHealth.entries()).map(([name, health]) => ({
            name,
            healthy: health.isHealthy,
            requestCount: health.requestCount,
            errorCount: health.errorCount,
            avgResponseTime: Math.round(health.avgResponseTime),
            lastCheck: new Date(health.lastCheck).toISOString(),
            consecutiveFailures: health.consecutiveFailures,
        }));

        return {
            totalBots: this.bots.length,
            healthyBots: stats.filter((stat) => stat.healthy).length,
            bots: stats,
        };
    }

    switchToBot(botIndex: number) {
        if (botIndex >= 0 && botIndex < this.bots.length) {
            this.currentBotIndex = botIndex;
        }
    }

    destroy() {
        this.simulatedFailures.clear();
    }
}

let botManagerInstance: TelegramBotManager | null = null;

export function getBotManager(): TelegramBotManager {
    if (!botManagerInstance) {
        botManagerInstance = new TelegramBotManager();
    }
    return botManagerInstance;
}

export const telegramBotManager = {
    simulateFailure(botName: string, active: boolean) {
        getBotManager().simulateFailure(botName, active);
    },
    uploadToTelegramWithMeta(buffer: Buffer, filename: string) {
        return getBotManager().uploadToTelegramWithMeta(buffer, filename);
    },
    getFileLinkFromBot(botName: string, fileId: string) {
        return getBotManager().getFileLinkFromBot(botName, fileId);
    },
};

export async function uploadToTelegram(buffer: Buffer, filename: string): Promise<TelegramMessage> {
    return getBotManager().uploadToTelegram(buffer, filename);
}

export async function getTelegramFileLink(fileId: string): Promise<string | null> {
    return getBotManager().getTelegramFileLink(fileId);
}

export async function deleteMessage(chatId: string | number, messageId: number): Promise<boolean> {
    return getBotManager().deleteMessage(chatId, messageId);
}

export async function sendMessage(text: string): Promise<boolean> {
    return getBotManager().sendMessage(text);
}

export function getBotStats() {
    return getBotManager().getBotStats();
}