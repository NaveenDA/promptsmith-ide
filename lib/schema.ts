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
	status: text("status").notNull().default("draft"), // draft, published, archived
	// total tokens
	totalTokens: integer("total_tokens").notNull().default(0),
	// total costs
	totalCosts: real("total_costs").notNull().default(0),
	//
	testCasesTotal: integer("test_cases_total").notNull().default(0),
	testCasesPassed: integer("test_cases_passed").notNull().default(0),
	securityIssuesTotal: integer("security_issues_total").notNull().default(0),
	securityIssuesPassed: integer("security_issues_passed").notNull().default(0),
	modelParams: jsonb("model_params").notNull().default({}),
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
	modelParams: jsonb("model_params").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const vectorDatabases = pgTable("vector_databases", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id").notNull(),
	type: text("type").notNull(), // pinecone, chroma, pgvector, qdrant, weaviate, milvus
	description: text("description"),
	collectionName: text("collection_name").notNull(),
	// Encrypted connection config - stores all connection details as encrypted JSON
	connectionConfig: text("connection_config").notNull(), // encrypted JSON string
	status: text("status").notNull().default("active"), // active, error, indexing
	documentCount: integer("document_count").default(0),
	lastConnected: timestamp("last_connected", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
