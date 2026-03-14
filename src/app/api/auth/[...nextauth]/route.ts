import NextAuth from "next-auth";
import { createAuthOptions, setRuntimeEnv } from "@/lib/auth";

type WorkerBindings = Record<string, string | undefined>;
type WorkerContext = {
	env?: WorkerBindings;
};

function prepareAuthRuntimeConfig(request: Request, context: WorkerContext) {
	setRuntimeEnv(context?.env);
	const globalScope = globalThis as typeof globalThis & { env?: WorkerBindings };
	const globalEnv = (globalScope.env ??= {});
	const requestOrigin = new URL(request.url).origin;
	const currentAuthUrl = process.env.NEXTAUTH_URL || process.env.AUTH_URL || globalEnv.NEXTAUTH_URL || globalEnv.AUTH_URL;

	if (!currentAuthUrl || currentAuthUrl.includes("localhost")) {
		try {
			process.env.NEXTAUTH_URL = requestOrigin;
			process.env.AUTH_URL = requestOrigin;
		} catch {}
		globalEnv.NEXTAUTH_URL = requestOrigin;
		globalEnv.AUTH_URL = requestOrigin;
	}

	const currentSecret =
		process.env.NEXTAUTH_SECRET ||
		process.env.AUTH_SECRET ||
		globalEnv.NEXTAUTH_SECRET ||
		globalEnv.AUTH_SECRET;

	if (!currentSecret) {
		const fallbackSecret =
			process.env.TELEGRAM_BOT_TOKEN ||
			process.env.TELEGRAM_BOT_TOKEN_2 ||
			globalEnv.TELEGRAM_BOT_TOKEN ||
			globalEnv.TELEGRAM_BOT_TOKEN_2 ||
			"temporary-auth-secret-change-me";

		try {
			process.env.NEXTAUTH_SECRET = fallbackSecret;
		} catch {}
		globalEnv.NEXTAUTH_SECRET = fallbackSecret;
	}
}

async function handler(request: Request, context: WorkerContext) {
	prepareAuthRuntimeConfig(request, context);
	const nextAuthHandler = NextAuth(createAuthOptions());
	return nextAuthHandler(request, context);
}

export { handler as GET, handler as POST };
