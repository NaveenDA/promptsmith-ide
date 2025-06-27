import { type NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { prompts } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server"; // Uncomment when Clerk is set up

export async function GET(_req: NextRequest) {
	const { userId } = await auth(); 
	if (!userId) {
		return NextResponse.json(
			{ error: "Unauthorized" },
			{ status: 401 },
		);
	}
	const result = await db
		.select()
		.from(prompts)
		.where(eq(prompts.userId, userId));
	return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
	const { userId } = await auth();
	if (!userId) {
		return NextResponse.json(
			{ error: "Unauthorized" },
			{ status: 401 },
		);
	}
	const body = await req.json();
	const { title, content } = body;
	const [newPrompt] = await db
		.insert(prompts)
		.values({
			userId: userId,
			title,
			content,
			tags: [],
			createdAt: new Date(),
			updatedAt: new Date(),
		})
		.returning();
	return NextResponse.json(newPrompt);
}
