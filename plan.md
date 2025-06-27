## Prompts Management

// GET /api/prompts - List all prompts
// POST /api/prompts - Create new prompt
// GET /api/prompts/[id] - Get specific prompt
// PUT /api/prompts/[id] - Update prompt
// DELETE /api/prompts/[id] - Delete prompt
// POST /api/prompts/[id]/fork - Fork prompt
// GET /api/prompts/[id]/versions - Get version history


## Models Management

// GET /api/models/config - Get current model configuration
// PUT /api/models/config - Update model configuration
// GET /api/models/providers - List available providers
// GET /api/models/[provider]/models - List models for provider
// POST /api/keys - Store API key (encrypted)
// GET /api/keys - Get stored API keys
// DELETE /api/keys/[id] - Delete API key

## Security Analysis

// POST /api/security/analyze - Run security analysis
// GET /api/security/tests - Get security test templates
// POST /api/security/tests - Create custom security test
// GET /api/security/reports - Get security reports

## Vector Databases

// GET /api/databases - List vector databases
// POST /api/databases - Add new database connection
// PUT /api/databases/[id] - Update database config
// DELETE /api/databases/[id] - Remove database
// POST /api/databases/[id]/test - Test connection
// GET /api/databases/[id]/status - Get database status

## LLM Integration

// POST /api/llm/chat - Send prompt to LLM
// POST /api/llm/stream - Stream LLM response
// POST /api/llm/analyze - Analyze prompt (tokens, cost, etc.)
// GET /api/llm/providers - List available providers

## History & Analytics

// GET /api/history - Get prompt execution history
// GET /api/analytics/costs - Get cost analytics
// GET /api/analytics/performance - Get performance metrics
// GET /api/analytics/usage - Get usage statistics

## User Management

// POST /api/auth/login - User authentication
// POST /api/auth/logout - User logout
// GET /api/user/profile - Get user profile
// PUT /api/user/settings - Update user settings


