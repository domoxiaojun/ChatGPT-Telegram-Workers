# 服务端工具使用指南

本指南涵盖了 Anthropic、Google 和 xAI 三大平台的服务端工具配置和使用方法。

## 📋 目录

- [功能概览](#功能概览)
- [Anthropic 工具](#anthropic-工具)
- [Google 工具](#google-工具)
- [xAI 工具](#xai-工具)
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

| 功能 | Anthropic | Google | xAI | 说明 |
|------|-----------|--------|-----|------|
| **成本优化** | ✅ Cache Control | ✅ | ❌ | 降低 50%+ API 成本 |
| **网页搜索** | ✅ Web Search | ✅ Google Search | ✅ Web Search | 实时搜索互联网 |
| **网页获取** | ✅ Web Fetch | ✅ URL Context | ❌ | 获取网页内容 |
| **代码执行** | ✅ Python+Bash | ✅ Python | ✅ Python | 沙盒代码执行 |
| **社交搜索** | ❌ | ❌ | ✅ X Search | 搜索 Twitter/X |
| **地图服务** | ❌ | ✅ Maps | ❌ | 地理位置信息 |
| **文件搜索** | ❌ | ✅ File Search | ❌ | 搜索上传文件 |
| **引用溯源** | ✅ Citations | ❌ | ❌ | 标注信息来源 |
| **上下文管理** | ✅ | ❌ | ❌ | 自动清理历史 |
| **工具流式** | ✅ | ❌ | ❌ | 实时进度显示 |

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

**功能**：使用 Google 搜索引擎获取实时信息。

**配置**：
```bash
USE_GOOGLE_BUILDIN=["googleSearch"]
```

**注意**：
- 需要 Gemini 2.0+ 模型
- 自动集成 Google 搜索结果
- 支持 Grounding（结果验证）

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

## 📊 工具对比

### 网页搜索对比

| 特性 | Anthropic | Google | xAI |
|------|-----------|--------|-----|
| 搜索引擎 | 通用 | Google | 通用 |
| 域名过滤 | ✅ 无限制 | ❌ | ✅ 最多 5 个 |
| 位置定制 | ✅ | ✅ | ❌ |
| 图片理解 | ❌ | ❌ | ✅ |
| 社交搜索 | ❌ | ❌ | ✅ X/Twitter |
| 引用溯源 | ✅ | ❌ | ❌ |

### 代码执行对比

| 特性 | Anthropic | Google | xAI |
|------|-----------|--------|-----|
| Python | ✅ | ✅ | ✅ |
| Bash | ✅ | ❌ | ❌ |
| 文件操作 | ✅ | ✅ | ✅ |
| 网络访问 | ❌ | ❌ | ❌ |
| 沙盒隔离 | ✅ | ✅ | ✅ |

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

**解决**：
- 选择其中一个工具
- 或使用不同的 API

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
```

---

## 🆘 获取帮助

遇到问题？

1. 检查日志输出
2. 确认模型版本
3. 查看 [GitHub Issues](https://github.com/TBXark/ChatGPT-Telegram-Workers/issues)
4. 阅读 [Anthropic 文档](https://docs.anthropic.com)
