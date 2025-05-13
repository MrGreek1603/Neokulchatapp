import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user } from "@/db/schema";
import { DrizzleError, ilike, or, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (q) {
      const users = await db
        .select()
        .from(user)
        .where(or(ilike(user.name, `%${q}%`), ilike(user.email, `%${q}%`)));

      if (users.length === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json(users);
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
    console.error("Unknown error fetching user(s):", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching user(s)." },
      { status: 500 },
    );
  }
}
