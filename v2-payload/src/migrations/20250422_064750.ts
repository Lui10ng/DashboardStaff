import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events" ALTER COLUMN "venue_id" DROP NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "seating_type" DROP NOT NULL;
  ALTER TABLE "users" ADD COLUMN "organizer_id" integer;
  DO $$ BEGIN
   ALTER TABLE "users" ADD CONSTRAINT "users_organizer_id_organizers_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."organizers"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "users_organizer_idx" ON "users" USING btree ("organizer_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" DROP CONSTRAINT "users_organizer_id_organizers_id_fk";
  
  DROP INDEX IF EXISTS "users_organizer_idx";
  ALTER TABLE "events" ALTER COLUMN "venue_id" SET NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "seating_type" SET NOT NULL;
  ALTER TABLE "users" DROP COLUMN IF EXISTS "organizer_id";`)
}
