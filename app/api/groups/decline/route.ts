import { db } from "@/lib/db";
import { groupJoinRequest, groupInvite, groupMembership } from "@/db/schema";
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

  // Deleting the join request by both groupId and userId
  const deletedRequest = await db
    .delete(groupJoinRequest)
    .where(
      and(
        eq(groupJoinRequest.groupId, groupId),
        eq(groupJoinRequest.user, userId),
      ),
    )
    .returning();

  if (deletedRequest.length === 0) {
    return NextResponse.json(
      { error: "No matching join request found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true });
}


//wjrngwjgwiihj