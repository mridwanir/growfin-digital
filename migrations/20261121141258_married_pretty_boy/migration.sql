ALTER TABLE "analytics_events" RENAME COLUMN "event_type" TO "event";--> statement-breakpoint
ALTER TABLE "analytics_events" ADD COLUMN "acquisition" jsonb;--> statement-breakpoint
ALTER TABLE "analytics_events" ADD COLUMN "visitor_hash" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "analytics_events" ALTER COLUMN "visitor_hash" DROP DEFAULT;--> statement-breakpoint
CREATE INDEX "analytics_events_tenant_id_event_created_at_idx" ON "analytics_events" ("tenant_id","event","created_at");