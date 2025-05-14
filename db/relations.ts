import { relations } from "drizzle-orm/relations";
import { user, groupInvite, group, groupMembership, groupJoinRequest, chats, friend } from "./schema";

export const groupInviteRelations = relations(groupInvite, ({one}) => ({
	user: one(user, {
		fields: [groupInvite.createdBy],
		references: [user.id]
	}),
	group: one(group, {
		fields: [groupInvite.group],
		references: [group.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	groupInvites: many(groupInvite),
	groupMemberships: many(groupMembership),
	groupJoinRequests: many(groupJoinRequest),
	chats_chatFrom: many(chats, {
		relationName: "chats_chatFrom_user_id"
	}),
	chats_chatTo: many(chats, {
		relationName: "chats_chatTo_user_id"
	}),
	friends_friendee: many(friend, {
		relationName: "friend_friendee_user_id"
	}),
	friends_friender: many(friend, {
		relationName: "friend_friender_user_id"
	}),
}));

export const groupRelations = relations(group, ({many}) => ({
	groupInvites: many(groupInvite),
	groupMemberships: many(groupMembership),
	groupJoinRequests: many(groupJoinRequest),
	chats: many(chats),
}));

export const groupMembershipRelations = relations(groupMembership, ({one}) => ({
	group: one(group, {
		fields: [groupMembership.groupId],
		references: [group.id]
	}),
	user: one(user, {
		fields: [groupMembership.userId],
		references: [user.id]
	}),
}));

export const groupJoinRequestRelations = relations(groupJoinRequest, ({one}) => ({
	group: one(group, {
		fields: [groupJoinRequest.groupId],
		references: [group.id]
	}),
	user: one(user, {
		fields: [groupJoinRequest.user],
		references: [user.id]
	}),
}));

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

export const friendRelations = relations(friend, ({one}) => ({
	user_friendee: one(user, {
		fields: [friend.friendee],
		references: [user.id],
		relationName: "friend_friendee_user_id"
	}),
	user_friender: one(user, {
		fields: [friend.friender],
		references: [user.id],
		relationName: "friend_friender_user_id"
	}),
}));