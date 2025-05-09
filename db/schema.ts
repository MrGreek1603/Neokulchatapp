import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const user = pgTable("user", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});

export const group = pgTable("group", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const groupMembership = pgTable("group_membership", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  groupId: uuid("group_id")
    .notNull()
    .references(() => group.id),
  joinedAt: timestamp("joined_at", { mode: "string" }).defaultNow().notNull(),
});

export const chats = pgTable("chats", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatFrom: uuid("chat_from")
    .notNull()
    .references(() => user.id),
  chatTo: uuid("chat_to").references(() => user.id),
  groupId: uuid("group_id").references(() => group.id),
  message: text("message"),
  attachment: text("attachment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  groupMemberships: many(groupMembership),
  sentChats: many(chats, { relationName: "chatFrom" }),
  receivedChats: many(chats, { relationName: "chatTo" }),
}));

export const groupRelations = relations(group, ({ many }) => ({
  members: many(groupMembership),
  chats: many(chats),
}));

export const groupMembershipRelations = relations(
  groupMembership,
  ({ one }) => ({
    user: one(user, {
      fields: [groupMembership.userId],
      references: [user.id],
    }),
    group: one(group, {
      fields: [groupMembership.groupId],
      references: [group.id],
    }),
  }),
);

export const chatsRelations = relations(chats, ({ one }) => ({
  chatFrom: one(user, {
    fields: [chats.chatFrom],
    references: [user.id],
    relationName: "chatFrom",
  }),
  chatTo: one(user, {
    fields: [chats.chatTo],
    references: [user.id],
    relationName: "chatTo",
  }),
  group: one(group, {
    fields: [chats.groupId],
    references: [group.id],
  }),
}));
