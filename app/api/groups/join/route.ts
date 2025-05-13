import { db } from "@/lib/db";
import { GroupJoinRequests, groupInvite, groupMembership } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { groupId, userId } = await req.json();

  if (!groupId || !userId) {
    return NextResponse.json(
      { error: "Missing groupId or userId" },
      { status: 400 },
    );
  }

  const [invite] = await db
    .insert(groupMembership)
    .values({ groupId: groupId, userId: userId })
    .returning();

  await db
    .delete(GroupJoinRequests)
    .where(
      and(
        eq(GroupJoinRequests.groupId, groupId),
        eq(GroupJoinRequests.user, userId),
      ),
    );

  return NextResponse.json(invite);
}
