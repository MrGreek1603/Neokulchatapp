import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user } from "@/db/schema";
import { DrizzleError, eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { name, email, id } = await req.json();
    const newUser = await db
      .insert(user)
      .values({ name, email, id })
      .returning();
    return NextResponse.json(newUser[0]);
  } catch (error) {
    if (error instanceof DrizzleError) {
      return NextResponse.json(
        { error: "Failed to create user: " + error.message },
        { status: 500 },
      );
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url); // req.url is the full URL string
    const userId = searchParams.get("userId");

    if (userId) {
      const fetchedUser = await db
        .select()
        .from(user)
        .where(eq(user.id, userId as string)); // Added 'as string' for clarity, ensure type compatibility

      if (fetchedUser.length === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json(fetchedUser[0]);
    } else {
      const allUsers = await db.select().from(user);
      return NextResponse.json(allUsers);
    }
  } catch (error) {
    if (error instanceof DrizzleError) {
      console.error("DrizzleError fetching user(s):", error);
      return NextResponse.json(
        {
          error: "Database error occurred while fetching user(s).",
          detailedError: error.message,
        },
        { status: 500 },
      );
    }
    // Log unexpected errors
    console.error("Unknown error fetching user(s):", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching user(s)." },
      { status: 500 },
    );
  }
}
