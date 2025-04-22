import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events" ALTER COLUMN "registration_form_id" DROP NOT NULL;
  ALTER TABLE "events" ADD COLUMN "form_id_id" integer;
  ALTER TABLE "forms" ADD COLUMN "event_id_id" integer;
  DO $$ BEGIN
   ALTER TABLE "events" ADD CONSTRAINT "events_form_id_id_forms_id_fk" FOREIGN KEY ("form_id_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms" ADD CONSTRAINT "forms_event_id_id_events_id_fk" FOREIGN KEY ("event_id_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "events_form_id_idx" ON "events" USING btree ("form_id_id");
  CREATE INDEX IF NOT EXISTS "forms_event_id_idx" ON "forms" USING btree ("event_id_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events" DROP CONSTRAINT "events_form_id_id_forms_id_fk";
  
  ALTER TABLE "forms" DROP CONSTRAINT "forms_event_id_id_events_id_fk";
  
  DROP INDEX IF EXISTS "events_form_id_idx";
  DROP INDEX IF EXISTS "forms_event_id_idx";
  ALTER TABLE "events" ALTER COLUMN "registration_form_id" SET NOT NULL;
  ALTER TABLE "events" DROP COLUMN IF EXISTS "form_id_id";
  ALTER TABLE "forms" DROP COLUMN IF EXISTS "event_id_id";`)
}
