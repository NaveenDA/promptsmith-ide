CREATE TABLE "prompt_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prompt_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"content" text NOT NULL,
	"test_cases_total" integer DEFAULT 0 NOT NULL,
	"test_cases_passed" integer DEFAULT 0 NOT NULL,
	"security_issues_total" integer DEFAULT 0 NOT NULL,
	"security_issues_passed" integer DEFAULT 0 NOT NULL,
	"model_params" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "prompts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"tags" text[],
	"total_tokens" integer DEFAULT 0 NOT NULL,
	"total_costs" real DEFAULT 0 NOT NULL,
	"test_cases_total" integer DEFAULT 0 NOT NULL,
	"test_cases_passed" integer DEFAULT 0 NOT NULL,
	"security_issues_total" integer DEFAULT 0 NOT NULL,
	"security_issues_passed" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "prompt_versions" ADD CONSTRAINT "prompt_versions_prompt_id_prompts_id_fk" FOREIGN KEY ("prompt_id") REFERENCES "public"."prompts"("id") ON DELETE no action ON UPDATE no action;