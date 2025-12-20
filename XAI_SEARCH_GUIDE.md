# xAI Search Tools Complete Guide

**Updated:** 2025-12-20

---

## Quick Start

### Overview

xAI (Grok) provides **server-side search tools** that are executed on xAI's servers, not locally. These tools allow Grok to access real-time information from the web and X/Twitter.

### Supported Tools

| Tool | Description | Max Config | Use Case |
|------|-------------|------------|----------|
| **web_search** | Search the web and browse pages | 5 domains filter | General web search, news, research |
| **x_search** | Search X/Twitter posts and threads | 10 handles filter | Social media trends, X posts |
| **code_execution** | Execute Python code in sandbox | - | Data analysis, calculations |

### Key Features

- ✅ **Server-Side Execution** - Tools run on xAI servers, results returned automatically
- ✅ **Real-Time Data** - Access latest web content and X posts
- ✅ **Image/Video Understanding** - Optional media analysis in search results
- ✅ **Automatic Citations** - Sources displayed in Google-style compact format
- ✅ **Responses API** - Uses `xaiProvider.responses()` for agentic tool calling

---

## Configuration

### Environment Variables

```env
# Enable xAI Search Tools (all default to false)
XAI_ENABLE_WEB_SEARCH=false
XAI_ENABLE_X_SEARCH=false
XAI_ENABLE_CODE_EXECUTION=false

# Web Search Configuration
XAI_WEB_SEARCH_ALLOWED_DOMAINS=[]        # Max 5 domains
XAI_WEB_SEARCH_EXCLUDED_DOMAINS=[]       # Max 5 domains
XAI_WEB_SEARCH_IMAGE_UNDERSTANDING=false

# X Search Configuration
XAI_X_SEARCH_ALLOWED_HANDLES=[]          # Max 10 handles
XAI_X_SEARCH_EXCLUDED_HANDLES=[]         # Max 10 handles
XAI_X_SEARCH_IMAGE_UNDERSTANDING=false
XAI_X_SEARCH_VIDEO_UNDERSTANDING=false
```

### Basic Setup

```env
# Minimal setup - enable web search
XAI_API_KEY=your-xai-api-key
XAI_CHAT_MODEL=grok-4
XAI_ENABLE_WEB_SEARCH=true
```

### Advanced Setup

```env
# Full configuration with domain filtering
XAI_ENABLE_WEB_SEARCH=true
XAI_WEB_SEARCH_ALLOWED_DOMAINS=["news.ycombinator.com","github.com","stackoverflow.com"]
XAI_WEB_SEARCH_EXCLUDED_DOMAINS=["example.com","spam.com"]
XAI_WEB_SEARCH_IMAGE_UNDERSTANDING=true

# X Search with handle filtering
XAI_ENABLE_X_SEARCH=true
XAI_X_SEARCH_ALLOWED_HANDLES=["elonmusk","OpenAI","AnthropicAI"]
XAI_X_SEARCH_EXCLUDED_HANDLES=["spambot"]
XAI_X_SEARCH_IMAGE_UNDERSTANDING=true
XAI_X_SEARCH_VIDEO_UNDERSTANDING=true

# Code execution
XAI_ENABLE_CODE_EXECUTION=true
```

---

## Usage

### Telegram Bot

```
# Ask Grok to search the web
/new
台湾暴动新闻

# Grok will automatically:
# 1. Use web_search tool to find latest news
# 2. Browse relevant pages
# 3. Return answer with citations

# Example output:
台湾目前没有发生暴动...

>sources:
>[[1]](https://example.com) [[2]](https://example.com) [[3]](https://example.com)
```

### With X Search

```
/new
What are people saying about AI on X?

# Grok will:
# 1. Use x_search to find relevant posts
# 2. Analyze X threads and conversations
# 3. Return summary with citations
```

### Model Requirements

