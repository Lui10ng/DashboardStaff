import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events" RENAME COLUMN "event_status" TO "status";
  DROP INDEX IF EXISTS "events_event_status_idx";
  CREATE INDEX IF NOT EXISTS "events_status_idx" ON "events" USING btree ("status");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events" RENAME COLUMN "status" TO "event_status";
  DROP INDEX IF EXISTS "events_status_idx";
  CREATE INDEX IF NOT EXISTS "events_event_status_idx" ON "events" USING btree ("event_status");`)
}
