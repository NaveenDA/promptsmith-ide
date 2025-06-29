import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { testCases } from "@/lib/schema";
import { and, eq } from "drizzle-orm";
import { withAuth } from "@/lib/auth-wrapper";

async function DELETEHandler(
	_req: NextRequest,
	context: unknown,
	userId: string,
) {
	const { params } = context as { params: { tid: string; id: string } };
	const { tid } = await params;

	const [deletedTestCase] = await db
		.delete(testCases)
		.where(and(eq(testCases.id, tid), eq(testCases.userId, userId)))
		.returning();

	if (!deletedTestCase) {
		return NextResponse.json({ error: "Test case not found" }, { status: 404 });
	}

	return NextResponse.json({ success: true });
}
export const DELETE = withAuth(DELETEHandler);