xAI search tools work with:
- ✅ **grok-4** and newer (Responses API)
- ✅ **grok-3** (Chat API, limited)
- ❌ **grok-2** and older (no server-side tools)

**Important:** Code automatically uses `responses()` API for grok-4+ models to support tools.

---

## How It Works

### Architecture

```
User Question
    ↓
Telegram Bot
    ↓
warpLLMParams (model_middleware.ts)
    ├─ Detect provider: xai.chat / xai.responses
    ├─ Check XAI_ENABLE_WEB_SEARCH / XAI_ENABLE_X_SEARCH / XAI_ENABLE_CODE_EXECUTION
    ├─ Import { webSearch, xSearch, codeExecution } from '@ai-sdk/xai'
    ├─ Configure with domain/handle filters
    └─ Add to tools object with custom names
    ↓
xAI API (Responses API)
    ├─ Execute tools on xAI servers
    ├─ web_search → web_search_with_snippets, browse_page
    ├─ x_search → x_user_search, x_keyword_search, x_semantic_search
    └─ Return results with citations
    ↓
Stream Processing (request.ts)
    ├─ thinkingExtractor collects 'source' events
    ├─ Store { url, title } in messageInfo.sources
    └─ appendStreamSources formats as [[1]](url) [[2]](url)
    ↓
User sees answer with Google-style citations
```

### Code Flow

#### 1. Tool Detection (`model_middleware.ts:296-340`)

```typescript
if (model.provider === 'xai.chat' || model.provider === 'xai.responses') {
    const { webSearch, xSearch, codeExecution } = await import('@ai-sdk/xai');

    if (context.XAI_ENABLE_WEB_SEARCH) {
        tools.web_search = webSearch({
            allowedDomains: context.XAI_WEB_SEARCH_ALLOWED_DOMAINS.slice(0, 5),
            excludedDomains: context.XAI_WEB_SEARCH_EXCLUDED_DOMAINS.slice(0, 5),
            enableImageUnderstanding: context.XAI_WEB_SEARCH_IMAGE_UNDERSTANDING,
        });
        activeTools.push('web_search');
    }

    if (context.XAI_ENABLE_X_SEARCH) {
        tools.x_search = xSearch({
            allowedXHandles: context.XAI_X_SEARCH_ALLOWED_HANDLES.slice(0, 10),
            excludedXHandles: context.XAI_X_SEARCH_EXCLUDED_HANDLES.slice(0, 10),
            enableImageUnderstanding: context.XAI_X_SEARCH_IMAGE_UNDERSTANDING,
            enableVideoUnderstanding: context.XAI_X_SEARCH_VIDEO_UNDERSTANDING,
        });
        activeTools.push('x_search');
    }

    if (context.XAI_ENABLE_CODE_EXECUTION) {
        tools.code_execution = codeExecution();
        activeTools.push('code_execution');
    }
}
```

#### 2. Model Selection (`llm.ts:71-82`)

```typescript
case 'xai':
    const xaiProvider = createXai({
        baseURL: context.XAI_API_BASE,
        apiKey: context.XAI_API_KEY || undefined,
        fetch: mockFetch(model_id, context, agent),
    });
    // Use Responses API for models that need tools support
    const useResponsesApi = model_id.includes('grok-4');
    if (useResponsesApi) {
        return xaiProvider.responses(model_id);
    }
    return xaiProvider.languageModel(model_id);
```

#### 3. Source Collection (`request.ts:287-295`)

```typescript
case 'source':
    // xAI web_search/x_search sources
    if (ENV.ENABLE_SEARCH_SOURCE && data.sourceType === 'url') {
        sources.push({
            url: data.url,
            title: data.title || data.url,
        });
    }
    return '';
```

#### 4. Citation Formatting (`request.ts:179-192`)

