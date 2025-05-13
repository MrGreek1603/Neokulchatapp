import { db } from "@/lib/db";
import { groupInvite } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");

  if (!groupId) {
    return NextResponse.json({ error: "Missing groupId" }, { status: 400 });
  }

  const invites = await db
    .select()
    .from(groupInvite)
    .where(eq(groupInvite.group, groupId));

  return NextResponse.json(invites);
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");
  const createdBy = searchParams.get("userId");

  if (!groupId || !createdBy) {
    return NextResponse.json(
      { error: "Missing groupId or userId" },
      { status: 400 },
    );
  }

  const [invite] = await db
    .insert(groupInvite)
    .values({ group: groupId, createdBy })
    .returning();

  return NextResponse.json(invite);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const userId = searchParams.get("userId");

  if (!code || !userId) {
    return NextResponse.json(
      { error: "Missing code or userId" },
      { status: 400 },
    );
  }

  await db
    .delete(groupInvite)
    .where(and(eq(groupInvite.code, code), eq(groupInvite.createdBy, userId)));

  return NextResponse.json({ success: true });
}
