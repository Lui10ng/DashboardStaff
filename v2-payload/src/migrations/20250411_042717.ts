import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."AnnouncementStatus" AS ENUM('draft', 'published');
  CREATE TYPE "public"."EventStatus" AS ENUM('Draft', 'Published', 'Cancelled', 'Archived');
  CREATE TYPE "public"."SeatingType" AS ENUM('general_admission', 'reserved_seating');
  CREATE TYPE "public"."PromotionStatus" AS ENUM('active', 'inactive', 'expired');
  CREATE TYPE "public"."DiscountType" AS ENUM('percentage', 'fixed_amount');
  CREATE TYPE "public"."CurrencyType" AS ENUM('USD', 'PHP', 'EUR');
  CREATE TYPE "public"."enum_seat_maps_sections_rows_seats_seat_type" AS ENUM('standard', 'wheelchair', 'companion', 'restricted_view', 'premium', 'aisle_marker', 'unavailable');
  CREATE TYPE "public"."CheckInStatus" AS ENUM('pending', 'checked_in', 'invalid');
  CREATE TYPE "public"."TicketStatus" AS ENUM('active', 'inactive');
  CREATE TYPE "public"."TransactionType" AS ENUM('ticket_sale', 'donation', 'refund_sale', 'refund_donation', 'platform_fee', 'payment_fee', 'payout', 'payout_fee', 'adj_credit', 'adj_debit');
  CREATE TYPE "public"."UserRole" AS ENUM('admin', 'organizer', 'attendee', 'check-in-staff');
  CREATE TABLE IF NOT EXISTS "event_announcements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"event_id" integer NOT NULL,
  	"title" varchar NOT NULL,
  	"content" jsonb NOT NULL,
  	"status" "AnnouncementStatus" DEFAULT 'draft' NOT NULL,
  	"publish_date" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "event_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "events_event_contacts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"contact_name" varchar NOT NULL,
  	"contact_role" varchar,
  	"contact_email" varchar,
  	"contact_phone" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "EventStatus" DEFAULT 'Published' NOT NULL,
  	"start_time" timestamp(3) with time zone NOT NULL,
  	"end_time" timestamp(3) with time zone NOT NULL,
  	"description" jsonb,
  	"organizer_id" integer NOT NULL,
  	"venue_id" integer NOT NULL,
  	"category_id" integer,
  	"seating_type" "SeatingType" DEFAULT 'general_admission' NOT NULL,
  	"seat_map_id" integer,
  	"total_capacity" numeric,
  	"registration_form_id" integer NOT NULL,
  	"registration_notes" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "events_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "orders_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ticket_type_id" integer NOT NULL,
  	"quantity" numeric NOT NULL,
  	"price_per_ticket" numeric NOT NULL,
  	"currency" varchar NOT NULL,
  	"subtotal" numeric NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"ordered_by_id" integer,
  	"guest_email" varchar,
  	"event_id" integer NOT NULL,
  	"subtotal_amount" numeric,
  	"promotion_id" integer,
  	"discount_amount" numeric DEFAULT 0,
  	"donation_amount" numeric DEFAULT 0,
  	"final_amount" numeric NOT NULL,
  	"currency" varchar NOT NULL,
  	"payment_intent_id" varchar,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "organizer_photos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_logo_url" varchar,
  	"sizes_logo_width" numeric,
  	"sizes_logo_height" numeric,
  	"sizes_logo_mime_type" varchar,
  	"sizes_logo_filesize" numeric,
  	"sizes_logo_filename" varchar,
  	"sizes_banner_url" varchar,
  	"sizes_banner_width" numeric,
  	"sizes_banner_height" numeric,
  	"sizes_banner_mime_type" varchar,
  	"sizes_banner_filesize" numeric,
  	"sizes_banner_filename" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "organizers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" jsonb,
  	"contact_email" varchar,
  	"website" varchar,
  	"logo_id" integer,
  	"banner_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "organizers_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"organizer_photos_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "promotions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"status" "PromotionStatus" DEFAULT 'active' NOT NULL,
  	"discount_type" "DiscountType" NOT NULL,
  	"discount_value" numeric NOT NULL,
  	"currency" "CurrencyType",
  	"usage_limit" numeric,
  	"valid_from" timestamp(3) with time zone,
  	"valid_until" timestamp(3) with time zone,
  	"minimum_order_amount" numeric,
  	"applies_to_all_events" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "promotions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"events_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "registrants" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"ticket_id" integer NOT NULL,
  	"event_id" integer NOT NULL,
  	"registered_user_id" integer,
  	"guest_details_guest_email" varchar,
  	"guest_details_guest_first_name" varchar,
  	"guest_details_guest_last_name" varchar,
  	"submitted_answers" jsonb NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "registration_form_templates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"form_definition" jsonb NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
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
  
  CREATE TABLE IF NOT EXISTS "seat_maps" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"venue_id" integer,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "tickets" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order_id" integer NOT NULL,
  	"event_id" integer NOT NULL,
  	"ticket_type_id" integer NOT NULL,
  	"attendee_id" integer,
  	"ticket_code" varchar NOT NULL,
  	"check_in_status" "CheckInStatus" DEFAULT 'pending' NOT NULL,
  	"checked_in_at" timestamp(3) with time zone,
  	"checked_in_by_id" integer,
  	"assigned_seat_seat_map_section" varchar,
  	"assigned_seat_seat_map_row" varchar,
  	"assigned_seat_seat_map_number" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "ticket_types" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"event_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"price" numeric NOT NULL,
  	"currency" "CurrencyType" DEFAULT 'USD' NOT NULL,
  	"quantity_available" numeric NOT NULL,
  	"sales_start" timestamp(3) with time zone,
  	"sales_end" timestamp(3) with time zone,
  	"status" "TicketStatus" DEFAULT 'active' NOT NULL,
  	"min_order_quantity" numeric DEFAULT 1,
  	"max_order_quantity" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "transactions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"organizer_id" integer NOT NULL,
  	"transaction_date" timestamp(3) with time zone NOT NULL,
  	"type" "TransactionType" NOT NULL,
  	"amount" numeric NOT NULL,
  	"currency" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"related_order_id" integer,
  	"related_user_id" integer,
  	"related_payment_intent_id" varchar,
  	"metadata" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "UserRole",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"clerk_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "venues" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"address_street" varchar,
  	"address_city" varchar,
  	"address_state_province" varchar,
  	"address_postal_code" varchar,
  	"address_country" varchar,
  	"capacity" numeric,
  	"contact_email" varchar,
  	"contact_phone" varchar,
  	"website" varchar,
  	"description" jsonb,
  	"seating_chart_notes" varchar,
  	"default_seat_map_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "venues_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"event_announcements_id" integer,
  	"event_categories_id" integer,
  	"events_id" integer,
  	"media_id" integer,
  	"orders_id" integer,
  	"organizer_photos_id" integer,
  	"organizers_id" integer,
  	"promotions_id" integer,
  	"registrants_id" integer,
  	"registration_form_templates_id" integer,
  	"seat_maps_id" integer,
  	"tickets_id" integer,
  	"ticket_types_id" integer,
  	"transactions_id" integer,
  	"users_id" integer,
  	"venues_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  DO $$ BEGIN
   ALTER TABLE "event_announcements" ADD CONSTRAINT "event_announcements_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "events_event_contacts" ADD CONSTRAINT "events_event_contacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
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
   ALTER TABLE "events" ADD CONSTRAINT "events_category_id_event_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."event_categories"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "events" ADD CONSTRAINT "events_seat_map_id_seat_maps_id_fk" FOREIGN KEY ("seat_map_id") REFERENCES "public"."seat_maps"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "events" ADD CONSTRAINT "events_registration_form_id_registration_form_templates_id_fk" FOREIGN KEY ("registration_form_id") REFERENCES "public"."registration_form_templates"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_ticket_type_id_ticket_types_id_fk" FOREIGN KEY ("ticket_type_id") REFERENCES "public"."ticket_types"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "orders" ADD CONSTRAINT "orders_ordered_by_id_users_id_fk" FOREIGN KEY ("ordered_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "orders" ADD CONSTRAINT "orders_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "orders" ADD CONSTRAINT "orders_promotion_id_promotions_id_fk" FOREIGN KEY ("promotion_id") REFERENCES "public"."promotions"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "organizers" ADD CONSTRAINT "organizers_logo_id_organizer_photos_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."organizer_photos"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "organizers" ADD CONSTRAINT "organizers_banner_image_id_organizer_photos_id_fk" FOREIGN KEY ("banner_image_id") REFERENCES "public"."organizer_photos"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "organizers_rels" ADD CONSTRAINT "organizers_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."organizers"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "organizers_rels" ADD CONSTRAINT "organizers_rels_organizer_photos_fk" FOREIGN KEY ("organizer_photos_id") REFERENCES "public"."organizer_photos"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "organizers_rels" ADD CONSTRAINT "organizers_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "promotions_rels" ADD CONSTRAINT "promotions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."promotions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "promotions_rels" ADD CONSTRAINT "promotions_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "registrants" ADD CONSTRAINT "registrants_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "registrants" ADD CONSTRAINT "registrants_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "registrants" ADD CONSTRAINT "registrants_registered_user_id_users_id_fk" FOREIGN KEY ("registered_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
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
  
  DO $$ BEGIN
   ALTER TABLE "seat_maps" ADD CONSTRAINT "seat_maps_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "tickets" ADD CONSTRAINT "tickets_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "tickets" ADD CONSTRAINT "tickets_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "tickets" ADD CONSTRAINT "tickets_ticket_type_id_ticket_types_id_fk" FOREIGN KEY ("ticket_type_id") REFERENCES "public"."ticket_types"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "tickets" ADD CONSTRAINT "tickets_attendee_id_users_id_fk" FOREIGN KEY ("attendee_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "tickets" ADD CONSTRAINT "tickets_checked_in_by_id_users_id_fk" FOREIGN KEY ("checked_in_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "ticket_types" ADD CONSTRAINT "ticket_types_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "transactions" ADD CONSTRAINT "transactions_organizer_id_organizers_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."organizers"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "transactions" ADD CONSTRAINT "transactions_related_order_id_orders_id_fk" FOREIGN KEY ("related_order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "transactions" ADD CONSTRAINT "transactions_related_user_id_users_id_fk" FOREIGN KEY ("related_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "venues" ADD CONSTRAINT "venues_default_seat_map_id_seat_maps_id_fk" FOREIGN KEY ("default_seat_map_id") REFERENCES "public"."seat_maps"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "venues_rels" ADD CONSTRAINT "venues_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."venues"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "venues_rels" ADD CONSTRAINT "venues_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_event_announcements_fk" FOREIGN KEY ("event_announcements_id") REFERENCES "public"."event_announcements"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_event_categories_fk" FOREIGN KEY ("event_categories_id") REFERENCES "public"."event_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_organizer_photos_fk" FOREIGN KEY ("organizer_photos_id") REFERENCES "public"."organizer_photos"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_organizers_fk" FOREIGN KEY ("organizers_id") REFERENCES "public"."organizers"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_promotions_fk" FOREIGN KEY ("promotions_id") REFERENCES "public"."promotions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_registrants_fk" FOREIGN KEY ("registrants_id") REFERENCES "public"."registrants"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_registration_form_templates_fk" FOREIGN KEY ("registration_form_templates_id") REFERENCES "public"."registration_form_templates"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_seat_maps_fk" FOREIGN KEY ("seat_maps_id") REFERENCES "public"."seat_maps"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tickets_fk" FOREIGN KEY ("tickets_id") REFERENCES "public"."tickets"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ticket_types_fk" FOREIGN KEY ("ticket_types_id") REFERENCES "public"."ticket_types"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_transactions_fk" FOREIGN KEY ("transactions_id") REFERENCES "public"."transactions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_venues_fk" FOREIGN KEY ("venues_id") REFERENCES "public"."venues"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "event_announcements_event_idx" ON "event_announcements" USING btree ("event_id");
  CREATE INDEX IF NOT EXISTS "event_announcements_status_idx" ON "event_announcements" USING btree ("status");
  CREATE INDEX IF NOT EXISTS "event_announcements_updated_at_idx" ON "event_announcements" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "event_announcements_created_at_idx" ON "event_announcements" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "event_categories_name_idx" ON "event_categories" USING btree ("name");
  CREATE INDEX IF NOT EXISTS "event_categories_updated_at_idx" ON "event_categories" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "event_categories_created_at_idx" ON "event_categories" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "events_event_contacts_order_idx" ON "events_event_contacts" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "events_event_contacts_parent_id_idx" ON "events_event_contacts" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "events_title_idx" ON "events" USING btree ("title");
  CREATE UNIQUE INDEX IF NOT EXISTS "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "events_status_idx" ON "events" USING btree ("status");
  CREATE INDEX IF NOT EXISTS "events_organizer_idx" ON "events" USING btree ("organizer_id");
  CREATE INDEX IF NOT EXISTS "events_venue_idx" ON "events" USING btree ("venue_id");
  CREATE INDEX IF NOT EXISTS "events_category_idx" ON "events" USING btree ("category_id");
  CREATE INDEX IF NOT EXISTS "events_seat_map_idx" ON "events" USING btree ("seat_map_id");
  CREATE INDEX IF NOT EXISTS "events_registration_form_idx" ON "events" USING btree ("registration_form_id");
  CREATE INDEX IF NOT EXISTS "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "events_rels_order_idx" ON "events_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "events_rels_parent_idx" ON "events_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "events_rels_path_idx" ON "events_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "events_rels_media_id_idx" ON "events_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "orders_items_order_idx" ON "orders_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "orders_items_parent_id_idx" ON "orders_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "orders_items_ticket_type_idx" ON "orders_items" USING btree ("ticket_type_id");
  CREATE INDEX IF NOT EXISTS "orders_ordered_by_idx" ON "orders" USING btree ("ordered_by_id");
  CREATE INDEX IF NOT EXISTS "orders_guest_email_idx" ON "orders" USING btree ("guest_email");
  CREATE INDEX IF NOT EXISTS "orders_event_idx" ON "orders" USING btree ("event_id");
  CREATE INDEX IF NOT EXISTS "orders_promotion_idx" ON "orders" USING btree ("promotion_id");
  CREATE INDEX IF NOT EXISTS "orders_payment_intent_id_idx" ON "orders" USING btree ("payment_intent_id");
  CREATE INDEX IF NOT EXISTS "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "orders_created_at_idx" ON "orders" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "organizer_photos_updated_at_idx" ON "organizer_photos" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "organizer_photos_created_at_idx" ON "organizer_photos" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "organizer_photos_filename_idx" ON "organizer_photos" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "organizer_photos_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "organizer_photos" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX IF NOT EXISTS "organizer_photos_sizes_logo_sizes_logo_filename_idx" ON "organizer_photos" USING btree ("sizes_logo_filename");
  CREATE INDEX IF NOT EXISTS "organizer_photos_sizes_banner_sizes_banner_filename_idx" ON "organizer_photos" USING btree ("sizes_banner_filename");
  CREATE INDEX IF NOT EXISTS "organizers_name_idx" ON "organizers" USING btree ("name");
  CREATE INDEX IF NOT EXISTS "organizers_logo_idx" ON "organizers" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "organizers_banner_image_idx" ON "organizers" USING btree ("banner_image_id");
  CREATE INDEX IF NOT EXISTS "organizers_updated_at_idx" ON "organizers" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "organizers_created_at_idx" ON "organizers" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "organizers_rels_order_idx" ON "organizers_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "organizers_rels_parent_idx" ON "organizers_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "organizers_rels_path_idx" ON "organizers_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "organizers_rels_organizer_photos_id_idx" ON "organizers_rels" USING btree ("organizer_photos_id");
  CREATE INDEX IF NOT EXISTS "organizers_rels_users_id_idx" ON "organizers_rels" USING btree ("users_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "promotions_code_idx" ON "promotions" USING btree ("code");
  CREATE INDEX IF NOT EXISTS "promotions_status_idx" ON "promotions" USING btree ("status");
  CREATE INDEX IF NOT EXISTS "promotions_updated_at_idx" ON "promotions" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "promotions_created_at_idx" ON "promotions" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "promotions_rels_order_idx" ON "promotions_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "promotions_rels_parent_idx" ON "promotions_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "promotions_rels_path_idx" ON "promotions_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "promotions_rels_events_id_idx" ON "promotions_rels" USING btree ("events_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "registrants_ticket_idx" ON "registrants" USING btree ("ticket_id");
  CREATE INDEX IF NOT EXISTS "registrants_event_idx" ON "registrants" USING btree ("event_id");
  CREATE INDEX IF NOT EXISTS "registrants_registered_user_idx" ON "registrants" USING btree ("registered_user_id");
  CREATE INDEX IF NOT EXISTS "registrants_guest_details_guest_details_guest_email_idx" ON "registrants" USING btree ("guest_details_guest_email");
  CREATE INDEX IF NOT EXISTS "registrants_updated_at_idx" ON "registrants" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "registrants_created_at_idx" ON "registrants" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "registration_form_templates_name_idx" ON "registration_form_templates" USING btree ("name");
  CREATE INDEX IF NOT EXISTS "registration_form_templates_updated_at_idx" ON "registration_form_templates" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "registration_form_templates_created_at_idx" ON "registration_form_templates" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "seat_maps_sections_rows_seats_order_idx" ON "seat_maps_sections_rows_seats" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "seat_maps_sections_rows_seats_parent_id_idx" ON "seat_maps_sections_rows_seats" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "seat_maps_sections_rows_order_idx" ON "seat_maps_sections_rows" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "seat_maps_sections_rows_parent_id_idx" ON "seat_maps_sections_rows" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "seat_maps_sections_order_idx" ON "seat_maps_sections" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "seat_maps_sections_parent_id_idx" ON "seat_maps_sections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "seat_maps_name_idx" ON "seat_maps" USING btree ("name");
  CREATE INDEX IF NOT EXISTS "seat_maps_venue_idx" ON "seat_maps" USING btree ("venue_id");
  CREATE INDEX IF NOT EXISTS "seat_maps_updated_at_idx" ON "seat_maps" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "seat_maps_created_at_idx" ON "seat_maps" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "tickets_order_idx" ON "tickets" USING btree ("order_id");
  CREATE INDEX IF NOT EXISTS "tickets_event_idx" ON "tickets" USING btree ("event_id");
  CREATE INDEX IF NOT EXISTS "tickets_ticket_type_idx" ON "tickets" USING btree ("ticket_type_id");
  CREATE INDEX IF NOT EXISTS "tickets_attendee_idx" ON "tickets" USING btree ("attendee_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "tickets_ticket_code_idx" ON "tickets" USING btree ("ticket_code");
  CREATE INDEX IF NOT EXISTS "tickets_check_in_status_idx" ON "tickets" USING btree ("check_in_status");
  CREATE INDEX IF NOT EXISTS "tickets_checked_in_by_idx" ON "tickets" USING btree ("checked_in_by_id");
  CREATE INDEX IF NOT EXISTS "tickets_updated_at_idx" ON "tickets" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "tickets_created_at_idx" ON "tickets" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "ticket_types_event_idx" ON "ticket_types" USING btree ("event_id");
  CREATE INDEX IF NOT EXISTS "ticket_types_updated_at_idx" ON "ticket_types" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "ticket_types_created_at_idx" ON "ticket_types" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "transactions_organizer_idx" ON "transactions" USING btree ("organizer_id");
  CREATE INDEX IF NOT EXISTS "transactions_transaction_date_idx" ON "transactions" USING btree ("transaction_date");
  CREATE INDEX IF NOT EXISTS "transactions_type_idx" ON "transactions" USING btree ("type");
  CREATE INDEX IF NOT EXISTS "transactions_related_order_idx" ON "transactions" USING btree ("related_order_id");
  CREATE INDEX IF NOT EXISTS "transactions_related_user_idx" ON "transactions" USING btree ("related_user_id");
  CREATE INDEX IF NOT EXISTS "transactions_related_payment_intent_id_idx" ON "transactions" USING btree ("related_payment_intent_id");
  CREATE INDEX IF NOT EXISTS "transactions_updated_at_idx" ON "transactions" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "transactions_created_at_idx" ON "transactions" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "users_clerk_id_idx" ON "users" USING btree ("clerk_id");
  CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "venues_name_idx" ON "venues" USING btree ("name");
  CREATE INDEX IF NOT EXISTS "venues_default_seat_map_idx" ON "venues" USING btree ("default_seat_map_id");
  CREATE INDEX IF NOT EXISTS "venues_updated_at_idx" ON "venues" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "venues_created_at_idx" ON "venues" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "venues_rels_order_idx" ON "venues_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "venues_rels_parent_idx" ON "venues_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "venues_rels_path_idx" ON "venues_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "venues_rels_media_id_idx" ON "venues_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_event_announcements_id_idx" ON "payload_locked_documents_rels" USING btree ("event_announcements_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_event_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("event_categories_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_organizer_photos_id_idx" ON "payload_locked_documents_rels" USING btree ("organizer_photos_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_organizers_id_idx" ON "payload_locked_documents_rels" USING btree ("organizers_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_promotions_id_idx" ON "payload_locked_documents_rels" USING btree ("promotions_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_registrants_id_idx" ON "payload_locked_documents_rels" USING btree ("registrants_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_registration_form_templates_id_idx" ON "payload_locked_documents_rels" USING btree ("registration_form_templates_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_seat_maps_id_idx" ON "payload_locked_documents_rels" USING btree ("seat_maps_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_tickets_id_idx" ON "payload_locked_documents_rels" USING btree ("tickets_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_ticket_types_id_idx" ON "payload_locked_documents_rels" USING btree ("ticket_types_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_transactions_id_idx" ON "payload_locked_documents_rels" USING btree ("transactions_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_venues_id_idx" ON "payload_locked_documents_rels" USING btree ("venues_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "event_announcements" CASCADE;
  DROP TABLE "event_categories" CASCADE;
  DROP TABLE "events_event_contacts" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "events_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "orders_items" CASCADE;
  DROP TABLE "orders" CASCADE;
  DROP TABLE "organizer_photos" CASCADE;
  DROP TABLE "organizers" CASCADE;
  DROP TABLE "organizers_rels" CASCADE;
  DROP TABLE "promotions" CASCADE;
  DROP TABLE "promotions_rels" CASCADE;
  DROP TABLE "registrants" CASCADE;
  DROP TABLE "registration_form_templates" CASCADE;
  DROP TABLE "seat_maps_sections_rows_seats" CASCADE;
  DROP TABLE "seat_maps_sections_rows" CASCADE;
  DROP TABLE "seat_maps_sections" CASCADE;
  DROP TABLE "seat_maps" CASCADE;
  DROP TABLE "tickets" CASCADE;
  DROP TABLE "ticket_types" CASCADE;
  DROP TABLE "transactions" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "venues" CASCADE;
  DROP TABLE "venues_rels" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."AnnouncementStatus";
  DROP TYPE "public"."EventStatus";
  DROP TYPE "public"."SeatingType";
  DROP TYPE "public"."PromotionStatus";
  DROP TYPE "public"."DiscountType";
  DROP TYPE "public"."CurrencyType";
  DROP TYPE "public"."enum_seat_maps_sections_rows_seats_seat_type";
  DROP TYPE "public"."CheckInStatus";
  DROP TYPE "public"."TicketStatus";
  DROP TYPE "public"."TransactionType";
  DROP TYPE "public"."UserRole";`)
}
