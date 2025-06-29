CREATE TABLE "test_case_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"prompt_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "test_cases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"prompt_id" uuid NOT NULL,
	"prompt_version_id" uuid,
	"group_id" uuid NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"status" text DEFAULT 'not-run' NOT NULL,
	"input" text NOT NULL,
	"expected_output" text,
	"actual_output" text,
	"error" text,
	"validation_method" text DEFAULT 'manual' NOT NULL,
	"validation_rules" text,
	"ai_validation_prompt" text,
	"review_notes" text,
	"latency" integer,
	"tokens" integer,
	"cost" real,
	"use_database" boolean DEFAULT false NOT NULL,
	"database_id" uuid,
	"embedding_model" text,
	"num_results" integer DEFAULT 3,
	"similarity_threshold" real DEFAULT 0.5,
	"executed_at" timestamp with time zone,
	"execution_config" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "test_case_groups" ADD CONSTRAINT "test_case_groups_prompt_id_prompts_id_fk" FOREIGN KEY ("prompt_id") REFERENCES "public"."prompts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_cases" ADD CONSTRAINT "test_cases_prompt_id_prompts_id_fk" FOREIGN KEY ("prompt_id") REFERENCES "public"."prompts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_cases" ADD CONSTRAINT "test_cases_prompt_version_id_prompt_versions_id_fk" FOREIGN KEY ("prompt_version_id") REFERENCES "public"."prompt_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_cases" ADD CONSTRAINT "test_cases_group_id_test_case_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."test_case_groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_cases" ADD CONSTRAINT "test_cases_database_id_vector_databases_id_fk" FOREIGN KEY ("database_id") REFERENCES "public"."vector_databases"("id") ON DELETE no action ON UPDATE no action;