ALTER TABLE "test_case_groups" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "test_case_groups" CASCADE;--> statement-breakpoint
ALTER TABLE "test_cases" ADD COLUMN "category" text NOT NULL;--> statement-breakpoint
ALTER TABLE "test_cases" DROP COLUMN "group_id";