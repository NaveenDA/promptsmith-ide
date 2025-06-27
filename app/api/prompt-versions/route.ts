import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { promptVersions } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
	const { userId } = await auth();
	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const promptId = searchParams.get("promptId");
	if (!promptId) return NextResponse.json([], { status: 200 });
	const versions = await db
		.select()
		.from(promptVersions)
		.where(eq(promptVersions.promptId, promptId))
		.orderBy(desc(promptVersions.version));
	return NextResponse.json(versions);
}
