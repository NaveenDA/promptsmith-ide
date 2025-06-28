import { type NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { prompts } from "@/lib/schema";
import { defaultConfig } from "@/lib/store";
import { withAuth } from "@/lib/auth-wrapper";

async function GETHandler(
	_req: NextRequest,
	_context: unknown,
	userId: string,
) {
	const result = await db
		.select()
		.from(prompts)
		.where(eq(prompts.userId, userId));
	return NextResponse.json(result);
}

async function POSTHandler(
	req: NextRequest,
	_context: unknown,
	userId: string,
) {
	const body = await req.json();
	const { title, content, modelParams } = body;
	const [newPrompt] = await db
		.insert(prompts)
		.values({
			userId: userId,
			title,
			content,
			tags: [],
			modelParams: modelParams || defaultConfig,
			createdAt: new Date(),
			updatedAt: new Date(),
		})
		.returning();
	return NextResponse.json(newPrompt);
}

// use withAuth
export const GET = withAuth(GETHandler);
export const POST = withAuth(POSTHandler);
