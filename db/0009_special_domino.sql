CREATE TABLE "group_invite" (
	"code" text NOT NULL,
	"group" uuid NOT NULL,
	CONSTRAINT "group_invite_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "group_invite" ADD CONSTRAINT "group_invite_group_group_id_fk" FOREIGN KEY ("group") REFERENCES "public"."group"("id") ON DELETE no action ON UPDATE no action;