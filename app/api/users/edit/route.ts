import { user } from "@/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const { userId, ...data } = await req.json();
  if (!userId)
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });

  await db.update(user).set(data).where(eq(user.id, userId));
  return NextResponse.json({ success: true });
}
