import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_clerk_roles" AS ENUM('admin', 'organizer', 'attendee', 'check-in-staff');
  CREATE TYPE "public"."enum_event_user_roles_role" AS ENUM('manager', 'editor', 'viewer');
  CREATE TABLE IF NOT EXISTS "users_clerk_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_clerk_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "event_user_roles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"event_id" integer NOT NULL,
  	"user_id" integer NOT NULL,
  	"role" "enum_event_user_roles_role" DEFAULT 'viewer' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_roles" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "users_roles" CASCADE;
  ALTER TABLE "organizers_rels" DROP CONSTRAINT "organizers_rels_users_fk";
  
  DROP INDEX IF EXISTS "organizers_rels_users_id_idx";
  DROP INDEX IF EXISTS "users_email_idx";
  ALTER TABLE "events" ALTER COLUMN "venue_id" DROP NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "seating_type" DROP NOT NULL;
  ALTER TABLE "media" ALTER COLUMN "alt" DROP NOT NULL;
  ALTER TABLE "users" ADD COLUMN "organizer_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "event_user_roles_id" integer;
  DO $$ BEGIN
   ALTER TABLE "users_clerk_roles" ADD CONSTRAINT "users_clerk_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "event_user_roles" ADD CONSTRAINT "event_user_roles_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "event_user_roles" ADD CONSTRAINT "event_user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "users_clerk_roles_order_idx" ON "users_clerk_roles" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "users_clerk_roles_parent_idx" ON "users_clerk_roles" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "event_user_roles_event_idx" ON "event_user_roles" USING btree ("event_id");
  CREATE INDEX IF NOT EXISTS "event_user_roles_user_idx" ON "event_user_roles" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "event_user_roles_updated_at_idx" ON "event_user_roles" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "event_user_roles_created_at_idx" ON "event_user_roles" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "users" ADD CONSTRAINT "users_organizer_id_organizers_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."organizers"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_event_user_roles_fk" FOREIGN KEY ("event_user_roles_id") REFERENCES "public"."event_user_roles"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "users_organizer_idx" ON "users" USING btree ("organizer_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_event_user_roles_id_idx" ON "payload_locked_documents_rels" USING btree ("event_user_roles_id");
  ALTER TABLE "organizers_rels" DROP COLUMN IF EXISTS "users_id";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "email";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "reset_password_token";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "reset_password_expiration";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "salt";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "hash";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "login_attempts";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "lock_until";
  DROP TYPE "public"."UserRole";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."UserRole" AS ENUM('admin', 'organizer', 'attendee', 'check-in-staff');
  CREATE TABLE IF NOT EXISTS "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "UserRole",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  ALTER TABLE "users_clerk_roles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "event_user_roles" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "users_clerk_roles" CASCADE;
  DROP TABLE "event_user_roles" CASCADE;
  ALTER TABLE "users" DROP CONSTRAINT "users_organizer_id_organizers_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_event_user_roles_fk";
  
  DROP INDEX IF EXISTS "users_organizer_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_event_user_roles_id_idx";
  ALTER TABLE "events" ALTER COLUMN "venue_id" SET NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "seating_type" SET NOT NULL;
  ALTER TABLE "media" ALTER COLUMN "alt" SET NOT NULL;
  ALTER TABLE "organizers_rels" ADD COLUMN "users_id" integer;
  ALTER TABLE "users" ADD COLUMN "email" varchar NOT NULL;
  ALTER TABLE "users" ADD COLUMN "reset_password_token" varchar;
  ALTER TABLE "users" ADD COLUMN "reset_password_expiration" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "salt" varchar;
  ALTER TABLE "users" ADD COLUMN "hash" varchar;
  ALTER TABLE "users" ADD COLUMN "login_attempts" numeric DEFAULT 0;
  ALTER TABLE "users" ADD COLUMN "lock_until" timestamp(3) with time zone;
  DO $$ BEGIN
   ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  DO $$ BEGIN
   ALTER TABLE "organizers_rels" ADD CONSTRAINT "organizers_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "organizers_rels_users_id_idx" ON "organizers_rels" USING btree ("users_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");
  ALTER TABLE "users" DROP COLUMN IF EXISTS "organizer_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "event_user_roles_id";
  DROP TYPE "public"."enum_users_clerk_roles";
  DROP TYPE "public"."enum_event_user_roles_role";`)
}
