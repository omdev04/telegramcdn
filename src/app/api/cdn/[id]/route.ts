import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Image from "@/models/Image";
import { getTelegramFileLink, getFileLinkFromBot } from "@/lib/telegram/bot";
import { getCachedImageResponse, putCachedImageResponse } from "@/lib/cache/image-cache";
import { fetchTelegramImage } from "@/lib/images/delivery";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { searchParams } = req.nextUrl;
        const size = searchParams.get("size") || "original"; // small, medium, original

        console.log(`[CDN] Request for image: ${id}, size: ${size}`);

        // 1. DB Lookup
        await dbConnect();
        const image = await Image.findById(id);

        if (!image) {
            console.log(`[CDN] Image not found in DB: ${id}`);
            return new NextResponse("Image not found", { status: 404 });
        }

        console.log(`[CDN] Found image: ${image.originalName}, fileId: ${image.telegramFileId}, bot: ${image.uploadedByBot || 'not-set'}`);

        // 2. Security Check - If private, check auth or token
        const session = await getServerSession(authOptions);
        // @ts-ignore
        const currentUserId = session?.user?.id;
        const isOwner = currentUserId && image.userId.toString() === currentUserId;

        if (image.privacy === 'private') {
            const token = searchParams.get("token");

            // Check if valid access token is provided
            if (token && token === image.accessToken) {
                // Valid token - allow access
            } else {
                // No token or invalid token - check session
                if (!isOwner) {
                    console.log(`[CDN] Access denied to private image: ${id}`);
                    return new NextResponse("Forbidden - Invalid or missing access token", { status: 403 });
                }
            }
        }

        // 2.5. Track Views (increment only if not the owner and only for original size to avoid counting thumbnails multiple times)
        if (!isOwner && size === 'original') {
            try {
                await Image.findByIdAndUpdate(id, { $inc: { views: 1, accessCount: 1 } });
                console.log(`[CDN] View tracked for image: ${id}`);
            } catch (error) {
                console.error(`[CDN] Failed to track view:`, error);
                // Don't fail the request if view tracking fails
            }
        }

        // 3. Cache Check
        const cachedResponse = await getCachedImageResponse(req, id, size);
        if (cachedResponse) {
            console.log(`[CDN] Cache HIT for ${id}`);
            const headers = new Headers(cachedResponse.headers);
            headers.set("Content-Type", headers.get("Content-Type") || image.mimeType);
            headers.set("Cache-Control", "public, max-age=31536000, immutable");
            headers.set("X-Cache", "HIT");

            return new NextResponse(cachedResponse.body, {
                headers,
                status: cachedResponse.status,
            });
        }

        console.log(`[CDN] Cache MISS, fetching from Telegram...`);

        // 4. Fetch from Telegram (Optimized)
        let fileLink: string | null = null;

        if (image.uploadedByBot) {
            // Optimization: We know exactly which bot has the file
            console.log(`[CDN] Trying specific bot: ${image.uploadedByBot}`);
            fileLink = await getFileLinkFromBot(image.uploadedByBot, image.telegramFileId);
        } else {
            // Legacy/Fallback: Search all bots
            console.log(`[CDN] No bot specified, searching all bots...`);
            fileLink = await getTelegramFileLink(image.telegramFileId);
        }

        if (!fileLink) {
            console.log(`[CDN] Failed to get file link from Telegram for fileId: ${image.telegramFileId}`);
            return new NextResponse("Upstream Error", { status: 502 });
        }

        console.log(`[CDN] Got file link from Telegram, downloading...`);

        const upstreamResponse = await fetchTelegramImage(
            fileLink,
            size,
            req.headers.get("accept"),
        );

        if (!upstreamResponse.ok) {
            console.log(`[CDN] Telegram upstream returned ${upstreamResponse.status}`);
            return new NextResponse("Upstream Error", { status: 502 });
        }

        const outputBuffer = await upstreamResponse.arrayBuffer();
        console.log(`[CDN] Downloaded ${outputBuffer.byteLength} bytes from Telegram`);

        // 7. Serve
        const headers = new Headers();
        headers.set("Content-Type", upstreamResponse.headers.get("content-type") || image.mimeType);
        headers.set("Cache-Control", "public, max-age=31536000, immutable");
        headers.set("X-Cache", "MISS");

        const response = new NextResponse(outputBuffer, { headers });
        await putCachedImageResponse(req, id, size, response);

        console.log(`[CDN] Serving image, size: ${outputBuffer.byteLength} bytes`);
        return response;

    } catch (error) {
        console.error("[CDN] Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
