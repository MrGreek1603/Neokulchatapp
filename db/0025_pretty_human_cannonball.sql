CREATE TYPE "public"."friend_request_status" AS ENUM('pending', 'accepted', 'rejected');--> statement-breakpoint
ALTER TABLE "friend" ADD COLUMN "requestStatus" "friend_request_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "group" ADD COLUMN "createdBy" uuid NOT NULL;