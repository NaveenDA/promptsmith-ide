CREATE TABLE "vector_databases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"description" text,
	"collection_name" text NOT NULL,
	"connection_config" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"document_count" integer DEFAULT 0,
	"last_connected" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
