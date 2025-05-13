CREATE TABLE "groupJoinRequest" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user" uuid NOT NULL,
	"group_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "groupJoinRequest" ADD CONSTRAINT "groupJoinRequest_user_user_id_fk" FOREIGN KEY ("user") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groupJoinRequest" ADD CONSTRAINT "groupJoinRequest_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE no action ON UPDATE no action;