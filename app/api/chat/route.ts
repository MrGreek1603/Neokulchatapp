import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { chats, user } from "@/db/schema";
import { eq, and, or } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core"; // Import the alias function

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const chatWith = searchParams.get("chatWith");
    const groupId = searchParams.get("groupId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    let chatResults;

    // Create an alias for the user table
    const fromUser = alias(user, "fromUser");

    if (groupId) {
      // Fetch group chats
      chatResults = await db
        .select({
          id: chats.id,
          message: chats.message,
          attachment: chats.attachment,
          createdAt: chats.createdAt,
          chatFrom: {
            id: fromUser.id,
            name: fromUser.name,
          },
        })
        .from(chats)
        .leftJoin(fromUser, eq(chats.chatFrom, fromUser.id))
        .where(eq(chats.groupId, groupId))
        .orderBy(chats.createdAt);
    } else if (chatWith) {
      // Fetch 1:1 chats
      chatResults = await db
        .select({
          id: chats.id,
          message: chats.message,
          attachment: chats.attachment,
          createdAt: chats.createdAt,
          chatFrom: {
            id: fromUser.id,
            name: fromUser.name,
          },
        })
        .from(chats)
        .leftJoin(fromUser, eq(chats.chatFrom, fromUser.id))
        .where(
          or(
            and(eq(chats.chatFrom, userId), eq(chats.chatTo, chatWith)),
            and(eq(chats.chatFrom, chatWith), eq(chats.chatTo, userId)),
          ),
        )
        .orderBy(chats.createdAt);
    } else {
      return NextResponse.json(
        { error: "Either chatWith or groupId is required" },
        { status: 400 },
      );
    }

    return NextResponse.json(chatResults, { status: 200 });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json(
      {
        error:
          "Error fetching chats: " +
          (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, chatWith, groupId, message, attachment } = body;

    // Validate required fields
    if (!userId || (!chatWith && !groupId) || !message) {
      return NextResponse.json(
        {
          error: "userId, message, and either chatWith or groupId are required",
        },
        { status: 400 },
      );
    }

    // Insert the new message into the chats table
    const newChat = await db
      .insert(chats)
      .values({
        chatFrom: userId,
        chatTo: chatWith || null,
        groupId: groupId || null,
        message,
        attachment: attachment || null,
        createdAt: new Date().toISOString(),
      })
      .returning({
        id: chats.id,
        message: chats.message,
        attachment: chats.attachment,
        createdAt: chats.createdAt,
        chatFrom: chats.chatFrom,
        chatTo: chats.chatTo,
        groupId: chats.groupId,
      });

    return NextResponse.json(newChat[0], { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
