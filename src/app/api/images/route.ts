import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/apiAuth";
import { checkRateLimit } from "@/lib/rateLimiter";
import dbConnect from "@/lib/mongodb";
import Image from "@/models/Image";

export async function GET(req: NextRequest) {
    try {
        const auth = await authenticateRequest(req);
        if (!auth) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check rate limit
        const rateLimit = checkRateLimit(auth.userId, auth.plan);

        // Always include rate limit headers
        const headers = {
            'X-RateLimit-Limit': rateLimit.limit.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
        };

        if (!rateLimit.allowed) {
            return NextResponse.json(
                {
                    error: "Too Many Requests",
                    message: `Rate limit exceeded. Try again in ${rateLimit.resetIn} seconds.`,
                    limit: rateLimit.limit,
                    resetIn: rateLimit.resetIn
                },
                {
                    status: 429,
                    headers
                }
            );
        }

        const { searchParams } = req.nextUrl;

        const rawPage = searchParams.get("page");
        const rawLimit = searchParams.get("limit");

        const parsedPage = rawPage !== null ? parseInt(rawPage, 10) : 1;
        const parsedLimit = rawLimit !== null ? parseInt(rawLimit, 10) : 20;

        if (!rawPage === false && (isNaN(parsedPage) || parsedPage < 1)) {
            return NextResponse.json({ error: "Invalid 'page' parameter: must be a positive integer" }, { status: 400 });
        }
        if (!rawLimit === false && (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100)) {
            return NextResponse.json({ error: "Invalid 'limit' parameter: must be between 1 and 100" }, { status: 400 });
        }

        const page = isNaN(parsedPage) ? 1 : Math.max(1, parsedPage);
        const limit = isNaN(parsedLimit) ? 20 : Math.min(100, Math.max(1, parsedLimit));
        const skip = (page - 1) * limit;

        await dbConnect();

        // Fetch images
        const images = await Image.find({ userId: auth.userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Image.countDocuments({ userId: auth.userId });

        const baseUrl = req.nextUrl.origin;

        return NextResponse.json({
            success: true,
            images: images.map(img => {
                const cdnUrl = `${baseUrl}/api/cdn/${img._id}`;
                return {
                    id: img._id.toString(),
                    name: img.originalName,
                    filename: img.originalName,
                    size: img.size,
                    url: cdnUrl,
                    directUrl: cdnUrl,
                    views: img.views ?? img.accessCount ?? 0,
                    createdAt: img.createdAt,
                    privacy: img.privacy,
                    ...(img.privacy === 'private' && img.accessToken
                        ? { tokenUrl: `${cdnUrl}?token=${img.accessToken}` }
                        : {})
                };
            }),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        }, { headers });

    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("List Images Error:", message);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

