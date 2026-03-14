import { NextRequest, NextResponse } from "next/server";

function handler(req: NextRequest) {
    const { pathname } = req.nextUrl;
    return NextResponse.json(
        {
            error: "API route not found",
            path: pathname,
            method: req.method,
        },
        { status: 404 }
    );
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const HEAD = handler;
export const OPTIONS = handler;
