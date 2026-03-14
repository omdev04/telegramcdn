import { getCloudflareContext } from "@opennextjs/cloudflare";

type RuntimeEnv = Record<string, string | undefined>;

function getGlobalEnv(): RuntimeEnv {
    return (((globalThis as any).env ??= {}) as RuntimeEnv);
}

function getCloudflareEnv(): RuntimeEnv | undefined {
    try {
        const context = getCloudflareContext();
        return context?.env as RuntimeEnv | undefined;
    } catch {
        return undefined;
    }
}

export function mergeRuntimeEnv(env?: RuntimeEnv) {
    const globalEnv = getGlobalEnv();
    if (env) {
        Object.assign(globalEnv, env);
    }

    const cloudflareEnv = getCloudflareEnv();
    if (cloudflareEnv) {
        Object.assign(globalEnv, cloudflareEnv);
    }

    return globalEnv;
}

export function getRuntimeEnv(name: string): string | undefined {
    const globalEnv = getGlobalEnv();
    const cloudflareEnv = getCloudflareEnv();

    const value =
        process.env[name] ||
        globalEnv[name] ||
        cloudflareEnv?.[name] ||
        (globalThis as any)?.[name];

    if (value && !globalEnv[name]) {
        globalEnv[name] = value;
    }

    return value;
}
