import {
  pgTable,
  foreignKey,
  uuid,
  text,
  timestamp, // Using timestamptz instead of timestamp
  jsonb,
  integer,
  pgEnum,
  customType,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

const bytea = customType<{ data: Buffer }>({
  dataType() {
    return "bytea";
  },
});

export const groupInviteJoinMethod = pgEnum("group_invite_join_method", [
  "direct",
  "request",
]);
export const groupJoinMethod = pgEnum("group_join_method", [
  "open",
  "request",
  "invite",
]);
export const groupRole = pgEnum("group_role", ["user", "admin"]);
export const groupVisibility = pgEnum("group_visibility", [
  "public",
  "private",
]);

export const friendRequestStatus = pgEnum("friend_request_status", [
  "pending",
  "accepted",
  "rejected",
]);
export const groupInvite = pgTable(
  "group_invite",
  {
    code: text()
      .default(sql`substring(md5(random()::text), 1, 8)`)
      .primaryKey()
      .notNull(),
    group: uuid().notNull(),
    createdBy: uuid("created_by"),
    expiresAt: timestamp("expires_at", { mode: "string" }),
    maxUses: integer("max_uses"),
    usedCount: integer("used_count").default(0),
    joinMethod: groupInviteJoinMethod("join_method")
      .default("request")
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.createdBy],
      foreignColumns: [user.id],
      name: "group_invite_created_by_user_id_fk",
    }),
    foreignKey({
      columns: [table.group],
      foreignColumns: [group.id],
      name: "group_invite_group_group_id_fk",
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
    role: groupRole().default("user").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.groupId],
      foreignColumns: [group.id],
      name: "group_membership_group_id_group_id_fk",
    }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "group_membership_user_id_user_id_fk",
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

export const groupJoinRequest = pgTable(
  "group_join_request",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    user: uuid().notNull(),
    groupId: uuid("group_id").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.groupId],
      foreignColumns: [group.id],
      name: "group_join_request_group_id_group_id_fk",
    }),
    foreignKey({
      columns: [table.user],
      foreignColumns: [user.id],
      name: "group_join_request_user_user_id_fk",
    }),
  ],
);

export const group = pgTable("group", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: text().notNull(),
  createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
  visibility: groupVisibility().default("private").notNull(),
  joinMethod: groupJoinMethod("join_method").default("invite").notNull(),
});

export const chats = pgTable(
  "chats",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    chatFrom: uuid("chat_from").notNull(),
    chatTo: uuid("chat_to"),
    groupId: uuid("group_id"),
    message: text(),
    attachment: text(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
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

export const friend = pgTable(
  "friend",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    friender: uuid().notNull(),
    friendee: uuid().notNull(),
    requestStatus: friendRequestStatus().default("pending").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.friendee],
      foreignColumns: [user.id],
      name: "friend_friendee_user_id_fk",
    }),
    foreignKey({
      columns: [table.friender],
      foreignColumns: [user.id],
      name: "friend_friender_user_id_fk",
    }),
  ],
);
