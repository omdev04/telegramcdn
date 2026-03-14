import { NextRequest } from "next/server";
import { getCloudflareDefaultCache, isCloudflareWorkersRuntime } from "@/lib/cloudflare/runtime";

function getCacheKey(origin: string, id: string, size: string): Request {
    return new Request(`${origin}/__image-cache/${id}?size=${size}`, {
        method: "GET",
    });
}

export async function getCachedImageResponse(
    req: NextRequest,
    id: string,
    size: string,
): Promise<Response | null> {
    if (!isCloudflareWorkersRuntime()) {
        return null;
    }

    const cache = getCloudflareDefaultCache();
    if (!cache) {
        return null;
    }

    return (await cache.match(getCacheKey(req.nextUrl.origin, id, size))) ?? null;
}

export async function putCachedImageResponse(
    req: NextRequest,
    id: string,
    size: string,
    response: Response,
): Promise<void> {
    if (!isCloudflareWorkersRuntime()) {
        return;
    }

    const cache = getCloudflareDefaultCache();
    if (!cache) {
        return;
    }

    await cache.put(getCacheKey(req.nextUrl.origin, id, size), response.clone());
}