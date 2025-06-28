import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

type RouteHandler = (
	req: NextRequest,
	context: unknown,
	userId: string,
) => Promise<NextResponse>;

export function withAuth(handler: RouteHandler) {
	return async (req: NextRequest, context: unknown) => {
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		return handler(req, context, userId);
	};
}
