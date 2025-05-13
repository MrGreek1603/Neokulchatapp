CREATE TABLE "friend" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"friender" uuid NOT NULL,
	"friendee" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "friend" ADD CONSTRAINT "friend_friender_user_id_fk" FOREIGN KEY ("friender") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friend" ADD CONSTRAINT "friend_friendee_user_id_fk" FOREIGN KEY ("friendee") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;