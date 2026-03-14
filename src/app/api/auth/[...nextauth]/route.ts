import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

function prepareAuthRuntimeConfig(request: Request) {
	const requestOrigin = new URL(request.url).origin;
	const currentAuthUrl = process.env.NEXTAUTH_URL;

	if (!currentAuthUrl || currentAuthUrl.includes("localhost")) {
		process.env.NEXTAUTH_URL = requestOrigin;
	}

	if (!process.env.NEXTAUTH_SECRET && !process.env.AUTH_SECRET) {
		process.env.NEXTAUTH_SECRET =
			process.env.TELEGRAM_BOT_TOKEN ||
			process.env.TELEGRAM_BOT_TOKEN_2 ||
			"temporary-auth-secret-change-me";
	}
}

async function handler(request: Request, context: any) {
	prepareAuthRuntimeConfig(request);
	const nextAuthHandler = NextAuth(authOptions);
	return nextAuthHandler(request, context);
}

export { handler as GET, handler as POST };