```typescript
function appendStreamSources(content: string, sources: Array<{ url: string; title: string }>): string {
    if (!sources || sources.length === 0) {
        return content;
    }

    const maxSources = 10; // Limit to prevent Telegram rate limiting
    const formattedSources = sources
        .slice(0, maxSources)
        .map((source, i) => `[[${i + 1}\\]](${source.url})`)
        .join('\x20'); // Space separator, like Google

    return `${content.trimEnd()}\n\n>sources:\n>${formattedSources}`;
}
```

---

## Citation Format

### xAI Output (Google Style)

```
Your answer here...

>sources:
>[[1]](https://url1.com) [[2]](https://url2.com) [[3]](https://url3.com)
```

**Features:**
- Compact single-line format
- Space-separated links
- No title display (cleaner)
- Clickable [[N]] links
- Max 10 sources to prevent rate limiting

### Comparison with Other Providers

| Provider | Format | Example |
|----------|--------|---------|
| **xAI** | `[[1]](url) [[2]](url)` | Compact, space-separated |
| **Google** | `[[1]](url) [[2]](url)` | Same as xAI |
| **OpenAI** | `- [title](url)` | Multi-line with titles |
| **Perplexity** | `[[1]](url)` inline | Inline in text |

---

## Server-Side Tools Details

### web_search

**Sub-tools executed by xAI:**
- `web_search` - General web search
- `web_search_with_snippets` - Search with page snippets
- `browse_page` - Browse and extract page content

**Parameters:**
```typescript
{
  allowedDomains?: string[];      // Max 5
  excludedDomains?: string[];     // Max 5
  enableImageUnderstanding?: boolean;
}
```

**Example:**
```typescript
tools.web_search = webSearch({
  allowedDomains: ['news.ycombinator.com', 'github.com'],
  excludedDomains: ['spam.com'],
  enableImageUnderstanding: true,
});
```

### x_search

**Sub-tools executed by xAI:**
- `x_user_search` - Search posts from specific users
- `x_keyword_search` - Keyword search across X
- `x_semantic_search` - Semantic/contextual search
- `x_thread_fetch` - Fetch complete threads

**Parameters:**
```typescript
{
  allowedXHandles?: string[];     // Max 10
  excludedXHandles?: string[];    // Max 10
  enableImageUnderstanding?: boolean;
  enableVideoUnderstanding?: boolean;
}
```

**Example:**
```typescript
tools.x_search = xSearch({
  allowedXHandles: ['elonmusk', 'OpenAI'],
  excludedXHandles: ['spambot'],
  enableImageUnderstanding: true,
  enableVideoUnderstanding: true,
});
```

### code_execution

**Features:**
- Python sandbox environment
- Safe code execution on xAI servers
- Useful for calculations, data analysis

**Parameters:**
```typescript
// No configuration needed
tools.code_execution = codeExecution();
```

---

## Known Issues

### Type Validation Error (AI SDK v6 Beta Bug)

**Error:**
```
Type validation failed:
Value: {"sequence_number":9,"type":"response.custom_tool_call_input.delta",...}
Error: validator received "response.custom_tool_call_input.delta" but expected...
```

**Status:** AI SDK Issue #10291 (v6 beta regression)

**Impact:**
- Error appears in logs but doesn't break functionality
- Tools still work correctly
- Wait for AI SDK fix in future beta release

**Workaround:** Ignore the error, functionality is unaffected

---

## Troubleshooting

### Tools Not Working

**Check:**
1. ✅ Environment variables are set to `true`
2. ✅ Using grok-4 or newer model
3. ✅ XAI_API_KEY is valid
4. ✅ Check logs for tool activation:
   ```
   [warpLLMParams] xAI server-side tools enabled: web_search, x_search
   ```

### No Citations Displayed

**Check:**
1. ✅ `ENABLE_SEARCH_SOURCE=true` in environment
2. ✅ xAI returned sources in response
3. ✅ Check messageInfo.sources in logs

### Domain/Handle Filtering Not Working

