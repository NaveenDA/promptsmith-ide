import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { prompts, promptVersions } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function GET(
	_req: NextRequest,
	context: { params: { id: string } },
) {
	const { params } = context;
	const { userId } = await auth();
	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const prompt = await db
		.select()
		.from(prompts)
		.where(and(eq(prompts.id, params.id), eq(prompts.userId, userId)))
		.limit(1);
	if (!prompt[0])
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	return NextResponse.json(prompt[0]);
}

export async function PUT(
	req: NextRequest,
	context: { params: { id: string } },
) {
	const { params } = context;
	const { userId } = await auth();
	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const { title, content, modelParams } = await req.json();
	const [updated] = await db
		.update(prompts)
		.set({
			...(title && { title }),
			...(content && { content }),
			...(modelParams && { modelParams }),
			updatedAt: new Date(),
		})
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
	context: { params: { id: string } },
) {
	const { params } = context;
	const { userId } = await auth();
	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	// Delete all prompt versions for this prompt
	await db.delete(promptVersions).where(eq(promptVersions.promptId, params.id));
	// Delete the prompt itself
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
