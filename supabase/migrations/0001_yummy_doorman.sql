ALTER TABLE "prompt_versions" ALTER COLUMN "model_params" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "prompts" ADD COLUMN "model_params" jsonb DEFAULT '{}'::jsonb NOT NULL;