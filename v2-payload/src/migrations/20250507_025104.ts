import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_seat_maps_config_seat_config_row_order" AS ENUM('down', 'up');
  CREATE TYPE "public"."enum_seat_maps_config_seat_config_seat_order" AS ENUM('left', 'right');
  ALTER TABLE "seat_maps_sections_rows_seats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "seat_maps_sections_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "seat_maps_sections" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "seat_maps_sections_rows_seats" CASCADE;
  DROP TABLE "seat_maps_sections_rows" CASCADE;
  DROP TABLE "seat_maps_sections" CASCADE;
  ALTER TABLE "events" DROP CONSTRAINT "events_form_id_id_forms_id_fk";
  
  ALTER TABLE "seat_maps" DROP CONSTRAINT "seat_maps_venue_id_venues_id_fk";
  
  DROP INDEX IF EXISTS "events_form_id_idx";
  DROP INDEX IF EXISTS "seat_maps_name_idx";
  DROP INDEX IF EXISTS "seat_maps_venue_idx";
  ALTER TABLE "seat_maps" ADD COLUMN "config_ticket_quantity" numeric NOT NULL;
  ALTER TABLE "seat_maps" ADD COLUMN "config_seat_config_rows" numeric NOT NULL;
  ALTER TABLE "seat_maps" ADD COLUMN "config_seat_config_seats_per_row" numeric NOT NULL;
  ALTER TABLE "seat_maps" ADD COLUMN "config_seat_config_row_start_char" varchar NOT NULL;
  ALTER TABLE "seat_maps" ADD COLUMN "config_seat_config_seat_start_num" numeric NOT NULL;
  ALTER TABLE "seat_maps" ADD COLUMN "config_seat_config_row_order" "enum_seat_maps_config_seat_config_row_order" NOT NULL;
  ALTER TABLE "seat_maps" ADD COLUMN "config_seat_config_seat_order" "enum_seat_maps_config_seat_config_seat_order" NOT NULL;
  ALTER TABLE "seat_maps" ADD COLUMN "config_seat_config_row_label" varchar NOT NULL;
  ALTER TABLE "seat_maps" ADD COLUMN "venue_image_id" integer;
  ALTER TABLE "seat_maps" ADD COLUMN "custom_seat_names" jsonb;
  ALTER TABLE "seat_maps" ADD COLUMN "seats" jsonb NOT NULL;
  ALTER TABLE "seat_maps" ADD COLUMN "summary_total_seats" numeric NOT NULL;
  ALTER TABLE "seat_maps" ADD COLUMN "summary_available_seats" numeric NOT NULL;
  ALTER TABLE "seat_maps" ADD COLUMN "summary_unavailable_seats" numeric NOT NULL;
  ALTER TABLE "seat_maps" ADD COLUMN "summary_sold_seats" numeric NOT NULL;
  ALTER TABLE "ticket_types" ADD COLUMN "seat_map_id" integer;
  DO $$ BEGIN
   ALTER TABLE "seat_maps" ADD CONSTRAINT "seat_maps_venue_image_id_media_id_fk" FOREIGN KEY ("venue_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "ticket_types" ADD CONSTRAINT "ticket_types_seat_map_id_seat_maps_id_fk" FOREIGN KEY ("seat_map_id") REFERENCES "public"."seat_maps"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "seat_maps_venue_image_idx" ON "seat_maps" USING btree ("venue_image_id");
  CREATE INDEX IF NOT EXISTS "ticket_types_seat_map_idx" ON "ticket_types" USING btree ("seat_map_id");
  ALTER TABLE "events" DROP COLUMN IF EXISTS "form_id_id";
  ALTER TABLE "seat_maps" DROP COLUMN IF EXISTS "venue_id";
  ALTER TABLE "seat_maps" DROP COLUMN IF EXISTS "description";
  DROP TYPE "public"."enum_seat_maps_sections_rows_seats_seat_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_seat_maps_sections_rows_seats_seat_type" AS ENUM('standard', 'wheelchair', 'companion', 'restricted_view', 'premium', 'aisle_marker', 'unavailable');
  CREATE TABLE IF NOT EXISTS "seat_maps_sections_rows_seats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"seat_number" varchar NOT NULL,
  	"seat_type" "enum_seat_maps_sections_rows_seats_seat_type" DEFAULT 'standard' NOT NULL,
  	"is_purchasable" boolean DEFAULT true
  );
  
  CREATE TABLE IF NOT EXISTS "seat_maps_sections_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"row_label" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "seat_maps_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_name" varchar NOT NULL
  );
  
  ALTER TABLE "seat_maps" DROP CONSTRAINT "seat_maps_venue_image_id_media_id_fk";
  
  ALTER TABLE "ticket_types" DROP CONSTRAINT "ticket_types_seat_map_id_seat_maps_id_fk";
  
  DROP INDEX IF EXISTS "seat_maps_venue_image_idx";
  DROP INDEX IF EXISTS "ticket_types_seat_map_idx";
  ALTER TABLE "events" ADD COLUMN "form_id_id" integer;
  ALTER TABLE "seat_maps" ADD COLUMN "venue_id" integer;
  ALTER TABLE "seat_maps" ADD COLUMN "description" varchar;
  DO $$ BEGIN
   ALTER TABLE "seat_maps_sections_rows_seats" ADD CONSTRAINT "seat_maps_sections_rows_seats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seat_maps_sections_rows"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "seat_maps_sections_rows" ADD CONSTRAINT "seat_maps_sections_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seat_maps_sections"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "seat_maps_sections" ADD CONSTRAINT "seat_maps_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seat_maps"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "seat_maps_sections_rows_seats_order_idx" ON "seat_maps_sections_rows_seats" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "seat_maps_sections_rows_seats_parent_id_idx" ON "seat_maps_sections_rows_seats" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "seat_maps_sections_rows_order_idx" ON "seat_maps_sections_rows" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "seat_maps_sections_rows_parent_id_idx" ON "seat_maps_sections_rows" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "seat_maps_sections_order_idx" ON "seat_maps_sections" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "seat_maps_sections_parent_id_idx" ON "seat_maps_sections" USING btree ("_parent_id");
  DO $$ BEGIN
   ALTER TABLE "events" ADD CONSTRAINT "events_form_id_id_forms_id_fk" FOREIGN KEY ("form_id_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "seat_maps" ADD CONSTRAINT "seat_maps_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "events_form_id_idx" ON "events" USING btree ("form_id_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "seat_maps_name_idx" ON "seat_maps" USING btree ("name");
  CREATE INDEX IF NOT EXISTS "seat_maps_venue_idx" ON "seat_maps" USING btree ("venue_id");
  ALTER TABLE "seat_maps" DROP COLUMN IF EXISTS "config_ticket_quantity";
  ALTER TABLE "seat_maps" DROP COLUMN IF EXISTS "config_seat_config_rows";
  ALTER TABLE "seat_maps" DROP COLUMN IF EXISTS "config_seat_config_seats_per_row";
  ALTER TABLE "seat_maps" DROP COLUMN IF EXISTS "config_seat_config_row_start_char";
  ALTER TABLE "seat_maps" DROP COLUMN IF EXISTS "config_seat_config_seat_start_num";
  ALTER TABLE "seat_maps" DROP COLUMN IF EXISTS "config_seat_config_row_order";
  ALTER TABLE "seat_maps" DROP COLUMN IF EXISTS "config_seat_config_seat_order";
  ALTER TABLE "seat_maps" DROP COLUMN IF EXISTS "config_seat_config_row_label";
  ALTER TABLE "seat_maps" DROP COLUMN IF EXISTS "venue_image_id";
  ALTER TABLE "seat_maps" DROP COLUMN IF EXISTS "custom_seat_names";
  ALTER TABLE "seat_maps" DROP COLUMN IF EXISTS "seats";
  ALTER TABLE "seat_maps" DROP COLUMN IF EXISTS "summary_total_seats";
  ALTER TABLE "seat_maps" DROP COLUMN IF EXISTS "summary_available_seats";
  ALTER TABLE "seat_maps" DROP COLUMN IF EXISTS "summary_unavailable_seats";
  ALTER TABLE "seat_maps" DROP COLUMN IF EXISTS "summary_sold_seats";
  ALTER TABLE "ticket_types" DROP COLUMN IF EXISTS "seat_map_id";
  DROP TYPE "public"."enum_seat_maps_config_seat_config_row_order";
  DROP TYPE "public"."enum_seat_maps_config_seat_config_seat_order";`)
}
