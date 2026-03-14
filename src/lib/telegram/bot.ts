/**
 * Telegram Bot Integration - Legacy Wrapper
 *
 * This file maintains backward compatibility while delegating
 * to the fetch-based TelegramBotManager implementation.
 */

import {
    uploadToTelegram as uploadViaManager,
    getTelegramFileLink as getFileLinkViaManager,
    deleteMessage as deleteViaManager,
    telegramBotManager,
    type TelegramMessage,
} from './bot-manager';

export { telegramBotManager };

export async function uploadToTelegramWithMeta(buffer: Buffer, filename: string) {
    return telegramBotManager.uploadToTelegramWithMeta(buffer, filename);
}

export async function getFileLinkFromBot(botName: string, fileId: string) {
    return telegramBotManager.getFileLinkFromBot(botName, fileId);
}

const token = process.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN_1;

export const bot = token ? { token } : null;

export async function uploadToTelegram(buffer: Buffer, filename: string): Promise<TelegramMessage> {
    try {
        return await uploadViaManager(buffer, filename);
    } catch (error) {
        console.error('Error uploading to Telegram:', error);
        throw error;
    }
}

export async function getTelegramFileLink(fileId: string): Promise<string | null> {
    try {
        return await getFileLinkViaManager(fileId);
    } catch (error) {
        console.error('Error getting file link:', error);
        return null;
    }
}

export async function getTelegramFileStream(fileId: string) {
    try {
        return await getFileLinkViaManager(fileId);
    } catch (error) {
        console.error('Error getting file stream:', error);
        return null;
    }
}

export async function deleteMessage(chatId: string | number, messageId: number) {
    try {
        return await deleteViaManager(chatId, messageId);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (!message.includes('message to delete not found')) {
            console.error('Error deleting from Telegram:', error);
        }
        return false;
    }
}