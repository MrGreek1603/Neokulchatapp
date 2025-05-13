import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { group, groupMembership, user } from "@/db/schema";
import { DrizzleError, and, eq } from "drizzle-orm";

// GET users in a group
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");
  if (!groupId)
    return NextResponse.json({ error: "Missing groupId" }, { status: 400 });

  const members = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: groupMembership.role,
    })
    .from(groupMembership)
    .innerJoin(user, eq(groupMembership.userId, user.id))
    .where(eq(groupMembership.groupId, groupId));

  return NextResponse.json(members.map((m) => m));
}

// POST join group
export async function POST(req: NextRequest) {
  const { userId, groupId } = await req.json();
  if (!userId || !groupId)
    return NextResponse.json({ error: "Missing params" }, { status: 400 });

  await db.insert(groupMembership).values({ userId, groupId });

  return NextResponse.json({ success: true });
}

// DELETE leave group
export async function DELETE(req: NextRequest) {
  const { userId, groupId } = await req.json();
  if (!userId || !groupId)
    return NextResponse.json({ error: "Missing params" }, { status: 400 });

  await db
    .delete(groupMembership)
    .where(
      and(
        eq(groupMembership.userId, userId),
        eq(groupMembership.groupId, groupId),
      ),
    );

  return NextResponse.json({ success: true });
}
