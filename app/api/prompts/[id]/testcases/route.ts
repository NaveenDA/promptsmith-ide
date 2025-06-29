import { type NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { testCases } from "@/lib/schema";
import { withAuth } from "@/lib/auth-wrapper";

async function GETHandler(req: NextRequest, context: unknown, userId: string) {
	const { params } = context as { params: { id: string } };
	const { id: promptId } = await params;
	const searchParams = req.nextUrl.searchParams;
	const category = searchParams.get("category");

	const conditions = [
		eq(testCases.userId, userId),
		eq(testCases.promptId, promptId),
	];

	if (category) {
		conditions.push(eq(testCases.category, category));
	}

	const result = await db
		.select()
		.from(testCases)
		.where(and(...conditions));
	return NextResponse.json(result);
}

async function POSTHandler(req: NextRequest, context: unknown, userId: string) {
	const { params } = context as { params: { id: string } };
	const { id: promptId } = await params;
	const body = await req.json();
	const {
		category,
		name,
		type,
		input,
		expectedOutput,
		validationMethod,
		validationRules,
		aiValidationPrompt,
		useDatabase,
		databaseId,
		embeddingModel,
		numResults,
		similarityThreshold,
	} = body;

	if (!category) {
		return NextResponse.json(
			{ error: "category is required" },
			{ status: 400 },
		);
	}

	const [newTestCase] = await db
		.insert(testCases)
		.values({
			userId,
			promptId,
			category,
			name,
			type: type || category, // Use category as type if not specified
			input,
			expectedOutput,
			validationMethod: validationMethod || "manual",
			validationRules,
			aiValidationPrompt,
			useDatabase: useDatabase || false,
			databaseId,
			embeddingModel,
			numResults: numResults || 3,
			similarityThreshold: similarityThreshold || 0.5,
			createdAt: new Date(),
			updatedAt: new Date(),
		})
		.returning();
	return NextResponse.json(newTestCase);
}

export const GET = withAuth(GETHandler);
export const POST = withAuth(POSTHandler);
