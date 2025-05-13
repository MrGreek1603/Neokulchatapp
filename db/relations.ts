import { relations } from "drizzle-orm/relations";
import { user, chats, group, groupMembership, friend } from "./schema";

export const chatsRelations = relations(chats, ({one}) => ({
	user_chatFrom: one(user, {
		fields: [chats.chatFrom],
		references: [user.id],
		relationName: "chats_chatFrom_user_id"
	}),
	user_chatTo: one(user, {
		fields: [chats.chatTo],
		references: [user.id],
		relationName: "chats_chatTo_user_id"
	}),
	group: one(group, {
		fields: [chats.groupId],
		references: [group.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	chats_chatFrom: many(chats, {
		relationName: "chats_chatFrom_user_id"
	}),
	chats_chatTo: many(chats, {
		relationName: "chats_chatTo_user_id"
	}),
	groupMemberships: many(groupMembership),
	friends_friender: many(friend, {
		relationName: "friend_friender_user_id"
	}),
	friends_friendee: many(friend, {
		relationName: "friend_friendee_user_id"
	}),
}));

export const groupRelations = relations(group, ({many}) => ({
	chats: many(chats),
	groupMemberships: many(groupMembership),
}));

export const groupMembershipRelations = relations(groupMembership, ({one}) => ({
	user: one(user, {
		fields: [groupMembership.userId],
		references: [user.id]
	}),
	group: one(group, {
		fields: [groupMembership.groupId],
		references: [group.id]
	}),
}));

export const friendRelations = relations(friend, ({one}) => ({
	user_friender: one(user, {
		fields: [friend.friender],
		references: [user.id],
		relationName: "friend_friender_user_id"
	}),
	user_friendee: one(user, {
		fields: [friend.friendee],
		references: [user.id],
		relationName: "friend_friendee_user_id"
	}),
}));