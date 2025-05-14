ALTER TABLE "chats" RENAME COLUMN "file" TO "attachment";--> statement-breakpoint
ALTER TABLE "group_invite" DROP CONSTRAINT "group_invite_code_unique";