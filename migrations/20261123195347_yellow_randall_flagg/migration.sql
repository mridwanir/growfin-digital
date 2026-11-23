CREATE TABLE "account" (
	"id" text PRIMARY KEY,
	"access_token" text,
	"access_token_expires_at" timestamp,
	"account_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id_token" text,
	"password" text,
	"provider_id" text NOT NULL,
	"refresh_token" text,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invitation" (
	"id" text PRIMARY KEY,
	"organization_id" text NOT NULL,
	"email" text NOT NULL,
	"role" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"inviter_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member" (
	"id" text PRIMARY KEY,
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"logo" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" text,
	"category" text,
	"package_tier" text DEFAULT 'free' NOT NULL,
	"custom_domain" varchar(255) UNIQUE,
	"domain_active_until" timestamp with time zone,
	"site_active_until" timestamp with time zone,
	"operating_hours" jsonb DEFAULT '{}',
	"phone" varchar(32),
	"city" varchar(100),
	"address" text,
	"google_maps_url" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY,
	"active_organization_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"ip_address" text,
	"token" text NOT NULL UNIQUE,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_agent" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"identifier" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "analytics_events" DROP CONSTRAINT "analytics_events_tenant_id_tenants_id_fkey";--> statement-breakpoint
ALTER TABLE "categories" DROP CONSTRAINT "categories_tenant_id_tenants_id_fkey";--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_tenant_id_tenants_id_fkey";--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_tenant_id_tenants_id_fkey";--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_user_id_user_id_fkey";--> statement-breakpoint
ALTER TABLE "storefront_configs" DROP CONSTRAINT "storefront_configs_tenant_id_tenants_id_fkey";--> statement-breakpoint
DROP TABLE "tenants";--> statement-breakpoint
DROP INDEX "analytics_events_tenant_id_created_at_idx";--> statement-breakpoint
DROP INDEX "analytics_events_tenant_id_event_created_at_idx";--> statement-breakpoint
DROP INDEX "categories_tenant_id_idx";--> statement-breakpoint
DROP INDEX "products_tenant_id_idx";--> statement-breakpoint
DROP INDEX "orders_tenant_id_idx";--> statement-breakpoint
DROP INDEX "storefront_configs_tenant_id_idx";--> statement-breakpoint
DROP INDEX "storefront_configs_tenant_id_status_idx";--> statement-breakpoint
ALTER TABLE "analytics_events" ADD COLUMN "organization_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "organization_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "organization_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "organization_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "storefront_configs" ADD COLUMN "organization_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "analytics_events" DROP COLUMN "tenant_id";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "tenant_id";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "tenant_id";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "tenant_id";--> statement-breakpoint
ALTER TABLE "storefront_configs" DROP COLUMN "tenant_id";--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "user_id" SET DATA TYPE text USING "user_id"::text;--> statement-breakpoint
CREATE INDEX "analytics_events_organization_id_created_at_idx" ON "analytics_events" ("organization_id","created_at");--> statement-breakpoint
CREATE INDEX "analytics_events_organization_id_event_created_at_idx" ON "analytics_events" ("organization_id","event","created_at");--> statement-breakpoint
CREATE INDEX "invitation_organization_id_idx" ON "invitation" ("organization_id");--> statement-breakpoint
CREATE INDEX "invitation_email_idx" ON "invitation" ("email");--> statement-breakpoint
CREATE INDEX "member_organization_id_idx" ON "member" ("organization_id");--> statement-breakpoint
CREATE INDEX "member_user_id_idx" ON "member" ("user_id");--> statement-breakpoint
CREATE INDEX "categories_organization_id_idx" ON "categories" ("organization_id");--> statement-breakpoint
CREATE INDEX "products_organization_id_idx" ON "products" ("organization_id");--> statement-breakpoint
CREATE INDEX "orders_organization_id_idx" ON "orders" ("organization_id");--> statement-breakpoint
CREATE INDEX "storefront_configs_organization_id_idx" ON "storefront_configs" ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "storefront_configs_organization_id_status_idx" ON "storefront_configs" ("organization_id","status");--> statement-breakpoint
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_organization_id_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organization_id_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviter_id_user_id_fkey" FOREIGN KEY ("inviter_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_organization_id_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_organization_id_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_organization_id_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_organization_id_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "storefront_configs" ADD CONSTRAINT "storefront_configs_organization_id_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL;