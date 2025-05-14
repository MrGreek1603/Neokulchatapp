import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { friend } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { friendId, userId, action } = body;

    console.log({ ...body });
    if (!friendId || !userId || !["accept", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "friendId, userId, and valid action are required" },
        { status: 400 },
      );
    }

    const status = action === "accept" ? "accepted" : "rejected";

    const updated = await db
      .update(friend)
      .set({ requestStatus: status })
      .where(
        and(
          eq(friend.friender, friendId),
          eq(friend.friendee, userId),
          eq(friend.requestStatus, "pending"),
        ),
      )
      .returning({ id: friend.id });

    if (updated.length === 0) {
      return NextResponse.json(
        { error: "No matching pending request" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: `Friend request ${status}`, friendId: updated[0].id },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating friend request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
