import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { prompts, promptVersions } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { withAuth } from "@/lib/auth-wrapper";

async function getHandler(_req: NextRequest, context: unknown, userId: string) {
	const { params } = context as { params: { id: string } };
	const { id } = await params;

	const prompt = await db
		.select()
		.from(prompts)
		.where(and(eq(prompts.id, id), eq(prompts.userId, userId)))
		.limit(1);
	if (!prompt[0])
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	return NextResponse.json(prompt[0]);
}

async function putHandler(req: NextRequest, context: unknown, userId: string) {
	const { params } = context as { params: { id: string } };
	const { id } = await params;
	const { title, content, modelParams } = await req.json();
	const [updated] = await db
		.update(prompts)
		.set({
			...(title && { title }),
			...(content && { content }),
			...(modelParams && { modelParams }),
			updatedAt: new Date(),
		})
		.where(and(eq(prompts.id, id), eq(prompts.userId, userId)))
		.returning();
	if (!updated)
		return NextResponse.json(
			{ error: "Not found or unauthorized" },
			{ status: 404 },
		);
	return NextResponse.json(updated);
}

async function deleteHandler(
	_req: NextRequest,
	context: unknown,
	userId: string,
) {
	const { params } = context as { params: { id: string } };
	const { id } = await params;
	// Delete all prompt versions for this prompt
	await db.delete(promptVersions).where(eq(promptVersions.promptId, id));
	// Delete the prompt itself
	const [deleted] = await db
		.delete(prompts)
		.where(and(eq(prompts.id, id), eq(prompts.userId, userId)))
		.returning();
	if (!deleted)
		return NextResponse.json(
			{ error: "Not found or unauthorized" },
			{ status: 404 },
		);
	return NextResponse.json(deleted);
}

export const GET = withAuth(getHandler);
export const PUT = withAuth(putHandler);
export const DELETE = withAuth(deleteHandler);
