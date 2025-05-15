import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events" ALTER COLUMN "description" SET DATA TYPE varchar;
  ALTER TABLE "events" ALTER COLUMN "description" SET NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events" ALTER COLUMN "description" SET DATA TYPE jsonb;
  ALTER TABLE "events" ALTER COLUMN "description" DROP NOT NULL;`)
}
