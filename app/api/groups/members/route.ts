import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { GroupJoinRequests, group, groupMembership, user } from "@/db/schema";
import { DrizzleError, and, eq } from "drizzle-orm";

// GET users in a group
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");
  const pending = searchParams.get("pending") === "true";

  if (!groupId) {
    return NextResponse.json({ error: "Missing groupId" }, { status: 400 });
  }

  if (pending) {
    const pendingRequests = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
      })
      .from(GroupJoinRequests)
      .innerJoin(user, eq(GroupJoinRequests.user, user.id))
      .where(eq(GroupJoinRequests.groupId, groupId));

    return NextResponse.json(pendingRequests);
  }

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

  return NextResponse.json(members);
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
