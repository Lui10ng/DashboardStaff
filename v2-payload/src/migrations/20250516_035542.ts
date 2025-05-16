import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "event_announcements_event_announcement" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"announcement_image" varchar,
  	"title" varchar NOT NULL,
  	"content" varchar NOT NULL
  );
  
  DO $$ BEGIN
   ALTER TABLE "event_announcements_event_announcement" ADD CONSTRAINT "event_announcements_event_announcement_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."event_announcements"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "event_announcements_event_announcement_order_idx" ON "event_announcements_event_announcement" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "event_announcements_event_announcement_parent_id_idx" ON "event_announcements_event_announcement" USING btree ("_parent_id");
  ALTER TABLE "event_announcements" DROP COLUMN IF EXISTS "title";
  ALTER TABLE "event_announcements" DROP COLUMN IF EXISTS "content";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "event_announcements_event_announcement" CASCADE;
  ALTER TABLE "event_announcements" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "event_announcements" ADD COLUMN "content" varchar NOT NULL;`)
}
