import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events" ADD COLUMN "theme" varchar;
  ALTER TABLE "events" ADD COLUMN "light" varchar;
  CREATE UNIQUE INDEX IF NOT EXISTS "events_theme_idx" ON "events" USING btree ("theme");
  CREATE UNIQUE INDEX IF NOT EXISTS "events_light_idx" ON "events" USING btree ("light");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "events_theme_idx";
  DROP INDEX IF EXISTS "events_light_idx";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "theme";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "light";`)
}
