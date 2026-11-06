CREATE TABLE "analytics_events" (
	"id" bigserial PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"event_data" jsonb,
	"event_type" text NOT NULL,
	"tenant_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"tenant_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"amount" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"paid_at" timestamp with time zone,
	"payment_gateway_ref" text,
	"payment_method" text,
	"snapshot_tier" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" uuid,
	"tenant_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"product_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"base_price" bigint NOT NULL,
	"category_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"description" text,
	"duration" integer,
	"image_gallery" jsonb DEFAULT '[]',
	"image_storage_key" text,
	"image_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"original_price" bigint,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"specifications" jsonb DEFAULT '[]',
	"stock" integer,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"tenant_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"address" text,
	"branding_content" jsonb DEFAULT '{}',
	"category" text NOT NULL,
	"city" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"custom_domain" text UNIQUE,
	"domain_active_until" timestamp with time zone,
	"fomo_expires_at" timestamp with time zone,
	"google_maps_url" text,
	"operating_hours" jsonb DEFAULT '{}',
	"package_tier" text DEFAULT 'free' NOT NULL,
	"phone" text,
	"site_active_until" timestamp with time zone,
	"slug" text NOT NULL UNIQUE,
	"status" text DEFAULT 'draft' NOT NULL,
	"theme_config" jsonb DEFAULT '{}',
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" uuid,
	"organization_id" uuid
);
--> statement-breakpoint
CREATE TABLE "variant_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"label" text NOT NULL,
	"price_modifier" bigint DEFAULT 0 NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"variant_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE INDEX "analytics_events_tenant_id_created_at_idx" ON "analytics_events" ("tenant_id","created_at");--> statement-breakpoint
CREATE INDEX "categories_tenant_id_idx" ON "categories" ("tenant_id");--> statement-breakpoint
CREATE INDEX "orders_tenant_id_idx" ON "orders" ("tenant_id");--> statement-breakpoint
CREATE INDEX "orders_user_id_idx" ON "orders" ("user_id");--> statement-breakpoint
CREATE INDEX "product_variants_product_id_idx" ON "product_variants" ("product_id");--> statement-breakpoint
CREATE INDEX "products_tenant_id_idx" ON "products" ("tenant_id");--> statement-breakpoint
CREATE INDEX "products_category_id_idx" ON "products" ("category_id");--> statement-breakpoint
CREATE INDEX "tenants_user_id_idx" ON "tenants" ("user_id");--> statement-breakpoint
CREATE INDEX "tenants_organization_id_idx" ON "tenants" ("organization_id");--> statement-breakpoint
CREATE INDEX "variant_options_variant_id_idx" ON "variant_options" ("variant_id");--> statement-breakpoint
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_tenant_id_tenants_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_tenant_id_tenants_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_tenant_id_tenants_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_tenant_id_tenants_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_organization_id_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "neon_auth"."organization"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "variant_options" ADD CONSTRAINT "variant_options_variant_id_product_variants_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE;