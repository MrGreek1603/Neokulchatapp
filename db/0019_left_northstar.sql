CREATE TYPE "public"."group_invite_join_method" AS ENUM('direct', 'request');--> statement-breakpoint
ALTER TABLE "group_invite" ALTER COLUMN "join_method" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "group_invite" ALTER COLUMN "join_method" SET DATA TYPE "public"."group_invite_join_method" USING "join_method"::text::"public"."group_invite_join_method";--> statement-breakpoint
ALTER TABLE "group_invite" ALTER COLUMN "join_method" SET DEFAULT 'request';