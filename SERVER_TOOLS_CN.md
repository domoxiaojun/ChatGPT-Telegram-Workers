# 服务端工具使用指南

本指南涵盖了 Anthropic、Google、xAI 和 OpenAI 四大平台的服务端工具配置和使用方法。

## 📋 目录

- [功能概览](#功能概览)
- [Anthropic 工具](#anthropic-工具)
- [Google 工具](#google-工具)
- [xAI 工具](#xai-工具)
- [OpenAI 工具](#openai-工具)
- [工具对比](#工具对比)
- [使用场景](#使用场景)
- [故障排除](#故障排除)

## 🎯 功能概览

### 什么是服务端工具？

服务端工具是由 AI 提供商在其服务器端执行的功能，无需您自己实现工具逻辑。优势：

- ✅ **零代码实现** - 只需配置即可使用
- ✅ **官方支持** - 稳定可靠，持续更新
- ✅ **安全沙盒** - 在隔离环境中执行
- ✅ **自动优化** - 提供商负责性能优化

### 已实现功能

| 功能 | Anthropic | Google | xAI | OpenAI | 说明 |
|------|-----------|--------|-----|--------|------|
| **成本优化** | ✅ Cache Control | ✅ | ❌ | ❌ | 降低 50%+ API 成本 |
| **网页搜索** | ✅ Web Search | ✅ Google Search | ✅ Web Search | ✅ Web Search | 实时搜索互联网 |
| **网页获取** | ✅ Web Fetch | ✅ URL Context | ✅ (内置) | ✅ (内置) | 获取网页内容 |
| **代码执行** | ✅ Python+Bash | ✅ Python | ✅ Python | ✅ Python | 沙盒代码执行 |
| **社交搜索** | ❌ | ❌ | ✅ X Search | ❌ | 搜索 Twitter/X |
| **地图服务** | ❌ | ✅ Maps | ❌ | ❌ | 地理位置信息 |
| **文件搜索** | ❌ | ✅ File Search | ✅ File Search | ✅ File Search | 搜索上传文件 |
| **图片生成** | ❌ | ❌ | ❌ | ✅ Image Gen | AI 图片生成 |
| **MCP 协议** | ❌ | ❌ | ❌ | ✅ MCP | 远程工具调用 |
| **引用溯源** | ✅ Citations | ❌ | ❌ | ✅ Citations | 标注信息来源 |
| **上下文管理** | ✅ | ❌ | ❌ | ❌ | 自动清理历史 |
| **工具流式** | ✅ | ❌ | ❌ | ❌ | 实时进度显示 |

---

## 🤖 Anthropic 工具

### 1. Cache Control - 成本优化 ⭐

**功能**：自动缓存 system message 和工具定义，大幅降低 API 成本。

**配置**：
```bash
ANTHROPIC_ENABLE_CACHE_CONTROL=true  # 强烈推荐开启
```

**成本节省示例**：
```
第 1 次请求:
- 输入: 10,000 tokens
- 输出: 1,000 tokens
- 成本: $0.30

第 2 次请求（缓存生效）:
- 输入: 2,000 tokens (新内容)
- 缓存: 8,000 tokens (10% 成本)
- 输出: 1,000 tokens
- 成本: $0.14 (节省 53%)
```

**注意事项**：
- 自动生效，无需额外配置
- System message 和最后一个工具会被标记为可缓存
- 缓存有效期 5 分钟
- 适用于所有 Claude 模型

---

### 2. Web Search - 网页搜索

**功能**：实时搜索互联网，获取最新信息。

**配置**：
```bash
ANTHROPIC_ENABLE_WEB_SEARCH=true
ANTHROPIC_WEB_SEARCH_MAX_USES=5                    # 每次对话最多搜索次数
ANTHROPIC_WEB_SEARCH_ALLOWED_DOMAINS=[]            # 允许的域名（留空=全部）
ANTHROPIC_WEB_SEARCH_BLOCKED_DOMAINS=[]            # 屏蔽的域名
ANTHROPIC_WEB_SEARCH_USER_LOCATION="Beijing, China"  # 用户位置（本地化结果）
```

**使用示例**：
```
用户: 2024年诺贝尔物理学奖得主是谁？

Claude 会:
1. 自动调用 web_search 工具
2. 搜索最新信息
3. 返回结果并附带来源链接
```

**支持的位置格式**：
- 城市+国家: `"San Francisco, USA"`
- 经纬度: `"37.7749,-122.4194"`

---

### 3. Web Fetch - 网页获取

**功能**：获取指定网页内容，支持引用溯源（Citations）。

**配置**：
```bash
ANTHROPIC_ENABLE_WEB_FETCH=true
ANTHROPIC_WEB_FETCH_MAX_USES=5                     # 每次对话最多获取次数
ANTHROPIC_WEB_FETCH_ALLOWED_DOMAINS=["wikipedia.org"]  # 允许的域名
ANTHROPIC_WEB_FETCH_BLOCKED_DOMAINS=["ads.com"]    # 屏蔽的域名
ANTHROPIC_WEB_FETCH_ENABLE_CITATIONS=true          # 启用引用溯源 ⭐
ANTHROPIC_WEB_FETCH_MAX_CONTENT_TOKENS=4000        # 最大内容长度
```

**Citations 功能示例**：
```
用户: 获取 https://wikipedia.org/wiki/Python_(programming_language)

Claude 会返回:
Python 是由 Guido van Rossum 创建的[1]，于 1991 年首次发布[2]。
它强调代码可读性，使用显著的缩进[3]。

引用来源:
[1] Introduction, paragraph 1
[2] History section, line 5
[3] Design Philosophy, paragraph 2
```

---

### 4. Code Execution - 代码执行

**功能**：在沙盒环境中执行 Python 和 Bash 代码。

**配置**：
```bash
ANTHROPIC_ENABLE_CODE_EXECUTION=true
```

**支持的语言**：
- Python 3.x
- Bash

**使用示例**：
```
用户: 帮我分析这组数据: [1, 5, 3, 9, 2, 7, 4, 6, 8]

Claude 会:
1. 编写 Python 代码计算统计信息
2. 在沙盒中执行代码
3. 返回结果（均值、中位数、标准差等）
4. 可能生成可视化图表
```

**安全特性**：
- 完全隔离的沙盒环境
- 无网络访问
- 执行超时限制
- 文件系统隔离

**限制**：
- 不支持需要网络的操作
- 不支持安装额外包（预装常用库）
- 执行时间限制约 60 秒

---

### 5. Tool Streaming - 工具流式显示

**功能**：实时显示工具执行进度。

**配置**：
```bash
ANTHROPIC_ENABLE_TOOL_STREAMING=true  # 默认开启
```

**用户体验对比**：

**关闭时**：
```
用户: 搜索最新 AI 新闻
[等待 5 秒...]
Claude: 根据搜索结果，...
```

**开启时**：
```
用户: 搜索最新 AI 新闻
tool call start: `web_search`
[实时显示] 正在搜索...
[实时显示] 找到 10 个结果...
finish tools: `web_search`
Claude: 根据搜索结果，...
```

---

### 6. Context Management - 上下文管理

**功能**：自动清理历史工具调用，避免上下文过长。

**配置**：
```bash
ANTHROPIC_ENABLE_CONTEXT_MANAGEMENT=true
ANTHROPIC_CONTEXT_CLEAR_TRIGGER="auto"             # auto | manual
ANTHROPIC_CONTEXT_KEEP_RECENT=5                    # 保留最近 5 次工具调用
ANTHROPIC_CONTEXT_CLEAR_AT_LEAST=2                 # 至少清理 2000 tokens
ANTHROPIC_CONTEXT_CLEAR_TOOL_INPUTS=false          # 是否清理工具输入
ANTHROPIC_CONTEXT_EXCLUDE_TOOLS=[]                 # 不清理的工具
```

**工作原理**：
- `auto` 模式：当工具调用超过 `KEEP_RECENT + 2` 次时自动触发
- `manual` 模式：不自动触发，需要手动控制
- 保留最近的 N 次工具调用
- 清理至少 N 千个 tokens

**适用场景**：
- 长对话（10+ 轮）
- 频繁使用工具（每轮 3+ 个工具）
- 遇到 "context too long" 错误

---

### 7. Thinking Cleanup - 思考内容清理

**功能**：清理推理模型的思考内容（适用于 Claude 3.7 Sonnet）。

**配置**：
```bash
ANTHROPIC_ENABLE_THINKING_CLEANUP=false            # 默认关闭
ANTHROPIC_THINKING_KEEP_RECENT=3                   # 保留最近 3 轮思考
```

**适用模型**：
- Claude 3.7 Sonnet
- 其他启用了 thinking 功能的模型

---

### 8. Structured Output Mode - 结构化输出

**功能**：强制 Claude 输出符合 JSON Schema 的结构化数据。

**配置**：
```bash
ANTHROPIC_STRUCTURED_OUTPUT_MODE="auto"  # auto | outputFormat | tool
```

**模式说明**：
- `auto`：AI SDK 自动选择（推荐）
- `outputFormat`：使用 output format（灵活）
- `tool`：使用工具模式（严格）

**使用场景**：
- 需要严格的 JSON 输出
- 工具返回的数据格式化
- 减少 JSON 解析错误

---

## 🌐 Google 工具

### 1. Google Search - Google 搜索

**功能**：使用 Google 搜索引擎获取实时信息。支持网页搜索、图片搜索和时间范围过滤。

**基础配置**：
```bash
USE_GOOGLE_BUILDIN=["googleSearch"]
```

**高级配置**：
```bash
# 启用网页搜索（默认：true）
GOOGLE_SEARCH_ENABLE_WEB_SEARCH=true

# 启用图片搜索，仅支持图片模型（默认：false）
GOOGLE_SEARCH_ENABLE_IMAGE_SEARCH=false

# 时间范围过滤（ISO 8601 格式）
GOOGLE_SEARCH_TIME_RANGE_FILTER='{"startTime": "2025-01-01T00:00:00Z", "endTime": "2025-12-31T23:59:59Z"}'
```

**功能特性**：
- **网页搜索**：搜索网页获取实时信息
- **图片搜索**：基于搜索结果搜索和生成图片（需要 `gemini-3.1-flash-image-preview` 等支持图片的模型）
- **时间范围过滤**：将搜索结果限制在特定时间段内
- **Grounding**：自动结果验证和来源归属

**使用场景**：
- 实时新闻和时事查询
- 基于上下文的图片搜索和生成
- 特定时间范围内的历史数据
- 基于位置的信息查询

**注意**：
- 需要 Gemini 2.0+ 模型
- 图片搜索仅适用于支持图片的模型，如 `gemini-3.1-flash-image-preview`
- 时间范围过滤可帮助将结果缩小到特定时期

---

### 2. URL Context - 网页上下文

**功能**：从 URL 获取内容并添加到上下文。

**配置**：
```bash
USE_GOOGLE_BUILDIN=["urlContext"]
```

**使用示例**：
```
用户: https://example.com/article.html 这篇文章讲了什么？

Gemini 会:
1. 自动获取网页内容
2. 分析文章
3. 回答问题
```

---

### 3. Code Execution - 代码执行

**功能**：执行 Python 代码（仅支持 Python）。

**配置**：
```bash
USE_GOOGLE_BUILDIN=["codeExecution"]
```

**限制**：
- 仅支持 Python
- 不支持 Bash
- 不能与 Google Maps 同时使用

---

### 4. Google Maps - 地图服务

**功能**：提供地理位置信息和地图数据。

**配置**：
```bash
USE_GOOGLE_BUILDIN=["googleMaps"]
GOOGLE_RETRIEVAL_CONFIG='{"latLng":{"latitude":37.7749,"longitude":-122.4194}}'
GOOGLE_MAPS_MODEL="gemini-2.5-flash"  # Maps 专用模型
```

**要求**：
- 需要 Gemini 2.x 模型
- 不能与 Code Execution 同时使用
- 需要提供用户位置

**使用示例**：
```
用户: 附近有什么好吃的餐厅？

Gemini 会:
1. 根据配置的位置信息
2. 搜索附近餐厅
3. 返回推荐列表
```

---

### 5. File Search - 文件搜索

**功能**：搜索上传到 Google 的文件内容。

**配置**：
```bash
USE_GOOGLE_BUILDIN=["fileSearch"]
GOOGLE_FILE_SEARCH_STORES=["projects/xxx/locations/us/ragCorpora/xxx/ragFiles/xxx"]
GOOGLE_FILE_SEARCH_TOP_K=10                        # 返回前 10 个结果
GOOGLE_FILE_SEARCH_METADATA_FILTER='{"key":"value"}'  # 元数据过滤
```

**使用流程**：
1. 上传文件到 Google AI Studio
2. 获取文件 store ID
3. 配置到环境变量
4. 对话中自动搜索文件内容

---

### 6. Enterprise Web Search - 企业网页搜索

**功能**：企业级网页搜索功能。

**配置**：
```bash
USE_GOOGLE_BUILDIN=["enterpriseWebSearch"]
```

---

## 🚀 xAI 工具

### 1. Web Search - 网页搜索

**功能**：使用 Grok 的网页搜索功能。

**配置**：
```bash
XAI_ENABLE_WEB_SEARCH=true
XAI_WEB_SEARCH_ALLOWED_DOMAINS=[]                  # 允许的域名（最多 5 个）
XAI_WEB_SEARCH_EXCLUDED_DOMAINS=[]                 # 排除的域名（最多 5 个）
XAI_WEB_SEARCH_IMAGE_UNDERSTANDING=false           # 理解搜索结果中的图片
```

**注意**：
- 仅支持 Responses API（`xai.responses`）
- Chat API 使用 `searchParameters` 代替

---

### 2. X Search - 社交搜索

**功能**：搜索 Twitter/X 的内容。

**配置**：
```bash
XAI_ENABLE_X_SEARCH=true
XAI_X_SEARCH_ALLOWED_HANDLES=["elonmusk"]          # 允许的账号（最多 10 个）
XAI_X_SEARCH_EXCLUDED_HANDLES=[]                   # 排除的账号（最多 10 个）
XAI_X_SEARCH_IMAGE_UNDERSTANDING=false             # 理解推文中的图片
XAI_X_SEARCH_VIDEO_UNDERSTANDING=false             # 理解推文中的视频
```

**使用示例**：
```
用户: 马斯克最近在说什么？

Grok 会:
1. 搜索 @elonmusk 的最新推文
2. 分析内容
3. 总结要点
```

---

### 3. Code Execution - 代码执行

**功能**：执行 Python 代码。

**配置**：
```bash
XAI_ENABLE_CODE_EXECUTION=true
```

---

### 4. File Search - 文件搜索

**功能**：搜索上传到 xAI 向量存储（collections）的文件内容。

**配置**：
```bash
XAI_ENABLE_FILE_SEARCH=true
XAI_FILE_SEARCH_VECTOR_STORES=["collection_xxx"]  # 向量存储ID列表（必需）
XAI_FILE_SEARCH_MAX_RESULTS=10                     # 最大返回结果数
```

**使用流程**：
1. 在 [xAI 控制台](https://console.x.ai/) 创建 collection
2. 上传文件到 collection
3. 获取 collection ID（格式：`collection_xxx`）
4. 配置到环境变量
5. 对话中自动搜索文件内容

**使用示例**：
```
用户: 在我的文档中搜索关于 API 认证的内容

Grok 会:
1. 在配置的向量存储中搜索
2. 返回最相关的文档片段
3. 包含文件名和相关性分数
```

**注意**：
- 仅支持 Responses API（`xai.responses`）
- 需要 grok-4 或更新的模型
- 参见 [xAI Collections 指南](https://docs.x.ai/docs/guides/using-collections/api)

---

## 🤖 OpenAI 工具

**重要提示**：OpenAI 服务端工具仅支持 **Responses API**，不支持 Chat Completions API。

### API 选择说明

OpenAI 提供两种 API：
- **Chat Completions API** (`openai`): 标准对话 API，不支持服务端工具
- **Responses API** (`openai.responses`): 新一代 API，支持所有服务端工具

**配置示例**：
```bash
# 使用 Responses API（支持服务端工具）
OPENAI_API_KEY="sk-xxx"
OPENAI_CHAT_MODEL="gpt-5.1"  # 或其他支持的模型
AI_CHAT_PROVIDER="openai"
```

---

### 1. Web Search - 网页搜索与页面读取 ⭐

**功能**：实时搜索互联网并读取网页内容（三合一工具）。

**三大能力**：
1. **搜索** - 搜索网络信息
2. **打开页面** - 读取指定 URL 的完整内容
3. **页面内查找** - 在已打开的页面中搜索特定模式

**配置**：
```bash
OPENAI_ENABLE_WEB_SEARCH=true
OPENAI_WEB_SEARCH_EXTERNAL_ACCESS=true                 # true=实时抓取，false=使用缓存
OPENAI_WEB_SEARCH_ALLOWED_DOMAINS=["wikipedia.org"]    # 允许的域名列表（可选）
OPENAI_WEB_SEARCH_CONTEXT_SIZE="medium"                # 搜索上下文大小：low | medium | high
OPENAI_WEB_SEARCH_USER_LOCATION="Beijing, China"       # 用户位置（本地化结果）
```

**支持的位置格式**：
- 城市+国家: `"San Francisco, USA"`
- 仅国家: `"Japan"`

**注意**：不支持经纬度格式（OpenAI API 限制）

**使用示例**：

**示例 1 - 网页搜索**：
```
用户: 2024 年最新的 AI 技术趋势是什么？

GPT 会:
1. 自动调用 web_search 工具（动作：search）
2. 搜索最新信息
3. 返回结果并附带来源链接
```

**示例 2 - 读取网页**：
```
用户: 读取这篇文章并总结：https://example.com/article

GPT 会:
1. 调用 web_search 工具（动作：openPage）
2. 抓取并读取完整页面内容
3. 分析并总结内容
```

**示例 3 - 页面内查找**：
```
用户: 在 https://example.com/pricing 找到价格信息

GPT 会:
1. 打开页面（动作：openPage）
2. 搜索价格模式（动作：findInPage）
3. 提取相关价格详情
```

**与其他提供商对比**：
- **OpenAI webSearch**：搜索 + 读取页面 + 页面内查找（三合一）⭐
- **Anthropic**：webSearch（仅搜索）+ webFetch（读取页面，独立工具）
- **xAI**：webSearch（搜索 + 读取页面，二合一）
- **Google**：googleSearch（仅搜索）

---

### 2. Code Interpreter - Python 代码执行

**功能**：在沙盒环境中执行 Python 代码。

**配置**：
```bash
OPENAI_ENABLE_CODE_INTERPRETER=true
OPENAI_CODE_INTERPRETER_CONTAINER=""  # 容器ID（可选）
```

**支持的语言**：
- Python 3.x（仅支持 Python）

**使用示例**：
```
用户: 帮我计算斐波那契数列的前 20 项

GPT 会:
1. 编写 Python 代码
2. 在沙盒中执行
3. 返回计算结果
```

**安全特性**：
- 完全隔离的沙盒环境
- 无外部网络访问
- 执行超时限制
- 文件系统隔离

---

### 3. File Search - 文件向量搜索

**功能**：在上传的文件中进行语义搜索。

**配置**：
```bash
OPENAI_ENABLE_FILE_SEARCH=true
OPENAI_FILE_SEARCH_VECTOR_STORES=["vs-xxx","vs-yyy"]   # 向量存储ID列表（必需）
OPENAI_FILE_SEARCH_MAX_RESULTS=10                       # 最大返回结果数
OPENAI_FILE_SEARCH_SCORE_THRESHOLD=0.0                  # 相关性阈值（0-1），越高越严格
```

**使用流程**：
1. 上传文件到 OpenAI 并创建 Vector Store
2. 获取 Vector Store ID（格式：`vs-xxx`）
3. 配置到环境变量
4. 对话中自动搜索文件内容

**使用示例**：
```
用户: 在我的文档中搜索关于 API 认证的内容

GPT 会:
1. 在配置的 Vector Stores 中搜索
2. 返回最相关的文档片段
3. 按相关性排序
```

**参数说明**：
- `maxNumResults`: 控制返回结果数量（1-50）
- `scoreThreshold`: 过滤低相关性结果（0.0-1.0）
  - 0.0: 返回所有结果
  - 0.5: 中等相关性
  - 0.8: 高度相关

---

### 4. Image Generation - 图片生成 (GPT-5.1+)

**功能**：使用文本提示生成图片，支持高级控制选项。

**配置**：
```bash
OPENAI_ENABLE_IMAGE_GENERATION=true
OPENAI_IMAGE_MODEL="gpt-image-1"                        # 图片生成模型
OPENAI_IMAGE_SIZE="auto"                                # 图片尺寸：auto | 1024x1024 | 1024x1536 | 1536x1024
OPENAI_IMAGE_QUALITY="auto"                             # 质量：auto | low | medium | high
OPENAI_IMAGE_BACKGROUND="auto"                          # 背景：auto | opaque | transparent
OPENAI_IMAGE_OUTPUT_FORMAT="png"                        # 输出格式：png | jpeg | webp
OPENAI_IMAGE_OUTPUT_COMPRESSION=100                     # 压缩等级（0-100）
OPENAI_IMAGE_INPUT_FIDELITY="low"                       # 输入保真度：low | high
OPENAI_IMAGE_PARTIAL_IMAGES=0                           # 流式模式下的部分图片数量（0-3）
```

**使用示例**：
```
用户: 生成一张赛博朋克风格的城市夜景

GPT 会:
1. 优化文本提示
2. 调用 image_generation 工具
3. 返回生成的图片
```

**参数详解**：
- `size`: 图片尺寸
  - `auto`: AI 自动选择最佳尺寸
  - `1024x1024`: 正方形
  - `1024x1536`: 竖屏
  - `1536x1024`: 横屏

- `quality`: 质量级别
  - `auto`: 自动平衡质量和速度
  - `low`: 快速生成
  - `medium`: 标准质量
  - `high`: 最佳质量（较慢）

- `background`: 背景类型
  - `auto`: 自动决定
  - `opaque`: 不透明背景
  - `transparent`: 透明背景（PNG）

- `partialImages`: 流式模式
  - `0`: 不使用流式（等待完整图片）
  - `1-3`: 生成过程中返回部分图片

---

### 5. MCP - Model Context Protocol

**功能**：连接到远程 MCP 服务器或服务连接器，调用外部工具。

**配置**：
```bash
OPENAI_ENABLE_MCP=true
OPENAI_MCP_SERVER_LABEL="my-server"                    # 服务器标签（必需）
OPENAI_MCP_SERVER_URL="https://mcp.example.com"        # 服务器URL（与connectorId二选一）
OPENAI_MCP_CONNECTOR_ID=""                              # 连接器ID（与serverUrl二选一）
OPENAI_MCP_SERVER_DESCRIPTION="My MCP Server"          # 服务器描述（可选）
OPENAI_MCP_ALLOWED_TOOLS=["tool1","tool2"]             # 允许的工具列表
OPENAI_MCP_ALLOWED_TOOLS_READ_ONLY=false                # 仅允许只读工具
OPENAI_MCP_AUTHORIZATION="Bearer xxx"                   # OAuth访问令牌
OPENAI_MCP_HEADERS='{"X-Custom":"value"}'               # 自定义HTTP头（JSON格式）
OPENAI_MCP_REQUIRE_APPROVAL="never"                     # 审批策略：always | never
OPENAI_MCP_APPROVAL_TOOL_NAMES=[]                       # 需要审批的工具（requireApproval非always时）
```

**参数说明**：

**必需参数**：
- `serverLabel`: 标识 MCP 服务器的标签
- `serverUrl` 或 `connectorId`: 二选一必填

**可选参数**：
- `serverDescription`: 服务器功能描述，帮助 AI 理解何时使用
- `allowedTools`: 限制可用工具
  - 数组格式: `["tool1", "tool2"]` - 允许特定工具
  - 对象格式: `{"readOnly": true, "toolNames": ["tool1"]}` - 仅只读工具

- `authorization`: OAuth 令牌，用于服务器认证
- `headers`: 自定义 HTTP 头，用于额外的认证或配置
- `requireApproval`: 工具执行审批
  - `always`: 所有工具都需要审批
  - `never`: 不需要审批（默认）
  - 对象格式: 指定哪些工具不需要审批

**使用场景**：
- 连接内部 API 服务
- 使用第三方 MCP 服务
- 扩展 AI 能力到自定义工具

---

## 📊 工具对比

### 网页搜索对比

| 特性 | Anthropic | Google | xAI | OpenAI |
|------|-----------|--------|-----|--------|
| 搜索引擎 | 通用 | Google | 通用 | 通用 |
| 域名过滤 | ✅ 无限制 | ❌ | ✅ 最多 5 个 | ✅ 无限制 |
| 位置定制 | ✅ 城市+坐标 | ✅ | ❌ | ✅ 仅城市 |
| 图片理解 | ❌ | ❌ | ✅ | ❌ |
| 社交搜索 | ❌ | ❌ | ✅ X/Twitter | ❌ |
| 引用溯源 | ✅ | ❌ | ❌ | ✅ |

### 代码执行对比

| 特性 | Anthropic | Google | xAI | OpenAI |
|------|-----------|--------|-----|--------|
| Python | ✅ | ✅ | ✅ | ✅ |
| Bash | ✅ | ❌ | ❌ | ❌ |
| 文件操作 | ✅ | ✅ | ✅ | ✅ |
| 网络访问 | ❌ | ❌ | ❌ | ❌ |
| 沙盒隔离 | ✅ | ✅ | ✅ | ✅ |

### 文件搜索对比

| 特性 | Google | xAI | OpenAI |
|------|--------|-----|--------|
| 向量存储 | ✅ | ✅ | ✅ |
| 元数据过滤 | ✅ | ❌ | ❌ |
| 相关性阈值 | ❌ | ❌ | ✅ |
| 多存储支持 | ✅ | ✅ | ✅ |
| 最大结果数配置 | ✅ | ✅ | ✅ |

---

## 💡 使用场景

### 场景 1: 研究助手
```bash
# Anthropic 配置
ANTHROPIC_ENABLE_CACHE_CONTROL=true
ANTHROPIC_ENABLE_WEB_FETCH=true
ANTHROPIC_WEB_FETCH_ENABLE_CITATIONS=true
ANTHROPIC_ENABLE_WEB_SEARCH=true
ANTHROPIC_ENABLE_CONTEXT_MANAGEMENT=true
```

**功能**：搜索资料 + 获取文章 + 引用来源 + 长对话支持

---

### 场景 2: 数据分析
```bash
# Anthropic 配置
ANTHROPIC_ENABLE_CODE_EXECUTION=true
ANTHROPIC_ENABLE_CACHE_CONTROL=true
```

**功能**：Python 数据分析 + 可视化 + 成本优化

---

### 场景 3: 实时新闻追踪
```bash
# xAI 配置
XAI_ENABLE_WEB_SEARCH=true
XAI_ENABLE_X_SEARCH=true
XAI_X_SEARCH_ALLOWED_HANDLES=["reuters","BBCBreaking"]
```

**功能**：网页新闻 + Twitter 实时动态

---

### 场景 4: 本地服务推荐
```bash
# Google 配置
USE_GOOGLE_BUILDIN=["googleMaps","googleSearch"]
GOOGLE_RETRIEVAL_CONFIG='{"latLng":{"latitude":37.7749,"longitude":-122.4194}}'
```

**功能**：基于位置的推荐 + Google 搜索

---

### 场景 5: AI 图片生成助手
```bash
# OpenAI 配置
OPENAI_ENABLE_IMAGE_GENERATION=true
OPENAI_IMAGE_QUALITY="high"
OPENAI_IMAGE_SIZE="1024x1024"
OPENAI_IMAGE_BACKGROUND="transparent"
```

**功能**：高质量图片生成 + 透明背景支持

---

### 场景 6: 企业文档搜索
```bash
# OpenAI 配置
OPENAI_ENABLE_FILE_SEARCH=true
OPENAI_FILE_SEARCH_VECTOR_STORES=["vs-xxx","vs-yyy"]
OPENAI_FILE_SEARCH_SCORE_THRESHOLD=0.7
OPENAI_ENABLE_WEB_SEARCH=true
```

**功能**：内部文档搜索 + 外部信息补充

---

## 🔧 故障排除

### 1. Cache 未生效

**症状**：成本没有降低

**检查**：
- 查看日志中的 `cache_read_input_tokens` 是否 > 0
- 确认 `ANTHROPIC_ENABLE_CACHE_CONTROL=true`

**原因**：
- System message 每次都在变化
- Tools 列表每次不同
- 模型切换了
- 缓存过期（5 分钟）

---

### 2. 工具未被调用

**症状**：配置了工具但没有使用

**检查**：
```bash
# 查看日志
[warpLLMParams] Anthropic server-side tools enabled: web_fetch, web_search
[warpLLMParams] activeTools: web_fetch,web_search
```

**原因**：
- 模型版本不支持（需要 Claude 3.5+）
- 工具配置未启用
- 用户问题不需要工具

---

### 3. 参数格式错误

**症状**：`invalid anthropic provider options`

**解决**：
- 确保使用最新代码
- Context Management 参数现在使用对象格式
- 检查配置值类型是否正确

---

### 4. 工具冲突

**症状**：某些工具组合报错

**已知冲突**：
- Google: Maps + Code Execution 不能同时使用
- xAI: 仅 Responses API 支持原生工具
- OpenAI: 服务端工具仅支持 Responses API（不支持 Chat Completions API）

**解决**：
- 选择其中一个工具
- 或使用不同的 API

---

### 6. OpenAI Vector Store 未找到

**症状**：`Vector Store not found: vs-xxx`

**解决**：
- 确认 Vector Store ID 正确
- 检查是否已上传文件
- 确认 API Key 有权限访问该 Vector Store

---

### 7. MCP 连接失败

**症状**：`MCP server connection failed`

**检查**：
- 确认 `OPENAI_MCP_SERVER_URL` 或 `OPENAI_MCP_CONNECTOR_ID` 正确
- 检查 `OPENAI_MCP_SERVER_LABEL` 是否已设置
- 验证网络连接和防火墙设置
- 确认 authorization token 有效（如果需要）

---

### 5. 输出格式错误

**症状**：`Cannot read properties of undefined (reading 'some')`

**解决**：
- 已修复，使用最新代码
- Provider 工具的 output 格式与自定义工具不同

---

## 📝 完整配置示例

### Anthropic 完整配置
```bash
# 基础
ANTHROPIC_API_KEY="sk-ant-xxx"
ANTHROPIC_CHAT_MODEL="claude-3-5-sonnet-20241022"

# 成本优化
ANTHROPIC_ENABLE_CACHE_CONTROL=true

# Web 工具
ANTHROPIC_ENABLE_WEB_FETCH=true
ANTHROPIC_WEB_FETCH_MAX_USES=5
ANTHROPIC_WEB_FETCH_ENABLE_CITATIONS=true

ANTHROPIC_ENABLE_WEB_SEARCH=true
ANTHROPIC_WEB_SEARCH_MAX_USES=5
ANTHROPIC_WEB_SEARCH_USER_LOCATION="Beijing, China"

# 代码执行
ANTHROPIC_ENABLE_CODE_EXECUTION=true

# 高级功能
ANTHROPIC_ENABLE_TOOL_STREAMING=true
ANTHROPIC_ENABLE_CONTEXT_MANAGEMENT=true
ANTHROPIC_CONTEXT_KEEP_RECENT=5
ANTHROPIC_STRUCTURED_OUTPUT_MODE="auto"
```

### Google 完整配置
```bash
GOOGLE_GENERATIVE_AI_API_KEY="xxx"
USE_GOOGLE_BUILDIN=["googleSearch","codeExecution","urlContext"]
SEARCH_GROUNDING=true
```

### xAI 完整配置
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

### OpenAI 完整配置
```bash
# 基础
OPENAI_API_KEY="sk-xxx"
OPENAI_CHAT_MODEL="gpt-5.1"  # 使用支持 Responses API 的模型

# Web 搜索
OPENAI_ENABLE_WEB_SEARCH=true
OPENAI_WEB_SEARCH_EXTERNAL_ACCESS=true
OPENAI_WEB_SEARCH_CONTEXT_SIZE="medium"
OPENAI_WEB_SEARCH_USER_LOCATION="Beijing, China"

# 代码执行
OPENAI_ENABLE_CODE_INTERPRETER=true

# 文件搜索
OPENAI_ENABLE_FILE_SEARCH=true
OPENAI_FILE_SEARCH_VECTOR_STORES=["vs-xxx"]
OPENAI_FILE_SEARCH_MAX_RESULTS=10
OPENAI_FILE_SEARCH_SCORE_THRESHOLD=0.7

# 图片生成
OPENAI_ENABLE_IMAGE_GENERATION=true
OPENAI_IMAGE_QUALITY="high"
OPENAI_IMAGE_SIZE="auto"
OPENAI_IMAGE_BACKGROUND="auto"

# MCP（可选）
OPENAI_ENABLE_MCP=false
OPENAI_MCP_SERVER_LABEL="my-mcp-server"
OPENAI_MCP_SERVER_URL="https://mcp.example.com"
```

---

## 🆘 获取帮助

遇到问题？

1. 检查日志输出
2. 确认模型版本
3. 查看 [GitHub Issues](https://github.com/SzeMeng76/ChatGPT-Telegram-Workers/issues)
4. 阅读官方文档：
   - [Anthropic 文档](https://docs.anthropic.com)
   - [OpenAI 文档](https://platform.openai.com/docs)
   - [Google AI 文档](https://ai.google.dev/docs)
   - [xAI 文档](https://docs.x.ai)
