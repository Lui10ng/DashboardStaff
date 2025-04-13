import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "forms" ALTER COLUMN "title" SET DEFAULT 'Registration Form';
  ALTER TABLE "forms" ALTER COLUMN "description" SET DEFAULT 'Please fill out this registration form';
  ALTER TABLE "public"."forms_form_builder" ALTER COLUMN "field_type" SET DATA TYPE text;
  DROP TYPE "public"."enum_forms_form_builder_field_type";
  CREATE TYPE "public"."enum_forms_form_builder_field_type" AS ENUM('text', 'email', 'phone', 'number', 'date', 'time', 'multipleChoice', 'checkbox', 'dropdown', 'file', 'shortText', 'longText', 'region', 'city');
  ALTER TABLE "public"."forms_form_builder" ALTER COLUMN "field_type" SET DATA TYPE "public"."enum_forms_form_builder_field_type" USING "field_type"::"public"."enum_forms_form_builder_field_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "forms" ALTER COLUMN "title" DROP DEFAULT;
  ALTER TABLE "forms" ALTER COLUMN "description" DROP DEFAULT;
  ALTER TABLE "public"."forms_form_builder" ALTER COLUMN "field_type" SET DATA TYPE text;
  DROP TYPE "public"."enum_forms_form_builder_field_type";
  CREATE TYPE "public"."enum_forms_form_builder_field_type" AS ENUM('firstName', 'lastName', 'shortText', 'longText', 'email', 'phone', 'number', 'date', 'multipleChoice', 'checkbox', 'dropdown', 'file', 'time', 'region', 'city');
  ALTER TABLE "public"."forms_form_builder" ALTER COLUMN "field_type" SET DATA TYPE "public"."enum_forms_form_builder_field_type" USING "field_type"::"public"."enum_forms_form_builder_field_type";`)
}
