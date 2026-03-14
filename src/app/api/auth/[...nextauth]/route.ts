import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

function prepareAuthRuntimeConfig(request: Request) {
	const globalEnv = ((globalThis as any).env ??= {});
	const requestOrigin = new URL(request.url).origin;
	const currentAuthUrl = process.env.NEXTAUTH_URL || globalEnv.NEXTAUTH_URL;

	if (!currentAuthUrl || currentAuthUrl.includes("localhost")) {
		try {
			process.env.NEXTAUTH_URL = requestOrigin;
		} catch {}
		globalEnv.NEXTAUTH_URL = requestOrigin;
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

async function handler(request: Request, context: any) {
	prepareAuthRuntimeConfig(request);
	const nextAuthHandler = NextAuth(authOptions);
	return nextAuthHandler(request, context);
}

export { handler as GET, handler as POST };
