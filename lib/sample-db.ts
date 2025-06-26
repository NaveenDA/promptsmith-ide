export const sample_databases = [
	{
		name: "Website Index",
		type: "chroma",
		description:
			"Semantic search index for website content and documentation",
		documentCount: 15234,
		lastUpdated: "2024-03-15",
		status: "active",
	},
	{
		name: "Product Index",
		type: "chroma",
		description: "Product catalog with semantic search capabilities",
		documentCount: 8756,
		lastUpdated: "2024-03-14",
		status: "indexing",
	},
	{
		name: "Customer Support",
		type: "pinecone",
		description: "Support tickets and knowledge base articles",
		documentCount: 25689,
		lastUpdated: "2024-03-13",
		status: "active",
	},
	{
		name: "Scientific Research",
		type: "pgvector",
		description: "Research papers and academic publications",
		documentCount: 42156,
		lastUpdated: "2024-03-12",
		status: "active",
	},
	{
		name: "Financial Data",
		type: "qdrant",
		description: "Financial reports and market analysis",
		documentCount: 12567,
		lastUpdated: "2024-03-10",
		status: "error",
	},
	//
	{
		name: "Product Index A very long name that should be truncated",
		type: "chroma",
		description: "Product catalog with semantic search capabilities",
		documentCount: 8756,
		lastUpdated: "2024-03-14",
		status: "indexing",
	},
];

// prompts
export const sample_prompts = [
    {
        id: "customer-support-1",
        name: "Customer Support Assistant",
        lastModified: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        status: "ready",
        testStats: { passed: 8, total: 10 },
        securityIssues: 0,
        fullPrompt: `
        You are a customer support assistant.
        You are given a question and a database of product information.
        You need to answer the question based on the product information.
        Please provide concise answers.
        `,
    },
    {
        id: "code-review-2",
        name: "Code Review Helper",
        lastModified: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        status: "needs-review",
        testStats: { passed: 4, total: 6 },
        securityIssues: 1,
        fullPrompt: `
        You are a code review helper.
        You are given a code snippet and a database of code examples.
        You need to review the code snippet and provide a code review.
        Please provide concise answers.
        `,
    },
    {
        id: "course-recommendation-3",
        name: "Course Recommendation",
        lastModified: new Date(),
        status: "draft",
        testStats: { passed: 2, total: 5 },
        securityIssues: 0,
        fullPrompt: `
    You are a helpful chatbot called NOVA in the CADD Center's Website.  \nYou\
  \ are designed to help students to find the best courses, or any other information\
  \ about CADD Center.  \nYour answers are based on the context given to you, the\
  \ context is from the website  \nIf you are not sure about the answer, you can ask\
  \ more questions to get more information.,  \nIf the user question is not relevant\
  \ to the context, you can ask the user to ask relevant questions. like \"What is\
  \ the course you are looking for?\"  \nDon't say anything that is not related to\
  \ the context or not related to CADD Center.  \nIf the user message is only \"Course\
  \ Details\", you can ask the user to provide more information like \"What is the\
  \ course you are looking for?\"  \nReturn the answer in the following format: {\"\
  message\": \"your_response in markdown format\", \"suggested_questions\": [\"question1\"\
  , \"question2\"]}.  \nIf the user is requesting a specific course, includes these\
  \ response in suggested_questions\nEnquire Now, Find Near Center, <Optional if user\
  \ is taking about course>Learn More About this course and <Suggested Questions 1>,\
  \ <Suggested Question 2>, <Suggested Question 3>  \nAdd End Conversation Whenever\
  \ you feel it is necessary.  \nGenerate 5 suggested questions based on the context.\
  \  \nRespond with only valid JSON object. And Message inside the JSON object should\
  \ be in markdown format.
        `,
    },
]