import {
  pgTable,
  foreignKey,
  uuid,
  text,
  timestamp, // Using timestamptz instead of timestamp
  jsonb,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const groupVisibilityEnum = pgEnum("group_visibility", [
  "public",
  "private",
]);
export const groupRoleEnum = pgEnum("group_role", ["user", "admin"]);
export const groupJoinMethodEnum = pgEnum("group_join_method", [
  "open",
  "request",
  "invite",
]);

export const groupInviteCodeJoinMethodEnum = pgEnum(
  "group_invite_join_method",
  ["direct", "request"],
);
export const chats = pgTable(
  "chats",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    chatFrom: uuid("chat_from").notNull(),
    chatTo: uuid("chat_to"),
    groupId: uuid("group_id"),
    message: text(),
    attachment: text(),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.chatFrom],
      foreignColumns: [user.id],
      name: "chats_chat_from_user_id_fk",
    }),
    foreignKey({
      columns: [table.chatTo],
      foreignColumns: [user.id],
      name: "chats_chat_to_user_id_fk",
    }),
    foreignKey({
      columns: [table.groupId],
      foreignColumns: [group.id],
      name: "chats_group_id_group_id_fk",
    }),
  ],
);

export const group = pgTable("group", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: text().notNull(),
  createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
  visibility: groupVisibilityEnum("visibility").default("private").notNull(),
  joinMethod: groupJoinMethodEnum("join_method").default("invite").notNull(),
});

export const groupInvite = pgTable(
  "group_invite",
  {
    code: text()
      .notNull()
      .unique()
      .default(
        sql`substring(md5(random()::text), 1, 8)`, // Random 8-digit alphanumeric code
      )
      .primaryKey(),
    group: uuid().notNull(),
    createdBy: uuid("created_by"),
    expiresAt: timestamp("expires_at", { mode: "string" }),
    maxUses: integer("max_uses"),
    usedCount: integer("used_count").default(0),
    joinMethod: groupInviteCodeJoinMethodEnum("join_method")
      .default("request")
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.group],
      foreignColumns: [group.id],
    }),
    foreignKey({
      columns: [table.createdBy],
      foreignColumns: [user.id],
    }),
  ],
);

export const groupMembership = pgTable(
  "group_membership",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    groupId: uuid("group_id").notNull(),
    joinedAt: timestamp("joined_at", { mode: "string" }).defaultNow().notNull(),
    role: groupRoleEnum("role").default("user").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "group_membership_user_id_user_id_fk",
    }),
    foreignKey({
      columns: [table.groupId],
      foreignColumns: [group.id],
      name: "group_membership_group_id_group_id_fk",
    }),
  ],
);

export const GroupJoinRequests = pgTable(
  "group_join_request",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    user: uuid().notNull(),
    groupId: uuid("group_id").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.user],
      foreignColumns: [user.id],
    }),
    foreignKey({
      columns: [table.groupId],
      foreignColumns: [group.id],
    }),
  ],
);

export const friend = pgTable(
  "friend",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    friender: uuid().notNull(),
    friendee: uuid().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.friender],
      foreignColumns: [user.id],
      name: "friend_friender_user_id_fk",
    }),
    foreignKey({
      columns: [table.friendee],
      foreignColumns: [user.id],
      name: "friend_friendee_user_id_fk",
    }),
  ],
);

export const user = pgTable("user", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: text().notNull(),
  email: text().notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  displayPicture: text(),
});
