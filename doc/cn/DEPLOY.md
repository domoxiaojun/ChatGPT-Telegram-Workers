# Cloudflare Workers 部署指南

> **说明**：如需本地或Docker部署，请查看[本地部署](LOCAL.md)文档。
> 
> 如需Vercel部署，请查看[Vercel部署指南](VERCEL.md)。

## 📋 目录

- [快速部署](#快速部署)
- [手动部署](#手动部署)
- [命令行部署](#命令行部署)
- [故障排除](#故障排除)

## 🚀 快速部署

### 前置要求

开始之前，您需要：
1. **Telegram机器人令牌** - 从[@BotFather](https://t.me/BotFather)获取
2. **OpenAI API密钥** - 从[OpenAI平台](https://platform.openai.com/api-keys)获取
3. **Cloudflare账户** - 在[Cloudflare](https://dash.cloudflare.com)注册

### 一键部署

[![部署到Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/SzeMeng76/ChatGPT-Telegram-Workers)

> ⚠️ **重要**：由于使用AI SDK，CPU时间消耗较高。不适合Cloudflare Workers免费版（10ms限制）。重度使用请考虑Docker部署。

## 📖 手动部署

### 步骤1：创建Telegram机器人

<details>
<summary>点击展开详细说明</summary>

1. 打开Telegram，向[@BotFather](https://t.me/BotFather)发送`/start`
2. 发送`/newbot`命令并为机器人命名
3. 选择以`_bot`结尾的唯一用户名
4. 复制BotFather提供的令牌
5. **请妥善保管此令牌** - 这是您机器人的密钥！

**可选但推荐的设置：**
- 向BotFather发送`/setprivacy`，选择您的机器人，然后选择`Disable`以启用群组功能
- 发送`/setcommands`设置命令菜单（部署后会自动完成）

</details>

### 步骤2：获取OpenAI API密钥

<details>
<summary>点击展开详细说明</summary>

1. 访问[OpenAI平台](https://platform.openai.com)
2. 注册或登录您的账户
3. 导航到[API密钥](https://platform.openai.com/api-keys)
4. 点击"创建新密钥"
5. 复制密钥（以`sk-`开头）
6. **请妥善保管此密钥** - 它可以访问您的OpenAI账户！

**其他AI提供商：**
- [Anthropic Claude](https://console.anthropic.com/) 获取`ANTHROPIC_API_KEY`
- [Google AI Studio](https://aistudio.google.com/) 获取`GOOGLE_API_KEY`
- [Azure OpenAI](https://azure.microsoft.com/zh-cn/products/ai-services/openai-service) 进行Azure配置

</details>

### 步骤3：部署到Cloudflare Workers

<details>
<summary>点击展开详细说明</summary>

1. 访问[Cloudflare Workers控制台](https://dash.cloudflare.com/?to=/:account/workers)
2. 点击**"创建应用程序"** → **"创建Worker"**
3. 为Worker选择名称（例如：`chatgpt-telegram-bot`）
4. 点击**"部署"**创建Worker
5. 在Worker控制台中点击**"编辑代码"**
6. 用[`dist/index.js`](../../dist/index.js)的内容替换默认代码
7. 点击**"保存并部署"**

您的Worker现在部署在：`https://your-worker-name.your-subdomain.workers.dev`

</details>

### 步骤4：配置环境变量

<details>
<summary>点击展开详细说明</summary>

1. 在Worker控制台中，转到**设置** → **变量**
2. 添加以下**环境变量**：

**必需变量：**
```bash
TELEGRAM_AVAILABLE_TOKENS = "your_telegram_bot_token"
OPENAI_API_KEY = "your_openai_api_key"
```

**推荐变量：**
```bash
LANGUAGE = "zh-cn"                 # 或 "en", "zh-hant", "pt"
CHAT_WHITE_LIST = "user_id1,user_id2"  # 可选：限制访问
AI_CHAT_PROVIDER = "openai"        # 默认AI提供商
```

**群组使用：**
```bash
GROUP_CHAT_BOT_ENABLE = "true"
CHAT_GROUP_WHITE_LIST = "group_id1,group_id2"  # 安全重要！
```

3. 添加变量后点击**"保存并部署"**

</details>

### 步骤5：设置KV存储

<details>
<summary>点击展开详细说明</summary>

1. 转到**Workers和Pages** → **KV**
2. 点击**"创建命名空间"**
3. 任意命名（例如：`chatgpt-storage`）
4. 返回您的Worker → **设置** → **变量**
5. 在**KV命名空间绑定**下，点击**"添加绑定"**
6. 设置：
   - **变量名称**：`DATABASE`
   - **KV命名空间**：选择您创建的命名空间
7. 点击**"保存并部署"**

</details>

### 步骤6：初始化机器人

<details>
<summary>点击展开详细说明</summary>

1. 访问您的Worker URL：`https://your-worker-name.your-subdomain.workers.dev/init`
2. 您应该看到成功消息确认：
   - Telegram webhook已设置
   - 机器人命令已配置
3. 如果看到错误，请检查您的环境变量

**此步骤的作用：**
- 设置Telegram webhook接收消息
- 配置机器人命令菜单
- 测试您的配置

</details>

### 步骤7：开始聊天！

<details>
<summary>点击展开详细说明</summary>

1. 在Telegram中使用您创建的用户名找到机器人
2. 发送`/start`开始
3. 发送`/new`开始新对话
4. 开始与您的AI助手聊天！

**常用命令：**
- `/help` - 显示所有可用命令
- `/new` - 开始新对话
- `/img prompt` - 生成图像
- `/setenv KEY=VALUE` - 配置设置
- `/system` - 显示当前配置

</details>

## 🖥️ 命令行部署

适合偏好命令行部署的开发者：

### 前置要求

```bash
# 安装Node.js和npm
npm install -g wrangler

# 登录Cloudflare
wrangler login
```

### 快速设置

```bash
# 克隆和设置
git clone https://github.com/SzeMeng76/ChatGPT-Telegram-Workers.git
cd ChatGPT-Telegram-Workers
npm install

# 配置
cp wrangler-example.toml wrangler.toml
# 编辑wrangler.toml文件配置

# 构建和部署
npm run build
npm run deploy
```

### 配置文件示例

创建`wrangler.toml`：

```toml
name = "chatgpt-telegram-workers"
main = "dist/index.js"
compatibility_date = "2024-01-01"

[vars]
TELEGRAM_AVAILABLE_TOKENS = "your_bot_token"
OPENAI_API_KEY = "your_openai_key"
LANGUAGE = "zh-cn"

[[kv_namespaces]]
binding = "DATABASE"
id = "your_kv_namespace_id"
```

## 🔧 高级配置

### 多机器人设置

```bash
TELEGRAM_AVAILABLE_TOKENS = "token1,token2,token3"
TELEGRAM_BOT_NAME = "Bot1,Bot2,Bot3"
```

### 多AI提供商设置

```bash
# 启用多个提供商
OPENAI_API_KEY = "sk-openai-key"
ANTHROPIC_API_KEY = "sk-ant-key"
GOOGLE_API_KEY = "google-key"

# 用户可以用 /setenv AI_CHAT_PROVIDER=claude 切换
```

### 安全配置

```bash
# 限制访问
CHAT_WHITE_LIST = "123456789,987654321"
CHAT_GROUP_WHITE_LIST = "-1001234567890"

# 锁定敏感设置
LOCK_USER_CONFIG_KEYS = "OPENAI_API_BASE,ANTHROPIC_API_BASE"
```

## 🐛 故障排除

### 常见问题

<details>
<summary><strong>机器人不响应</strong></summary>

**可能原因：**
- 机器人令牌错误
- Webhook设置不正确
- 环境变量缺失

**解决方案：**
1. 检查机器人令牌是否正确
2. 再次访问`/init`端点
3. 验证所有必需环境变量已设置
4. 检查Cloudflare控制台中的Worker日志

</details>

<details>
<summary><strong>API错误</strong></summary>

**可能原因：**
- API密钥无效
- 额度/配额不足
- 网络连接问题

**解决方案：**
1. 验证API密钥有效且有余额
2. 检查API密钥权限
3. 暂时尝试不同的AI提供商
4. 检查Cloudflare Worker日志了解具体错误

</details>

<details>
<summary><strong>机器人在群组中不工作</strong></summary>

**可能原因：**
- 群组不在白名单中
- 启用了隐私模式
- 大群组中机器人不是管理员

**解决方案：**
1. 将群组ID添加到`CHAT_GROUP_WHITE_LIST`
2. 在BotFather中禁用隐私模式：`/setprivacy` → `Disable`
3. 如果群组超过2000成员，设置机器人为管理员
4. 确保`GROUP_CHAT_BOT_ENABLE=true`

</details>

<details>
<summary><strong>高CPU使用率/Worker超时</strong></summary>

**可能原因：**
- AI SDK消耗过多CPU时间
- 复杂的工具/函数调用
- 大量对话历史

**解决方案：**
1. **推荐**：切换到[Docker部署](LOCAL.md)
2. 减少`MAX_HISTORY_LENGTH`
3. 禁用不必要的工具：`USE_TOOLS=[]`
4. 使用轻量AI模型
5. 考虑升级到Workers付费计划

</details>

<details>
<summary><strong>配置锁定错误</strong></summary>

**错误消息：** `Key XXX is locked`

**解决方案：**
从`LOCK_USER_CONFIG_KEYS`中删除该键，或将其设置为系统环境变量而不是用户配置。

</details>

### 调试模式

启用调试进行故障排除：

```bash
DEBUG_MODE = "true"
DEV_MODE = "true"
LOG_LEVEL = "debug"
```

### 获取帮助

1. **检查日志**：Cloudflare控制台 → Workers → 您的Worker → 日志
2. **GitHub Issues**：[报告错误或提问](https://github.com/SzeMeng76/ChatGPT-Telegram-Workers/issues)
3. **文档**：查看[配置指南](CONFIG.md)
4. **社区**：加入项目仓库的讨论

### 性能提示

1. **生产环境使用Docker**：更好的性能，无CPU限制
2. **优化历史记录**：减少`MAX_HISTORY_LENGTH`以加快响应
3. **选择高效模型**：`gpt-4o-mini`比`gpt-4`更快
4. **限制工具**：只启用实际使用的工具
5. **使用缓存**：启用`SAFE_MODE`以获得更好的缓存

---

## 📚 下一步

成功部署后：

1. **自定义机器人**：查看[配置指南](CONFIG.md)
2. **添加更多功能**：启用工具、MCP或自定义命令
3. **扩展规模**：考虑[Docker部署](LOCAL.md)以应对重度使用
4. **保护机器人**：设置适当的白名单和访问控制
5. **监控使用**：跟踪API成本和使用模式

**享受您的AI驱动的Telegram机器人！🤖✨**