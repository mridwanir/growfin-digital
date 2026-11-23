CREATE TABLE "storefront_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"sections" jsonb DEFAULT '[]' NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"theme" jsonb DEFAULT '{}' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"tenant_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tenants" DROP COLUMN "branding_content";--> statement-breakpoint
ALTER TABLE "tenants" DROP COLUMN "fomo_expires_at";--> statement-breakpoint
ALTER TABLE "tenants" DROP COLUMN "theme_config";--> statement-breakpoint
CREATE INDEX "storefront_configs_tenant_id_idx" ON "storefront_configs" ("tenant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "storefront_configs_tenant_id_status_idx" ON "storefront_configs" ("tenant_id","status");--> statement-breakpoint
ALTER TABLE "storefront_configs" ADD CONSTRAINT "storefront_configs_tenant_id_tenants_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE;