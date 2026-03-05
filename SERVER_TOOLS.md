# Server-Side Tools Usage Guide

This guide covers the configuration and usage of server-side tools for the four major platforms: Anthropic, Google, xAI, and OpenAI.

## 📋 Table of Contents

- [Feature Overview](#feature-overview)
- [Anthropic Tools](#anthropic-tools)
- [Google Tools](#google-tools)
- [xAI Tools](#xai-tools)
- [OpenAI Tools](#openai-tools)
- [Tool Comparison](#tool-comparison)
- [Use Cases](#use-cases)
- [Troubleshooting](#troubleshooting)

## 🎯 Feature Overview

### What are Server-Side Tools?

Server-side tools are functions executed by AI providers on their servers, eliminating the need for you to implement tool logic yourself. Advantages:

- ✅ **Zero Code Implementation** - Just configure and use
- ✅ **Official Support** - Stable, reliable, and continuously updated
- ✅ **Secure Sandbox** - Execution in isolated environments
- ✅ **Automatic Optimization** - Providers handle performance optimization

### Implemented Features

| Feature | Anthropic | Google | xAI | OpenAI | Description |
|---------|-----------|--------|-----|--------|-------------|
| **Cost Optimization** | ✅ Cache Control | ✅ | ❌ | ❌ | Reduce 50%+ API costs |
| **Web Search** | ✅ Web Search | ✅ Google Search | ✅ Web Search | ✅ Web Search | Real-time internet search |
| **Web Fetch** | ✅ Web Fetch | ✅ URL Context | ❌ | ❌ | Fetch web content |
| **Code Execution** | ✅ Python+Bash | ✅ Python | ✅ Python | ✅ Python | Sandbox code execution |
| **Social Search** | ❌ | ❌ | ✅ X Search | ❌ | Search Twitter/X |
| **Map Services** | ❌ | ✅ Maps | ❌ | ❌ | Geographic information |
| **File Search** | ❌ | ✅ File Search | ✅ File Search | ✅ File Search | Search uploaded files |
| **Image Generation** | ❌ | ❌ | ❌ | ✅ Image Gen | AI image generation |
| **MCP Protocol** | ❌ | ❌ | ❌ | ✅ MCP | Remote tool invocation |
| **Citations** | ✅ Citations | ❌ | ❌ | ❌ | Source attribution |
| **Context Management** | ✅ | ❌ | ❌ | ❌ | Auto history cleanup |
| **Tool Streaming** | ✅ | ❌ | ❌ | ❌ | Real-time progress |

---

## 🤖 Anthropic Tools

### 1. Cache Control - Cost Optimization ⭐

**Function**: Automatically cache system messages and tool definitions to significantly reduce API costs.

**Configuration**:
```bash
ANTHROPIC_ENABLE_CACHE_CONTROL=true  # Highly recommended to enable
```

**Cost Savings Example**:
```
1st Request:
- Input: 10,000 tokens
- Output: 1,000 tokens
- Cost: $0.30

2nd Request (with cache):
- Input: 2,000 tokens (new content)
- Cache: 8,000 tokens (10% cost)
- Output: 1,000 tokens
- Cost: $0.14 (53% savings)
```

**Notes**:
- Takes effect automatically, no additional configuration needed
- System message and last tool are marked as cacheable
- Cache validity: 5 minutes
- Applies to all Claude models

---

### 2. Web Search - Internet Search

**Function**: Real-time internet search to retrieve latest information.

**Configuration**:
```bash
ANTHROPIC_ENABLE_WEB_SEARCH=true
ANTHROPIC_WEB_SEARCH_MAX_USES=5                    # Max searches per conversation
ANTHROPIC_WEB_SEARCH_ALLOWED_DOMAINS=[]            # Allowed domains (empty=all)
ANTHROPIC_WEB_SEARCH_BLOCKED_DOMAINS=[]            # Blocked domains
ANTHROPIC_WEB_SEARCH_USER_LOCATION="Beijing, China"  # User location (localized results)
```

**Usage Example**:
```
User: Who won the 2024 Nobel Prize in Physics?

Claude will:
1. Automatically invoke web_search tool
2. Search for latest information
3. Return results with source links
```

**Supported Location Formats**:
- City+Country: `"San Francisco, USA"`
- Coordinates: `"37.7749,-122.4194"`

---

### 3. Web Fetch - Web Content Retrieval

**Function**: Fetch content from specified web pages, supports Citations.

**Configuration**:
```bash
ANTHROPIC_ENABLE_WEB_FETCH=true
ANTHROPIC_WEB_FETCH_MAX_USES=5                     # Max fetches per conversation
ANTHROPIC_WEB_FETCH_ALLOWED_DOMAINS=["wikipedia.org"]  # Allowed domains
ANTHROPIC_WEB_FETCH_BLOCKED_DOMAINS=["ads.com"]    # Blocked domains
ANTHROPIC_WEB_FETCH_ENABLE_CITATIONS=true          # Enable citations ⭐
ANTHROPIC_WEB_FETCH_MAX_CONTENT_TOKENS=4000        # Max content length
```

**Citations Feature Example**:
```
User: Fetch https://wikipedia.org/wiki/Python_(programming_language)

Claude will return:
Python was created by Guido van Rossum[1], first released in 1991[2].
It emphasizes code readability using significant indentation[3].

Citations:
[1] Introduction, paragraph 1
[2] History section, line 5
[3] Design Philosophy, paragraph 2
```

---

### 4. Code Execution - Code Execution

**Function**: Execute Python and Bash code in a sandbox environment.

**Configuration**:
```bash
ANTHROPIC_ENABLE_CODE_EXECUTION=true
```

**Supported Languages**:
- Python 3.x
- Bash

**Usage Example**:
```
User: Help me analyze this data: [1, 5, 3, 9, 2, 7, 4, 6, 8]

Claude will:
1. Write Python code to calculate statistics
2. Execute code in sandbox
3. Return results (mean, median, standard deviation, etc.)
4. May generate visualization charts
```

**Security Features**:
- Completely isolated sandbox environment
- No network access
- Execution timeout limits
- File system isolation

**Limitations**:
- No network-requiring operations
- Cannot install additional packages (common libraries pre-installed)
- Execution time limit ~60 seconds

---

### 5. Tool Streaming - Real-time Tool Progress

**Function**: Display tool execution progress in real-time.

**Configuration**:
```bash
ANTHROPIC_ENABLE_TOOL_STREAMING=true  # Enabled by default
```

**User Experience Comparison**:

**When Disabled**:
```
User: Search for latest AI news
[Waiting 5 seconds...]
Claude: Based on search results, ...
```

**When Enabled**:
```
User: Search for latest AI news
tool call start: `web_search`
[Real-time] Searching...
[Real-time] Found 10 results...
finish tools: `web_search`
Claude: Based on search results, ...
```

---

### 6. Context Management - Context Management

**Function**: Automatically clean up historical tool calls to avoid excessive context length.

**Configuration**:
```bash
ANTHROPIC_ENABLE_CONTEXT_MANAGEMENT=true
ANTHROPIC_CONTEXT_CLEAR_TRIGGER="auto"             # auto | manual
ANTHROPIC_CONTEXT_KEEP_RECENT=5                    # Keep recent 5 tool calls
ANTHROPIC_CONTEXT_CLEAR_AT_LEAST=2                 # Clear at least 2000 tokens
ANTHROPIC_CONTEXT_CLEAR_TOOL_INPUTS=false          # Whether to clear tool inputs
ANTHROPIC_CONTEXT_EXCLUDE_TOOLS=[]                 # Tools to exclude from cleanup
```

**How It Works**:
- `auto` mode: Automatically triggers when tool calls exceed `KEEP_RECENT + 2`
- `manual` mode: No automatic trigger, requires manual control
- Retains the most recent N tool calls
- Clears at least N thousand tokens

**Use Cases**:
- Long conversations (10+ rounds)
- Frequent tool usage (3+ tools per round)
- Encountering "context too long" errors

---

### 7. Thinking Cleanup - Thinking Content Cleanup

**Function**: Clean up reasoning model thinking content (for Claude 3.7 Sonnet).

**Configuration**:
```bash
ANTHROPIC_ENABLE_THINKING_CLEANUP=false            # Disabled by default
ANTHROPIC_THINKING_KEEP_RECENT=3                   # Keep recent 3 thinking rounds
```

**Applicable Models**:
- Claude 3.7 Sonnet
- Other models with thinking feature enabled

---

### 8. Structured Output Mode - Structured Output

**Function**: Force Claude to output structured data conforming to JSON Schema.

**Configuration**:
```bash
ANTHROPIC_STRUCTURED_OUTPUT_MODE="auto"  # auto | outputFormat | tool
```

**Mode Description**:
- `auto`: AI SDK auto-selects (recommended)
- `outputFormat`: Use output format (flexible)
- `tool`: Use tool mode (strict)

**Use Cases**:
- Require strict JSON output
- Format tool returned data
- Reduce JSON parsing errors

---

## 🌐 Google Tools

### 1. Google Search - Google Search

**Function**: Use Google search engine to retrieve real-time information. Supports web search, image search, and time range filtering.

**Basic Configuration**:
```bash
USE_GOOGLE_BUILDIN=["googleSearch"]
```

**Advanced Configuration**:
```bash
# Enable web search (default: true)
GOOGLE_SEARCH_ENABLE_WEB_SEARCH=true

# Enable image search for image-capable models (default: false)
GOOGLE_SEARCH_ENABLE_IMAGE_SEARCH=false

# Time range filter (ISO 8601 format)
GOOGLE_SEARCH_TIME_RANGE_FILTER='{"startTime": "2025-01-01T00:00:00Z", "endTime": "2025-12-31T23:59:59Z"}'
```

**Features**:
- **Web Search**: Search the web for real-time information
- **Image Search**: Search and generate images based on search results (requires `gemini-3.1-flash-image-preview` or similar models)
- **Time Range Filter**: Restrict search results to a specific time period
- **Grounding**: Automatic result verification with source attribution

**Use Cases**:
- Real-time news and current events
- Image search and generation with context
- Historical data within specific time ranges
- Location-based information queries

**Note**:
- Requires Gemini 2.0+ models
- Image search only works with image-capable models like `gemini-3.1-flash-image-preview`
- Time range filter helps narrow down results to specific periods

---

### 2. URL Context - Web Context

**Function**: Fetch content from URLs and add to context.

**Configuration**:
```bash
USE_GOOGLE_BUILDIN=["urlContext"]
```

**Usage Example**:
```
User: What does this article discuss? https://example.com/article.html

Gemini will:
1. Automatically fetch web content
2. Analyze the article
3. Answer questions
```

---

### 3. Code Execution - Code Execution

**Function**: Execute Python code (Python only).

**Configuration**:
```bash
USE_GOOGLE_BUILDIN=["codeExecution"]
```

**Limitations**:
- Python only
- No Bash support
- Cannot be used simultaneously with Google Maps

---

### 4. Google Maps - Map Services

**Function**: Provide geographic information and map data.

**Configuration**:
```bash
USE_GOOGLE_BUILDIN=["googleMaps"]
GOOGLE_RETRIEVAL_CONFIG='{"latLng":{"latitude":37.7749,"longitude":-122.4194}}'
GOOGLE_MAPS_MODEL="gemini-2.5-flash"  # Maps-specific model
```

**Requirements**:
- Requires Gemini 2.x models
- Cannot be used simultaneously with Code Execution
- User location must be provided

**Usage Example**:
```
User: What are some good restaurants nearby?

Gemini will:
1. Use configured location information
2. Search for nearby restaurants
3. Return recommendation list
```

---

### 5. File Search - File Search

**Function**: Search content in files uploaded to Google.

**Configuration**:
```bash
USE_GOOGLE_BUILDIN=["fileSearch"]
GOOGLE_FILE_SEARCH_STORES=["projects/xxx/locations/us/ragCorpora/xxx/ragFiles/xxx"]
GOOGLE_FILE_SEARCH_TOP_K=10                        # Return top 10 results
GOOGLE_FILE_SEARCH_METADATA_FILTER='{"key":"value"}'  # Metadata filter
```

**Usage Flow**:
1. Upload files to Google AI Studio
2. Get file store ID
3. Configure in environment variables
4. Automatically search file content in conversations

---

### 6. Enterprise Web Search - Enterprise Web Search

**Function**: Enterprise-level web search functionality.

**Configuration**:
```bash
USE_GOOGLE_BUILDIN=["enterpriseWebSearch"]
```

---

## 🚀 xAI Tools

### 1. Web Search - Web Search

**Function**: Use Grok's web search functionality.

**Configuration**:
```bash
XAI_ENABLE_WEB_SEARCH=true
XAI_WEB_SEARCH_ALLOWED_DOMAINS=[]                  # Allowed domains (max 5)
XAI_WEB_SEARCH_EXCLUDED_DOMAINS=[]                 # Excluded domains (max 5)
XAI_WEB_SEARCH_IMAGE_UNDERSTANDING=false           # Understand images in search results
```

**Note**:
- Only supports Responses API (`xai.responses`)
- Chat API uses `searchParameters` instead

---

### 2. X Search - Social Search

**Function**: Search Twitter/X content.

**Configuration**:
```bash
XAI_ENABLE_X_SEARCH=true
XAI_X_SEARCH_ALLOWED_HANDLES=["elonmusk"]          # Allowed accounts (max 10)
XAI_X_SEARCH_EXCLUDED_HANDLES=[]                   # Excluded accounts (max 10)
XAI_X_SEARCH_IMAGE_UNDERSTANDING=false             # Understand images in tweets
XAI_X_SEARCH_VIDEO_UNDERSTANDING=false             # Understand videos in tweets
```

**Usage Example**:
```
User: What has Elon Musk been saying recently?

Grok will:
1. Search @elonmusk's latest tweets
2. Analyze content
3. Summarize key points
```

---

### 3. Code Execution - Code Execution

**Function**: Execute Python code.

**Configuration**:
```bash
XAI_ENABLE_CODE_EXECUTION=true
```

---

### 4. File Search - File Search

**Function**: Search content in files uploaded to xAI vector stores (collections).

**Configuration**:
```bash
XAI_ENABLE_FILE_SEARCH=true
XAI_FILE_SEARCH_VECTOR_STORES=["collection_xxx"]  # Vector store IDs (required)
XAI_FILE_SEARCH_MAX_RESULTS=10                     # Maximum results returned
```

**Usage Flow**:
1. Create a collection at [xAI Console](https://console.x.ai/)
2. Upload files to the collection
3. Get collection ID (format: `collection_xxx`)
4. Configure in environment variables
5. Automatically search file content in conversations

**Usage Example**:
```
User: Search for content about API authentication in my documents

Grok will:
1. Search in configured vector stores
2. Return most relevant document snippets
3. Include file names and relevance scores
```

**Note**:
- Only supports Responses API (`xai.responses`)
- Requires grok-4 or later models
- See [xAI Collections Guide](https://docs.x.ai/docs/guides/using-collections/api)

---

## 🤖 OpenAI Tools

**Important Notice**: OpenAI server-side tools only support **Responses API**, not Chat Completions API.

### API Selection Guide

OpenAI provides two APIs:
- **Chat Completions API** (`openai`): Standard chat API, does not support server-side tools
- **Responses API** (`openai.responses`): Next-generation API, supports all server-side tools

**Configuration Example**:
```bash
# Use Responses API (supports server-side tools)
OPENAI_API_KEY="sk-xxx"
OPENAI_CHAT_MODEL="gpt-5.1"  # Or other supported models
AI_CHAT_PROVIDER="openai"
```

---

### 1. Web Search - Web Search

**Function**: Real-time internet search to retrieve latest information with citations.

**Configuration**:
```bash
OPENAI_ENABLE_WEB_SEARCH=true
OPENAI_WEB_SEARCH_EXTERNAL_ACCESS=true                 # true=real-time fetch, false=use cache
OPENAI_WEB_SEARCH_ALLOWED_DOMAINS=["wikipedia.org"]    # Allowed domain list (optional)
OPENAI_WEB_SEARCH_CONTEXT_SIZE="medium"                # Search context size: low | medium | high
OPENAI_WEB_SEARCH_USER_LOCATION="Beijing, China"       # User location (localized results)
```

**Supported Location Formats**:
- City+Country: `"San Francisco, USA"`
- Country Only: `"Japan"`

**Note**: Does not support coordinate format (OpenAI API limitation)

**Usage Example**:
```
User: What are the latest AI technology trends in 2024?

GPT will:
1. Automatically invoke web_search tool
2. Search for latest information
3. Return results with source links
```

---

### 2. Code Interpreter - Python Code Execution

**Function**: Execute Python code in a sandbox environment.

**Configuration**:
```bash
OPENAI_ENABLE_CODE_INTERPRETER=true
OPENAI_CODE_INTERPRETER_CONTAINER=""  # Container ID (optional)
```

**Supported Languages**:
- Python 3.x (Python only)

**Usage Example**:
```
User: Help me calculate the first 20 Fibonacci numbers

GPT will:
1. Write Python code
2. Execute in sandbox
3. Return calculation results
```

**Security Features**:
- Completely isolated sandbox environment
- No external network access
- Execution timeout limits
- File system isolation

---

### 3. File Search - File Vector Search

**Function**: Semantic search in uploaded files.

**Configuration**:
```bash
OPENAI_ENABLE_FILE_SEARCH=true
OPENAI_FILE_SEARCH_VECTOR_STORES=["vs-xxx","vs-yyy"]   # Vector store ID list (required)
OPENAI_FILE_SEARCH_MAX_RESULTS=10                       # Maximum results returned
OPENAI_FILE_SEARCH_SCORE_THRESHOLD=0.0                  # Relevance threshold (0-1), higher is stricter
```

**Usage Flow**:
1. Upload files to OpenAI and create Vector Store
2. Get Vector Store ID (format: `vs-xxx`)
3. Configure in environment variables
4. Automatically search file content in conversations

**Usage Example**:
```
User: Search for content about API authentication in my documents

GPT will:
1. Search in configured Vector Stores
2. Return most relevant document snippets
3. Sort by relevance
```

**Parameter Details**:
- `maxNumResults`: Control number of results returned (1-50)
- `scoreThreshold`: Filter low relevance results (0.0-1.0)
  - 0.0: Return all results
  - 0.5: Medium relevance
  - 0.8: High relevance

---

### 4. Image Generation - Image Generation (GPT-5.1+)

**Function**: Generate images using text prompts, supports advanced control options.

**Configuration**:
```bash
OPENAI_ENABLE_IMAGE_GENERATION=true
OPENAI_IMAGE_MODEL="gpt-image-1"                        # Image generation model
OPENAI_IMAGE_SIZE="auto"                                # Image size: auto | 1024x1024 | 1024x1536 | 1536x1024
OPENAI_IMAGE_QUALITY="auto"                             # Quality: auto | low | medium | high
OPENAI_IMAGE_BACKGROUND="auto"                          # Background: auto | opaque | transparent
OPENAI_IMAGE_OUTPUT_FORMAT="png"                        # Output format: png | jpeg | webp
OPENAI_IMAGE_OUTPUT_COMPRESSION=100                     # Compression level (0-100)
OPENAI_IMAGE_INPUT_FIDELITY="low"                       # Input fidelity: low | high
OPENAI_IMAGE_PARTIAL_IMAGES=0                           # Partial images in streaming mode (0-3)
```

**Usage Example**:
```
User: Generate a cyberpunk-style city nightscape

GPT will:
1. Optimize text prompt
2. Invoke image_generation tool
3. Return generated image
```

**Parameter Details**:
- `size`: Image dimensions
  - `auto`: AI automatically selects best size
  - `1024x1024`: Square
  - `1024x1536`: Portrait
  - `1536x1024`: Landscape

- `quality`: Quality level
  - `auto`: Auto-balance quality and speed
  - `low`: Quick generation
  - `medium`: Standard quality
  - `high`: Best quality (slower)

- `background`: Background type
  - `auto`: Auto-decide
  - `opaque`: Opaque background
  - `transparent`: Transparent background (PNG)

- `partialImages`: Streaming mode
  - `0`: No streaming (wait for complete image)
  - `1-3`: Return partial images during generation

---

### 5. MCP - Model Context Protocol

**Function**: Connect to remote MCP servers or service connectors to invoke external tools.

**Configuration**:
```bash
OPENAI_ENABLE_MCP=true
OPENAI_MCP_SERVER_LABEL="my-server"                    # Server label (required)
OPENAI_MCP_SERVER_URL="https://mcp.example.com"        # Server URL (choose one with connectorId)
OPENAI_MCP_CONNECTOR_ID=""                              # Connector ID (choose one with serverUrl)
OPENAI_MCP_SERVER_DESCRIPTION="My MCP Server"          # Server description (optional)
OPENAI_MCP_ALLOWED_TOOLS=["tool1","tool2"]             # Allowed tools list
OPENAI_MCP_ALLOWED_TOOLS_READ_ONLY=false                # Allow read-only tools only
OPENAI_MCP_AUTHORIZATION="Bearer xxx"                   # OAuth access token
OPENAI_MCP_HEADERS='{"X-Custom":"value"}'               # Custom HTTP headers (JSON format)
OPENAI_MCP_REQUIRE_APPROVAL="never"                     # Approval policy: always | never
OPENAI_MCP_APPROVAL_TOOL_NAMES=[]                       # Tools requiring approval (when requireApproval not always)
```

**Parameter Details**:

**Required Parameters**:
- `serverLabel`: Label identifying the MCP server
- `serverUrl` or `connectorId`: One must be provided

**Optional Parameters**:
- `serverDescription`: Server function description, helps AI understand when to use
- `allowedTools`: Limit available tools
  - Array format: `["tool1", "tool2"]` - Allow specific tools
  - Object format: `{"readOnly": true, "toolNames": ["tool1"]}` - Read-only tools only

- `authorization`: OAuth token for server authentication
- `headers`: Custom HTTP headers for additional authentication or configuration
- `requireApproval`: Tool execution approval
  - `always`: All tools require approval
  - `never`: No approval required (default)
  - Object format: Specify which tools don't need approval

**Use Cases**:
- Connect to internal API services
- Use third-party MCP services
- Extend AI capabilities to custom tools

---

## 📊 Tool Comparison

### Web Search Comparison

| Feature | Anthropic | Google | xAI | OpenAI |
|---------|-----------|--------|-----|--------|
| Search Engine | General | Google | General | General |
| Domain Filter | ✅ Unlimited | ❌ | ✅ Max 5 | ✅ Unlimited |
| Location | ✅ City+Coords | ✅ | ❌ | ✅ City Only |
| Image Understanding | ❌ | ❌ | ✅ | ❌ |
| Social Search | ❌ | ❌ | ✅ X/Twitter | ❌ |
| Citations | ✅ | ❌ | ❌ | ✅ |

### Code Execution Comparison

| Feature | Anthropic | Google | xAI | OpenAI |
|---------|-----------|--------|-----|--------|
| Python | ✅ | ✅ | ✅ | ✅ |
| Bash | ✅ | ❌ | ❌ | ❌ |
| File Operations | ✅ | ✅ | ✅ | ✅ |
| Network Access | ❌ | ❌ | ❌ | ❌ |
| Sandbox Isolation | ✅ | ✅ | ✅ | ✅ |

### File Search Comparison

| Feature | Google | xAI | OpenAI |
|---------|--------|-----|--------|
| Vector Storage | ✅ | ✅ | ✅ |
| Metadata Filter | ✅ | ❌ | ❌ |
| Relevance Threshold | ❌ | ❌ | ✅ |
| Multi-Store Support | ✅ | ✅ | ✅ |
| Max Results Config | ✅ | ✅ | ✅ |

---

## 💡 Use Cases

### Scenario 1: Research Assistant
```bash
# Anthropic Configuration
ANTHROPIC_ENABLE_CACHE_CONTROL=true
ANTHROPIC_ENABLE_WEB_FETCH=true
ANTHROPIC_WEB_FETCH_ENABLE_CITATIONS=true
ANTHROPIC_ENABLE_WEB_SEARCH=true
ANTHROPIC_ENABLE_CONTEXT_MANAGEMENT=true
```

**Features**: Search materials + Fetch articles + Citation sources + Long conversation support

---

### Scenario 2: Data Analysis
```bash
# Anthropic Configuration
ANTHROPIC_ENABLE_CODE_EXECUTION=true
ANTHROPIC_ENABLE_CACHE_CONTROL=true
```

**Features**: Python data analysis + Visualization + Cost optimization

---

### Scenario 3: Real-Time News Tracking
```bash
# xAI Configuration
XAI_ENABLE_WEB_SEARCH=true
XAI_ENABLE_X_SEARCH=true
XAI_X_SEARCH_ALLOWED_HANDLES=["reuters","BBCBreaking"]
```

**Features**: Web news + Twitter real-time updates

---

### Scenario 4: Local Service Recommendations
```bash
# Google Configuration
USE_GOOGLE_BUILDIN=["googleMaps","googleSearch"]
GOOGLE_RETRIEVAL_CONFIG='{"latLng":{"latitude":37.7749,"longitude":-122.4194}}'
```

**Features**: Location-based recommendations + Google search

---

### Scenario 5: AI Image Generation Assistant
```bash
# OpenAI Configuration
OPENAI_ENABLE_IMAGE_GENERATION=true
OPENAI_IMAGE_QUALITY="high"
OPENAI_IMAGE_SIZE="1024x1024"
OPENAI_IMAGE_BACKGROUND="transparent"
```

**Features**: High-quality image generation + Transparent background support

---

### Scenario 6: Enterprise Document Search
```bash
# OpenAI Configuration
OPENAI_ENABLE_FILE_SEARCH=true
OPENAI_FILE_SEARCH_VECTOR_STORES=["vs-xxx","vs-yyy"]
OPENAI_FILE_SEARCH_SCORE_THRESHOLD=0.7
OPENAI_ENABLE_WEB_SEARCH=true
```

**Features**: Internal document search + External information supplementation

---

## 🔧 Troubleshooting

### 1. Cache Not Working

**Symptom**: Costs have not decreased

**Check**:
- Look for `cache_read_input_tokens` > 0 in logs
- Confirm `ANTHROPIC_ENABLE_CACHE_CONTROL=true`

**Causes**:
- System message changes each time
- Tools list differs each time
- Model was switched
- Cache expired (5 minutes)

---

### 2. Tools Not Being Invoked

**Symptom**: Tools configured but not used

**Check**:
```bash
# View logs
[warpLLMParams] Anthropic server-side tools enabled: web_fetch, web_search
[warpLLMParams] activeTools: web_fetch,web_search
```

**Causes**:
- Model version not supported (requires Claude 3.5+)
- Tool configuration not enabled
- User question doesn't require tools

---

### 3. Parameter Format Error

**Symptom**: `invalid anthropic provider options`

**Solution**:
- Ensure using latest code
- Context Management parameters now use object format
- Check configuration value types are correct

---

### 4. Tool Conflicts

**Symptom**: Certain tool combinations error

**Known Conflicts**:
- Google: Maps + Code Execution cannot be used simultaneously
- xAI: Only Responses API supports native tools
- OpenAI: Server-side tools only support Responses API (not Chat Completions API)

**Solution**:
- Choose one of the tools
- Or use different API

---

### 6. OpenAI Vector Store Not Found

**Symptom**: `Vector Store not found: vs-xxx`

**Solution**:
- Confirm Vector Store ID is correct
- Check if files have been uploaded
- Confirm API Key has permission to access the Vector Store

---

### 7. MCP Connection Failed

**Symptom**: `MCP server connection failed`

**Check**:
- Confirm `OPENAI_MCP_SERVER_URL` or `OPENAI_MCP_CONNECTOR_ID` is correct
- Check if `OPENAI_MCP_SERVER_LABEL` is set
- Verify network connection and firewall settings
- Confirm authorization token is valid (if required)

---

### 5. Output Format Error

**Symptom**: `Cannot read properties of undefined (reading 'some')`

**Solution**:
- Fixed, use latest code
- Provider tool output format differs from custom tools

---

## 📝 Complete Configuration Examples

### Anthropic Complete Configuration
```bash
# Basics
ANTHROPIC_API_KEY="sk-ant-xxx"
ANTHROPIC_CHAT_MODEL="claude-3-5-sonnet-20241022"

# Cost Optimization
ANTHROPIC_ENABLE_CACHE_CONTROL=true

# Web Tools
ANTHROPIC_ENABLE_WEB_FETCH=true
ANTHROPIC_WEB_FETCH_MAX_USES=5
ANTHROPIC_WEB_FETCH_ENABLE_CITATIONS=true

ANTHROPIC_ENABLE_WEB_SEARCH=true
ANTHROPIC_WEB_SEARCH_MAX_USES=5
ANTHROPIC_WEB_SEARCH_USER_LOCATION="Beijing, China"

# Code Execution
ANTHROPIC_ENABLE_CODE_EXECUTION=true

# Advanced Features
ANTHROPIC_ENABLE_TOOL_STREAMING=true
ANTHROPIC_ENABLE_CONTEXT_MANAGEMENT=true
ANTHROPIC_CONTEXT_KEEP_RECENT=5
ANTHROPIC_STRUCTURED_OUTPUT_MODE="auto"
```

### Google Complete Configuration
```bash
GOOGLE_GENERATIVE_AI_API_KEY="xxx"
USE_GOOGLE_BUILDIN=["googleSearch","codeExecution","urlContext"]
SEARCH_GROUNDING=true
```

### xAI Complete Configuration
```bash
XAI_API_KEY="xxx"
XAI_ENABLE_WEB_SEARCH=true
XAI_ENABLE_X_SEARCH=true
XAI_X_SEARCH_ALLOWED_HANDLES=["elonmusk"]
XAI_ENABLE_CODE_EXECUTION=true
XAI_ENABLE_FILE_SEARCH=true
XAI_FILE_SEARCH_VECTOR_STORES=["collection_xxx"]
XAI_FILE_SEARCH_MAX_RESULTS=10
```

---

### OpenAI Complete Configuration
```bash
# Basics
OPENAI_API_KEY="sk-xxx"
OPENAI_CHAT_MODEL="gpt-5.1"  # Use models supporting Responses API

# Web Search
OPENAI_ENABLE_WEB_SEARCH=true
OPENAI_WEB_SEARCH_EXTERNAL_ACCESS=true
OPENAI_WEB_SEARCH_CONTEXT_SIZE="medium"
OPENAI_WEB_SEARCH_USER_LOCATION="Beijing, China"

# Code Execution
OPENAI_ENABLE_CODE_INTERPRETER=true

# File Search
OPENAI_ENABLE_FILE_SEARCH=true
OPENAI_FILE_SEARCH_VECTOR_STORES=["vs-xxx"]
OPENAI_FILE_SEARCH_MAX_RESULTS=10
OPENAI_FILE_SEARCH_SCORE_THRESHOLD=0.7

# Image Generation
OPENAI_ENABLE_IMAGE_GENERATION=true
OPENAI_IMAGE_QUALITY="high"
OPENAI_IMAGE_SIZE="auto"
OPENAI_IMAGE_BACKGROUND="auto"

# MCP (Optional)
OPENAI_ENABLE_MCP=false
OPENAI_MCP_SERVER_LABEL="my-mcp-server"
OPENAI_MCP_SERVER_URL="https://mcp.example.com"
```

---

## 🆘 Getting Help

Encountering issues?

1. Check log output
2. Confirm model version
3. View [GitHub Issues](https://github.com/SzeMeng76/ChatGPT-Telegram-Workers/issues)
4. Read official documentation:
   - [Anthropic Documentation](https://docs.anthropic.com)
   - [OpenAI Documentation](https://platform.openai.com/docs)
   - [Google AI Documentation](https://ai.google.dev/docs)
   - [xAI Documentation](https://docs.x.ai)
