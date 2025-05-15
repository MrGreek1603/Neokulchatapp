import { db } from "@/lib/db";
import { groupJoinRequest, groupInvite, groupMembership } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { groupId, userId, groupInviteCode } = await req.json();

  if (!(groupId || groupInviteCode) || !userId) {
    return NextResponse.json(
      { error: "Missing groupId or groupInviteCode or userId" },
      { status: 400 },
    );
  }
  let groupIdCode = groupId;
  if (groupInviteCode) {
    const [gid] = await db
      .select({
        groupId: groupInvite.group,
        joinMethod: groupInvite.joinMethod,
      })
      .from(groupInvite)
      .where(eq(groupInvite.code, groupInviteCode));
    groupIdCode = gid.groupId;

    if (gid.joinMethod === "request") {
      const [invite] = await db
        .insert(groupJoinRequest)
        .values({ groupId: groupIdCode, user: userId })
        .returning();
      return NextResponse.json(invite);
    }
  }
  const [invite] = await db
    .insert(groupMembership)
    .values({ groupId: groupIdCode, userId: userId })
    .returning();

  await db
    .delete(groupJoinRequest)
    .where(
      and(
        eq(groupJoinRequest.groupId, groupId),
        eq(groupJoinRequest.user, userId),
      ),
    );

  return NextResponse.json(invite);
}
