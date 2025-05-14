ALTER TABLE "chats" ALTER COLUMN "attachment" SET DATA TYPE "undefined"."bytea";--> statement-breakpoint
ALTER TABLE "chats" ALTER COLUMN "attachment" SET NOT NULL;