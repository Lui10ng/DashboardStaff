import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ 
  BEGIN
    IF EXISTS (
      SELECT 1 
      FROM information_schema.table_constraints 
      WHERE constraint_name = 'events_form_id_id_forms_id_fk'
    ) THEN
      ALTER TABLE "events" DROP CONSTRAINT "events_form_id_id_forms_id_fk";
    END IF;

    IF EXISTS (
      SELECT 1 
      FROM information_schema.table_constraints 
      WHERE constraint_name = 'forms_event_id_id_events_id_fk'
    ) THEN
      ALTER TABLE "forms" DROP CONSTRAINT "forms_event_id_id_events_id_fk";
    END IF;
  END $$;
  
  DROP INDEX IF EXISTS "events_form_id_idx";
  DROP INDEX IF EXISTS "forms_event_id_idx";
  
  ALTER TABLE "transactions" ADD COLUMN IF NOT EXISTS "event_id" integer;
  ALTER TABLE "forms" ADD COLUMN IF NOT EXISTS "event_id" integer;
  
  DO $$ BEGIN
   ALTER TABLE "transactions" ADD CONSTRAINT "transactions_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms" ADD CONSTRAINT "forms_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "transactions_event_idx" ON "transactions" USING btree ("event_id");
  CREATE INDEX IF NOT EXISTS "forms_event_idx" ON "forms" USING btree ("event_id");
  
  DO $$ 
  BEGIN
    IF EXISTS (
      SELECT 1 
      FROM information_schema.columns 
      WHERE table_name = 'events' AND column_name = 'form_id_id'
    ) THEN
      ALTER TABLE "events" DROP COLUMN "form_id_id";
    END IF;

    IF EXISTS (
      SELECT 1 
      FROM information_schema.columns 
      WHERE table_name = 'forms' AND column_name = 'event_id_id'
    ) THEN
      ALTER TABLE "forms" DROP COLUMN "event_id_id";
    END IF;
  END $$;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DO $$ 
  BEGIN
    IF EXISTS (
      SELECT 1 
      FROM information_schema.table_constraints 
      WHERE constraint_name = 'transactions_event_id_events_id_fk'
    ) THEN
      ALTER TABLE "transactions" DROP CONSTRAINT "transactions_event_id_events_id_fk";
    END IF;

    IF EXISTS (
      SELECT 1 
      FROM information_schema.table_constraints 
      WHERE constraint_name = 'forms_event_id_events_id_fk'
    ) THEN
      ALTER TABLE "forms" DROP CONSTRAINT "forms_event_id_events_id_fk";
    END IF;
  END $$;
  
  DROP INDEX IF EXISTS "transactions_event_idx";
  DROP INDEX IF EXISTS "forms_event_idx";
  
  ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "form_id_id" integer;
  ALTER TABLE "forms" ADD COLUMN IF NOT EXISTS "event_id_id" integer;
  
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
  CREATE INDEX IF NOT EXISTS "forms_event_id_idx" ON "forms" USING btree ("event_id_id");
  
  DO $$ 
  BEGIN
    IF EXISTS (
      SELECT 1 
      FROM information_schema.columns 
      WHERE table_name = 'transactions' AND column_name = 'event_id'
    ) THEN
      ALTER TABLE "transactions" DROP COLUMN "event_id";
    END IF;

    IF EXISTS (
      SELECT 1 
      FROM information_schema.columns 
      WHERE table_name = 'forms' AND column_name = 'event_id'
    ) THEN
      ALTER TABLE "forms" DROP COLUMN "event_id";
    END IF;
  END $$;`)
}
