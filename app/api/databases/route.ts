import { type NextRequest, NextResponse } from "next/server";
import { encrypt } from "@/lib/encryption";
import { db } from "@/lib/db";
import { vectorDatabases } from "@/lib/schema";
import { and, eq } from "drizzle-orm";
import { withAuth } from "@/lib/auth-wrapper";

async function POSTHandler(
	req: NextRequest,
	_context: unknown,
	userId: string,
) {
	try {
		const data = await req.json();
		const { type, collectionName, description, ...connectionFields } = data;

		// Create connection config object with all connection-related fields
		const connectionConfig: Record<string, unknown> = {};

		// Add all non-metadata fields to connection config
		// use for...of instead of Object.keys
		for (const key of Object.keys(connectionFields)) {
			if (!["name", "type", "collectionName", "description"].includes(key)) {
				connectionConfig[key] = connectionFields[key];
			}
		}

		// Encrypt the entire connection config as JSON
		const encryptedConfig = encrypt(JSON.stringify(connectionConfig));

		await db.insert(vectorDatabases).values({
			userId: userId,
			type,
			collectionName,
			description,
			connectionConfig: encryptedConfig,
			status: "active",
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error saving database config:", error);
		return NextResponse.json(
			{ error: "Failed to save database config" },
			{ status: 500 },
		);
	}
}

async function GETHandler(
	_req: NextRequest,
	_context: unknown,
	userId: string,
) {
	try {
		const result = await db
			.select({
				id: vectorDatabases.id,
				type: vectorDatabases.type,
				collectionName: vectorDatabases.collectionName,
				description: vectorDatabases.description,
				status: vectorDatabases.status,
				documentCount: vectorDatabases.documentCount,
				lastConnected: vectorDatabases.lastConnected,
				createdAt: vectorDatabases.createdAt,
			})
			.from(vectorDatabases)
			.where(eq(vectorDatabases.userId, userId));

		return NextResponse.json(result);
	} catch (error) {
		console.error("Error fetching database configs:", error);
		return NextResponse.json(
			{ error: "Failed to fetch database configs" },
			{ status: 500 },
		);
	}
}

async function DELETEHandler(
	req: NextRequest,
	_context: unknown,
	userId: string,
) {
	try {
		const { searchParams } = new URL(req.url);
		const id = searchParams.get("id");

		if (!id) {
			return NextResponse.json(
				{ error: "Database ID is required" },
				{ status: 400 },
			);
		}

		await db
			.delete(vectorDatabases)
			.where(
				and(eq(vectorDatabases.id, id), eq(vectorDatabases.userId, userId)),
			);
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting database config:", error);
		return NextResponse.json(
			{ error: "Failed to delete database config" },
			{ status: 500 },
		);
	}
}

// use withAuth
export const GET = withAuth(GETHandler);
export const POST = withAuth(POSTHandler);
export const DELETE = withAuth(DELETEHandler);
