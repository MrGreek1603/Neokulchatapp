ALTER TABLE "group" ADD COLUMN "visibility" text DEFAULT 'private' NOT NULL;--> statement-breakpoint
ALTER TABLE "group_membership" ADD COLUMN "role" text DEFAULT 'user';