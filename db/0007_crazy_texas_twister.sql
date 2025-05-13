ALTER TABLE "groupJoinRequest" RENAME TO "group_join_request";--> statement-breakpoint
ALTER TABLE "group_join_request" DROP CONSTRAINT "groupJoinRequest_user_user_id_fk";
--> statement-breakpoint
ALTER TABLE "group_join_request" DROP CONSTRAINT "groupJoinRequest_group_id_group_id_fk";
--> statement-breakpoint
ALTER TABLE "group_join_request" ADD CONSTRAINT "group_join_request_user_user_id_fk" FOREIGN KEY ("user") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_join_request" ADD CONSTRAINT "group_join_request_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE no action ON UPDATE no action;