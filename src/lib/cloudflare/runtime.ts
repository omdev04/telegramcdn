export function isCloudflareWorkersRuntime(): boolean {
    return typeof navigator === "undefined"
        && typeof caches !== "undefined"
        && typeof (globalThis as { WebSocketPair?: unknown }).WebSocketPair !== "undefined";
}

export function getCloudflareDefaultCache(): Cache | null {
    const cacheStorage = (globalThis as typeof globalThis & {
        caches?: CacheStorage & { default?: Cache };
    }).caches;

    return cacheStorage?.default ?? null;
}