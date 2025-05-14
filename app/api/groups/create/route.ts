import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { group, groupMembership } from "@/db/schema";

export async function POST(req: Request) {
  const { users, groupName, userId } = await req.json();

  const newGroup = await db
    .insert(group)
    .values({
      name: groupName,
    })
    .returning();

  await db
    .insert(groupMembership)
    .values([
      { userId, groupId: newGroup[0].id, role: "admin" },
      ...users.map((uid: string) => ({ userId: uid, groupId: newGroup[0].id })),
    ]);

  return NextResponse.json({ success: true });
}
