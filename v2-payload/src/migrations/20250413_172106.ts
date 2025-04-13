import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_forms_form_builder_field_type" AS ENUM('firstName', 'lastName', 'shortText', 'longText', 'email', 'phone', 'number', 'date', 'multipleChoice', 'checkbox', 'dropdown', 'file', 'time', 'region', 'city');
  CREATE TABLE IF NOT EXISTS "forms_form_builder_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "forms_form_builder" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"field_type" "enum_forms_form_builder_field_type" NOT NULL,
  	"label" varchar NOT NULL,
  	"required" boolean DEFAULT false,
  	"description" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "forms_responses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field_id" varchar NOT NULL,
  	"value" varchar,
  	"submitted_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "forms_id" integer;
  DO $$ BEGIN
   ALTER TABLE "forms_form_builder_options" ADD CONSTRAINT "forms_form_builder_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_form_builder"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_form_builder" ADD CONSTRAINT "forms_form_builder_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_responses" ADD CONSTRAINT "forms_responses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "forms_form_builder_options_order_idx" ON "forms_form_builder_options" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_form_builder_options_parent_id_idx" ON "forms_form_builder_options" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_form_builder_order_idx" ON "forms_form_builder" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_form_builder_parent_id_idx" ON "forms_form_builder" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_responses_order_idx" ON "forms_responses" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_responses_parent_id_idx" ON "forms_responses" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "forms_created_at_idx" ON "forms" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "forms_form_builder_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_form_builder" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_responses" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "forms_form_builder_options" CASCADE;
  DROP TABLE "forms_form_builder" CASCADE;
  DROP TABLE "forms_responses" CASCADE;
  DROP TABLE "forms" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_forms_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_forms_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "forms_id";
  DROP TYPE "public"."enum_forms_form_builder_field_type";`)
}
