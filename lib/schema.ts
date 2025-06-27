import {
	pgTable,
	uuid,
	text,
	integer,
	timestamp,
	real,
	jsonb,
} from "drizzle-orm/pg-core";

export const prompts = pgTable("prompts", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id").notNull(),
	title: text("title").notNull(),
	content: text("content").notNull(),
	tags: text("tags").array(),
	// total tokens
	totalTokens: integer("total_tokens").notNull().default(0),
	// total costs
	totalCosts: real("total_costs").notNull().default(0),
	//
	testCasesTotal: integer("test_cases_total").notNull().default(0),
	testCasesPassed: integer("test_cases_passed").notNull().default(0),
	securityIssuesTotal: integer("security_issues_total").notNull().default(0),
	securityIssuesPassed: integer("security_issues_passed").notNull().default(0),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const promptVersions = pgTable("prompt_versions", {
	id: uuid("id").primaryKey().defaultRandom(),
	promptId: uuid("prompt_id")
		.notNull()
		.references(() => prompts.id),
	version: integer("version").notNull(),
	content: text("content").notNull(),
	testCasesTotal: integer("test_cases_total").notNull().default(0),
	testCasesPassed: integer("test_cases_passed").notNull().default(0),
	securityIssuesTotal: integer("security_issues_total").notNull().default(0),
	securityIssuesPassed: integer("security_issues_passed").notNull().default(0),
	modelParams: jsonb("model_params").notNull().default({}),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
