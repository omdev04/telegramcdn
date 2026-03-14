import { NextResponse } from "next/server";
import { getRuntimeEnv, mergeRuntimeEnv } from "@/lib/runtime-env";

export const dynamic = "force-dynamic";

export async function GET() {
    const globalEnvBefore = (globalThis as any)?.env ?? {};
    const cloudflareMergedEnv = mergeRuntimeEnv();

    const mongoFromProcess = process.env.MONGODB_URI;
    const mongoFromGlobal = globalEnvBefore?.MONGODB_URI;
    const mongoResolved = getRuntimeEnv("MONGODB_URI");

    return NextResponse.json({
        ok: Boolean(mongoResolved),
        env: {
            hasMongoUri: Boolean(mongoResolved),
            source: {
                processEnv: Boolean(mongoFromProcess),
                globalEnvBeforeMerge: Boolean(mongoFromGlobal),
                cloudflareContextEnv: Boolean(cloudflareMergedEnv?.MONGODB_URI),
            },
            length: mongoResolved?.length ?? 0,
        },
        runtime: {
            nodeEnv: process.env.NODE_ENV || null,
            platform: process.env.NEXT_RUNTIME || "unknown",
        },
        timestamp: new Date().toISOString(),
    });
}
