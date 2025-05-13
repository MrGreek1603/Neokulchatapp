import {
  pgTable,
  foreignKey,
  uuid,
  text,
  timestamp, // Using timestamptz instead of timestamp
  jsonb,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

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
  visibility: text().default("private").notNull(),
});

export const groupMembership = pgTable(
  "group_membership",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    groupId: uuid("group_id").notNull(),
    joinedAt: timestamp("joined_at", { mode: "string" }).defaultNow().notNull(),
    role: text().default("user"),
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
