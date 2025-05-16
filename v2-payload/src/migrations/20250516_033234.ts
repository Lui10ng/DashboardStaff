import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "event_instructions_event_instructions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"instruction_image" varchar,
  	"title" varchar NOT NULL,
  	"content" varchar NOT NULL
  );
  
  DO $$ BEGIN
   ALTER TABLE "event_instructions_event_instructions" ADD CONSTRAINT "event_instructions_event_instructions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."event_instructions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "event_instructions_event_instructions_order_idx" ON "event_instructions_event_instructions" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "event_instructions_event_instructions_parent_id_idx" ON "event_instructions_event_instructions" USING btree ("_parent_id");
  ALTER TABLE "events" DROP COLUMN IF EXISTS "registration_notes";
  ALTER TABLE "event_instructions" DROP COLUMN IF EXISTS "title";
  ALTER TABLE "event_instructions" DROP COLUMN IF EXISTS "content";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "event_instructions_event_instructions" CASCADE;
  ALTER TABLE "events" ADD COLUMN "registration_notes" jsonb;
  ALTER TABLE "event_instructions" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "event_instructions" ADD COLUMN "content" varchar NOT NULL;`)
}
