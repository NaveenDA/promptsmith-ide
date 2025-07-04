import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { promptVersions } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { withAuth } from "@/lib/auth-wrapper";

async function POSTHandler(
	req: NextRequest,
	_context: unknown,
	_userId: string,
) {
	const { promptId, content, modelParams } = await req.json();
	// Find the latest version for this prompt
	const lastVersion = await db
		.select({
			version: promptVersions.version,
			content: promptVersions.content,
			modelParams: promptVersions.modelParams,
			id: promptVersions.id,
			createdAt: promptVersions.createdAt,
		})
		.from(promptVersions)
		.where(eq(promptVersions.promptId, promptId))
		.orderBy(desc(promptVersions.version))
		.limit(1);

	if (
		lastVersion[0] &&
		lastVersion[0].content === content &&
		JSON.stringify(lastVersion[0].modelParams) === JSON.stringify(modelParams)
	) {
		// No changes, do not create a new version
		return NextResponse.json({
			message: "No changes detected. Version not incremented.",
			version: lastVersion[0],
		});
	}

	const nextVersion = (lastVersion[0]?.version || 0) + 1;
	const [newVersion] = await db
		.insert(promptVersions)
		.values({
			promptId,
			version: nextVersion,
			content,
			modelParams,
			createdAt: new Date(),
		})
		.returning();
	return NextResponse.json(newVersion);
}

async function GETHandler(_req: NextRequest, context: unknown) {
	// get the promptId from context
	const { params } = context as { params: { id: string } };
	const { id } = await params;
	console.log("id", id);
	if (!id) return NextResponse.json([], { status: 200 });
	console.log("promptId", id);
	const versions = await db
		.select()
		.from(promptVersions)
		.where(eq(promptVersions.promptId, id))
		.orderBy(desc(promptVersions.version));

	console.log(
		"Query",
		db
			.select()
			.from(promptVersions)
			.where(eq(promptVersions.promptId, id))
			.orderBy(desc(promptVersions.version))
			.toSQL(),
	);
	return NextResponse.json(versions);
}

// use withAuth
export const GET = withAuth(GETHandler);
export const POST = withAuth(POSTHandler);
