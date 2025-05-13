CREATE TYPE "public"."group_join_method" AS ENUM('open', 'request', 'invite');--> statement-breakpoint
CREATE TYPE "public"."group_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."group_visibility" AS ENUM('public', 'private');--> statement-breakpoint
ALTER TABLE "group" ALTER COLUMN "visibility" SET DEFAULT 'private'::"public"."group_visibility";--> statement-breakpoint
ALTER TABLE "group" ALTER COLUMN "visibility" SET DATA TYPE "public"."group_visibility" USING "visibility"::"public"."group_visibility";--> statement-breakpoint
ALTER TABLE "group_membership" ALTER COLUMN "role" SET DEFAULT 'user'::"public"."group_role";--> statement-breakpoint
ALTER TABLE "group_membership" ALTER COLUMN "role" SET DATA TYPE "public"."group_role" USING "role"::"public"."group_role";--> statement-breakpoint
ALTER TABLE "group_membership" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "group" ADD COLUMN "join_method" "group_join_method" DEFAULT 'invite' NOT NULL;--> statement-breakpoint
ALTER TABLE "group_invite" ADD COLUMN "created_by" uuid;--> statement-breakpoint
ALTER TABLE "group_invite" ADD COLUMN "expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "group_invite" ADD COLUMN "max_uses" integer;--> statement-breakpoint
ALTER TABLE "group_invite" ADD COLUMN "used_count" integer DEFAULT 0;