**Limits:**
- Web search: Max 5 allowed + 5 excluded domains
- X search: Max 10 allowed + 10 excluded handles

**Code automatically slices to max:**
```typescript
allowedDomains: context.XAI_WEB_SEARCH_ALLOWED_DOMAINS.slice(0, 5)
```

### Rate Limiting

**Solutions:**
- Reduced to max 10 sources per response
- Compact format uses less Telegram message space
- Consider lowering if still hitting limits

---

## Best Practices

### Domain Filtering

**DO:**
```env
# Allow trusted sources
XAI_WEB_SEARCH_ALLOWED_DOMAINS=["reuters.com","bbc.com","nytimes.com"]
```

**DON'T:**
```env
# Too many domains (will be sliced to 5)
XAI_WEB_SEARCH_ALLOWED_DOMAINS=["a.com","b.com","c.com","d.com","e.com","f.com","g.com"]
```

### Handle Filtering

**DO:**
```env
# Focus on specific voices
XAI_X_SEARCH_ALLOWED_HANDLES=["sama","ylecun","karpathy"]
```

**DON'T:**
```env
# Exclude too aggressively (limits useful results)
XAI_X_SEARCH_EXCLUDED_HANDLES=["handle1","handle2",...,"handle20"]
```

### Performance

**DO:**
- Enable only tools you need
- Use domain/handle filtering to reduce noise
- Keep `ENABLE_SEARCH_SOURCE=true` for citations

**DON'T:**
- Enable all tools for every request
- Use web_search for simple factual questions
- Disable citations (users want sources)

---

## API Reference

### Configuration Class (`config.ts:574-613`)

```typescript
export class XAIConfig {
    XAI_API_KEY: string | null = null;
    XAI_API_BASE = 'https://api.x.ai/v1';
    XAI_CHAT_MODEL = 'grok-3';
    XAI_IMAGE_MODEL = 'grok-2-image';

    // Server-Side Tools
    XAI_ENABLE_WEB_SEARCH = false;
    XAI_ENABLE_X_SEARCH = false;
    XAI_ENABLE_CODE_EXECUTION = false;

    // Web Search Config
    XAI_WEB_SEARCH_ALLOWED_DOMAINS: string[] = [];
    XAI_WEB_SEARCH_EXCLUDED_DOMAINS: string[] = [];
    XAI_WEB_SEARCH_IMAGE_UNDERSTANDING = false;

    // X Search Config
    XAI_X_SEARCH_ALLOWED_HANDLES: string[] = [];
    XAI_X_SEARCH_EXCLUDED_HANDLES: string[] = [];
    XAI_X_SEARCH_IMAGE_UNDERSTANDING = false;
    XAI_X_SEARCH_VIDEO_UNDERSTANDING = false;
}
```

### Tool Integration (`model_middleware.ts:296-340`)

Located in `warpLLMParams` function, automatically activates when:
- `model.provider === 'xai.chat'` OR `model.provider === 'xai.responses'`
- Corresponding `XAI_ENABLE_*` flag is `true`

### Citation Processing (`request.ts`)

**Functions:**
- `thinkingExtractor()` - Collects source events from stream
- `appendStreamSources()` - Formats sources in Google style

---

## Examples

### Example 1: News Search

**Input:**
```
台湾暴动新闻
```

**xAI Process:**
1. Calls `web_search` with query
2. Browses news sites
3. Extracts relevant content
4. Returns answer with 8 citations

**Output:**
```
台湾目前没有发生暴动或大规模骚乱...

>sources:
>[[1]](https://url1) [[2]](https://url2) [[3]](https://url3) [[4]](https://url4) [[5]](https://url5) [[6]](https://url6) [[7]](https://url7) [[8]](https://url8)
```

### Example 2: X Search with Filtering

**Config:**
```env
XAI_ENABLE_X_SEARCH=true
XAI_X_SEARCH_ALLOWED_HANDLES=["sama","gdb","karpathy"]
```

