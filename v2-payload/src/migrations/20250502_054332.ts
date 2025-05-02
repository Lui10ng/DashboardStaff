import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events" DROP CONSTRAINT "events_organizer_id_organizers_id_fk";
  
  ALTER TABLE "events" DROP CONSTRAINT "events_venue_id_venues_id_fk";
  
  ALTER TABLE "transactions" DROP CONSTRAINT "transactions_organizer_id_organizers_id_fk";
  
  DROP INDEX IF EXISTS "events_organizer_idx";
  DROP INDEX IF EXISTS "events_venue_idx";
  DROP INDEX IF EXISTS "transactions_organizer_idx";
  ALTER TABLE "events" ADD COLUMN "user_id" integer NOT NULL;
  ALTER TABLE "promotions_rels" ADD COLUMN "ticket_types_id" integer;
  DO $$ BEGIN
   ALTER TABLE "events" ADD CONSTRAINT "events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "promotions_rels" ADD CONSTRAINT "promotions_rels_ticket_types_fk" FOREIGN KEY ("ticket_types_id") REFERENCES "public"."ticket_types"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "events_user_idx" ON "events" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "promotions_rels_ticket_types_id_idx" ON "promotions_rels" USING btree ("ticket_types_id");
  ALTER TABLE "events" DROP COLUMN IF EXISTS "organizer_id";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "venue_id";
  ALTER TABLE "transactions" DROP COLUMN IF EXISTS "organizer_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events" DROP CONSTRAINT "events_user_id_users_id_fk";
  
  ALTER TABLE "promotions_rels" DROP CONSTRAINT "promotions_rels_ticket_types_fk";
  
  DROP INDEX IF EXISTS "events_user_idx";
  DROP INDEX IF EXISTS "promotions_rels_ticket_types_id_idx";
  ALTER TABLE "events" ADD COLUMN "organizer_id" integer NOT NULL;
  ALTER TABLE "events" ADD COLUMN "venue_id" integer;
  ALTER TABLE "transactions" ADD COLUMN "organizer_id" integer NOT NULL;
  DO $$ BEGIN
   ALTER TABLE "events" ADD CONSTRAINT "events_organizer_id_organizers_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."organizers"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "events" ADD CONSTRAINT "events_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "transactions" ADD CONSTRAINT "transactions_organizer_id_organizers_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."organizers"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "events_organizer_idx" ON "events" USING btree ("organizer_id");
  CREATE INDEX IF NOT EXISTS "events_venue_idx" ON "events" USING btree ("venue_id");
  CREATE INDEX IF NOT EXISTS "transactions_organizer_idx" ON "transactions" USING btree ("organizer_id");
  ALTER TABLE "events" DROP COLUMN IF EXISTS "user_id";
  ALTER TABLE "promotions_rels" DROP COLUMN IF EXISTS "ticket_types_id";`)
}
