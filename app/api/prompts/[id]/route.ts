import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { prompts } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function PUT(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	const { userId } = await auth();
	if (!userId) {
		return NextResponse.json(
			{ error: "Unauthorized" },
			{ status: 401 },
		);
	}
	const { title } = await req.json();
	const [updated] = await db
		.update(prompts)
		.set({ title, updatedAt: new Date() })
		.where(and(eq(prompts.id, params.id), eq(prompts.userId, userId)))
		.returning();
	if (!updated)
		return NextResponse.json(
			{ error: "Not found or unauthorized" },
			{ status: 404 },
		);
	return NextResponse.json(updated);
}

export async function DELETE(
	_req: NextRequest,
	{ params }: { params: { id: string } },
) {
	const { userId } = await auth();
	if (!userId) {
		return NextResponse.json(
			{ error: "Unauthorized" },
			{ status: 401 },
		);
	}
	const [deleted] = await db
		.delete(prompts)
		.where(and(eq(prompts.id, params.id), eq(prompts.userId, userId)))
		.returning();
	if (!deleted)
		return NextResponse.json(
			{ error: "Not found or unauthorized" },
			{ status: 404 },
		);
	return NextResponse.json(deleted);
}