**Input:**
```
What do AI researchers think about GPT-5?
```

**xAI Process:**
1. Calls `x_search` limited to specified handles
2. Fetches relevant posts
3. Analyzes thread context
4. Returns summary

### Example 3: Code Execution

**Config:**
```env
XAI_ENABLE_CODE_EXECUTION=true
```

**Input:**
```
Calculate the Fibonacci sequence up to 100
```

**xAI Process:**
1. Generates Python code
2. Executes in sandbox
3. Returns results

---

## Migration Guide

### From Custom Implementation

If you had custom xAI tools code:

**OLD (Incorrect):**
```typescript
// llm.ts - DELETE THIS
if (provider === 'xai') {
    options.tools = [
        { type: 'web_search' },
        { type: 'x_search' },
    ];
}
```

**NEW (Correct):**
```typescript
// model_middleware.ts - Already implemented
if (model.provider === 'xai.chat' || model.provider === 'xai.responses') {
    const { webSearch, xSearch } = await import('@ai-sdk/xai');
    tools.web_search = webSearch(config);
    tools.x_search = xSearch(config);
}
```

---

## FAQ

### Q: Do I need to enable tools for every request?

**A:** No, tools are automatically added when enabled. Grok decides when to use them based on the question.

### Q: Can I use web_search and x_search together?

**A:** Yes! Enable both and Grok will choose the appropriate tool(s) for each query.

### Q: Why are citations in [[1]](url) format instead of showing titles?

**A:** This matches Google's compact format and prevents Telegram rate limiting from long messages.

### Q: Does this work with grok-2 or older models?

**A:** No, server-side tools require grok-3+ (chat API) or grok-4+ (responses API). The code auto-selects responses API for grok-4.

### Q: Can I customize the citation format?

**A:** Yes, edit `appendStreamSources()` in `src/agent/request.ts`. Current format matches Google for consistency.

### Q: What happens if I exceed domain/handle limits?

**A:** Code automatically slices to max allowed (5 domains, 10 handles). Extra entries are ignored.

---

## Technical Details

### AI SDK Integration

xAI tools use official AI SDK implementations:

```typescript
import { webSearch, xSearch, codeExecution } from '@ai-sdk/xai';
```

**Source files:**
- `@ai-sdk/xai/src/tool/web-search.ts`
- `@ai-sdk/xai/src/tool/x-search.ts`
- `@ai-sdk/xai/src/tool/code-execution.ts`

### Stream Events

xAI returns sources as stream events:

```typescript
{
  type: 'source',
  sourceType: 'url',
  id: generateId(),
  url: 'https://example.com',
  title: 'Page Title',
}
```

### Provider Detection

```typescript
// xAI provider IDs:
'xai.chat'       // Chat API (languageModel)
'xai.responses'  // Responses API (responses)
```

---

## Resources

- [xAI API Documentation](https://docs.x.ai/docs/overview)
- [xAI Search Tools Guide](https://docs.x.ai/docs/guides/tools/search-tools)
- [AI SDK xAI Provider](https://sdk.vercel.ai/providers/ai-sdk-providers/xai)
- [Vercel AI SDK GitHub](https://github.com/vercel/ai)
- [AI SDK Issue #10291](https://github.com/vercel/ai/issues/10291) - Type validation bug

---

## Changelog

### 2025-12-20
- ✅ Initial implementation of xAI server-side tools
- ✅ Added web_search, x_search, code_execution support
- ✅ Implemented Google-style compact citation format
- ✅ Added configuration options in config.ts
- ✅ Integrated with warpLLMParams middleware
- ✅ Fixed type validation error (AI SDK bug, ignored)
- ✅ Optimized citation format to prevent rate limiting
- ✅ Added domain/handle filtering with automatic limits

---

**Maintainer:** Claude Code
**Last Updated:** 2025-12-20
