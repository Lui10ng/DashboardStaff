import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."InstructionStatus" AS ENUM('draft', 'published');
  CREATE TABLE IF NOT EXISTS "event_instructions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"event_id" integer NOT NULL,
  	"title" varchar NOT NULL,
  	"content" varchar NOT NULL,
  	"status" "InstructionStatus" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "event_instructions_id" integer;
  DO $$ BEGIN
   ALTER TABLE "event_instructions" ADD CONSTRAINT "event_instructions_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "event_instructions_event_idx" ON "event_instructions" USING btree ("event_id");
  CREATE INDEX IF NOT EXISTS "event_instructions_status_idx" ON "event_instructions" USING btree ("status");
  CREATE INDEX IF NOT EXISTS "event_instructions_updated_at_idx" ON "event_instructions" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "event_instructions_created_at_idx" ON "event_instructions" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_event_instructions_fk" FOREIGN KEY ("event_instructions_id") REFERENCES "public"."event_instructions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_event_instructions_id_idx" ON "payload_locked_documents_rels" USING btree ("event_instructions_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "event_instructions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "event_instructions" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_event_instructions_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_event_instructions_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "event_instructions_id";
  DROP TYPE "public"."InstructionStatus";`)
}
