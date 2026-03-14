import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Image from "@/models/Image";
import { getTelegramFileLink } from "@/lib/telegram/bot";
import { getCachedImageResponse, putCachedImageResponse } from "@/lib/cache/image-cache";
import { fetchTelegramImage } from "@/lib/images/delivery";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { searchParams } = req.nextUrl;
        const size = searchParams.get("size") || "original"; // small, medium, original

        // 1. DB Lookup
        await dbConnect();
        const image = await Image.findById(id);

        if (!image) {
            return new NextResponse("Image not found", { status: 404 });
        }

        // 2. Security Check - If private, check auth
        if (image.privacy === 'private') {
            const session = await getServerSession(authOptions);
            // @ts-ignore
            const userId = session?.user?.id;
            if (!userId || userId !== image.userId.toString()) {
                return new NextResponse("Forbidden", { status: 403 });
            }
        }

        // 3. Increment view count (fire and forget)
        Image.findByIdAndUpdate(id, { $inc: { views: 1 } }).catch(() => { });

        // 4. Cache Check
        const cachedResponse = await getCachedImageResponse(req, id, size);
        if (cachedResponse) {
            const headers = new Headers(cachedResponse.headers);
            headers.set("Content-Type", headers.get("Content-Type") || image.mimeType);
            headers.set("Cache-Control", "public, max-age=31536000, immutable");
            headers.set("X-Cache", "HIT");
            headers.set("X-Report-Abuse", `${req.nextUrl.origin}/report/${id}`);

            return new NextResponse(cachedResponse.body, {
                headers,
                status: cachedResponse.status,
            });
        }

        // 5. Fetch from Telegram
        const fileLink = await getTelegramFileLink(image.telegramFileId);
        if (!fileLink) {
            return new NextResponse("Upstream Error", { status: 502 });
        }

        const upstreamResponse = await fetchTelegramImage(
            fileLink,
            size,
            req.headers.get("accept"),
        );

        if (!upstreamResponse.ok) {
            return new NextResponse("Upstream Error", { status: 502 });
        }

        const outputBuffer = await upstreamResponse.arrayBuffer();

        // 8. Serve
        const headers = new Headers();
        headers.set("Content-Type", upstreamResponse.headers.get("content-type") || image.mimeType);
        headers.set("Cache-Control", "public, max-age=31536000, immutable");
        headers.set("X-Cache", "MISS");
        headers.set("X-Report-Abuse", `${req.nextUrl.origin}/report/${id}`);

        const response = new NextResponse(outputBuffer, { headers });
        await putCachedImageResponse(req, id, size, response);

        return response;

    } catch (error) {
        console.error("CDN Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
