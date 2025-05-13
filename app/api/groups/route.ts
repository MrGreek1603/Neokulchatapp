import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { group, groupMembership } from "@/db/schema";
import { DrizzleError, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const groupId = searchParams.get("groupId");
    const showPublic = searchParams.get("showPublic");

    if (groupId) {
      const singleGroup = await db
        .select()
        .from(group)
        .where(eq(group.id, groupId));
      return NextResponse.json(singleGroup[0]);
    }
    const publicGroups = await db
      .select()
      .from(group)
      .where(eq(group.visibility, "public"));

    if (!userId) {
      const result = publicGroups.map((g) => ({
        group: g,
        group_membership: null,
      }));
      return NextResponse.json(result);
    }

    const userGroups = await db
      .select()
      .from(group)
      .innerJoin(groupMembership, eq(group.id, groupMembership.groupId))
      .where(eq(groupMembership.userId, userId));

    const normalized = [
      ...userGroups,
      ...(showPublic
        ? publicGroups.map((g) => ({
            group: g,
            group_membership: null,
          }))
        : []),
    ];

    const merged = Array.from(
      new Map(normalized.map((g) => [g.group.id, g])).values(),
    );

    return NextResponse.json(merged);
  } catch (error) {
    if (error instanceof DrizzleError) {
      return NextResponse.json(
        {
          error: "Database error",
          detailedError: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
