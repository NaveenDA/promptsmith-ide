import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { promptVersions } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { promptId, content, modelParams } = await req.json();
  // Find the latest version number for this prompt
  const lastVersion = await db
    .select({ version: promptVersions.version })
    .from(promptVersions)
    .where(eq(promptVersions.promptId, promptId))
    .orderBy(desc(promptVersions.version))
    .limit(1);
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