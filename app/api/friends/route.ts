import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { friend, user } from "@/db/schema";
import { user as userTable } from "@/db/schema"; // Alias the first import
import { user as otherUserTable } from "@/db/schema"; // Keep the second alias

import { eq, or, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  // 1. Friends you sent requests to
  const sent = await db
    .select({
      friendId: friend.friendee,
      friendName: otherUserTable.name,
      friendEmail: otherUserTable.email,
      friendCreatedAt: otherUserTable.createdAt,
      friendDisplayPicture: otherUserTable.displayPicture,
      requestStatus: friend.requestStatus,
      from: friend.friender,
    })
    .from(friend)
    .innerJoin(otherUserTable, eq(friend.friendee, otherUserTable.id))
    .where(eq(friend.friender, userId));

  // 2. Friends who sent requests to you
  const received = await db
    .select({
      friendId: friend.friender,
      friendName: otherUserTable.name,
      friendEmail: otherUserTable.email,
      friendCreatedAt: otherUserTable.createdAt,
      friendDisplayPicture: otherUserTable.displayPicture,
      requestStatus: friend.requestStatus,
      from: friend.friender,
    })
    .from(friend)
    .innerJoin(otherUserTable, eq(friend.friender, otherUserTable.id))
    .where(eq(friend.friendee, userId));

  const friends = [...sent, ...received];
  return NextResponse.json(friends, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { friendeeId, frienderId } = body;

    if (!friendeeId || !frienderId) {
      return NextResponse.json(
        { error: "frienderId and friendeeId are required" },
        { status: 400 },
      );
    }

    // Verify both users exist
    const frienderExists = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, frienderId))
      .limit(1);
    const friendeeExists = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, friendeeId))
      .limit(1);

    if (frienderExists.length === 0 || friendeeExists.length === 0) {
      return NextResponse.json(
        { error: "One or both users not found" },
        { status: 404 },
      );
    }

    // Check if the friendship already exists
    const existingFriendship = await db
      .select({ id: friend.id })
      .from(friend)
      .where(
        or(
          and(eq(friend.friender, frienderId), eq(friend.friendee, friendeeId)),
          and(eq(friend.friendee, frienderId), eq(friend.friender, friendeeId)),
        ),
      )
      .limit(1);

    if (existingFriendship.length > 0) {
      return NextResponse.json(
        { error: "Friendship already exists" },
        { status: 409 },
      );
    }

    // Insert new friend relationship
    const newFriend = await db
      .insert(friend)
      .values({
        friender: frienderId,
        friendee: friendeeId,
      })
      .returning({ id: friend.id });

    return NextResponse.json(
      { message: "Friend added successfully", friendId: newFriend[0].id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error adding friend:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
