# Cloudflare Workers Deployment Guide

> **Note**: For local or Docker deployment, see the [Local Deployment](LOCAL.md) documentation.
> 
> For Vercel deployment, check the [Vercel deployment guide](VERCEL.md).

## 📋 Table of Contents

- [Quick Deployment](#quick-deployment)
- [Manual Deployment](#manual-deployment)
- [CLI Deployment](#cli-deployment)
- [Troubleshooting](#troubleshooting)

## 🚀 Quick Deployment

### Prerequisites

Before you start, you'll need:
1. **Telegram Bot Token** - Get from [@BotFather](https://t.me/BotFather)
2. **OpenAI API Key** - Get from [OpenAI Platform](https://platform.openai.com/api-keys)
3. **Cloudflare Account** - Register at [Cloudflare](https://dash.cloudflare.com)

### One-Click Setup

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/SzeMeng76/ChatGPT-Telegram-Workers)

> ⚠️ **Important**: Due to AI SDK usage, CPU time is high. Not suitable for Cloudflare Workers free tier (10ms limit). Consider Docker deployment for heavy usage.

## 📖 Manual Deployment

### Step 1: Create Telegram Bot

<details>
<summary>Click to expand detailed instructions</summary>

1. Open Telegram and send `/start` to [@BotFather](https://t.me/BotFather)
2. Send `/newbot` command and give your bot a name
3. Choose a unique username ending with `_bot`
4. Copy the Token provided by BotFather
5. **Keep this token secure** - it's the key to your bot!

**Optional but recommended:**
- Send `/setprivacy` to BotFather, select your bot, then choose `Disable` for group functionality
- Send `/setcommands` to set up command menu (done automatically after deployment)

</details>

### Step 2: Get OpenAI API Key

<details>
<summary>Click to expand detailed instructions</summary>

1. Visit [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in to your account
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)
6. **Keep this key secure** - it provides access to your OpenAI account!

**Alternative AI Providers:**
- [Anthropic Claude](https://console.anthropic.com/) for `ANTHROPIC_API_KEY`
- [Google AI Studio](https://aistudio.google.com/) for `GOOGLE_API_KEY`
- [Azure OpenAI](https://azure.microsoft.com/en-us/products/ai-services/openai-service) for Azure configuration

</details>

### Step 3: Deploy to Cloudflare Workers

<details>
<summary>Click to expand detailed instructions</summary>

1. Go to [Cloudflare Workers Dashboard](https://dash.cloudflare.com/?to=/:account/workers)
2. Click **"Create Application"** → **"Create Worker"**
3. Choose a name for your worker (e.g., `chatgpt-telegram-bot`)
4. Click **"Deploy"** to create the worker
5. Click **"Edit Code"** in your worker dashboard
6. Replace the default code with the content from [`dist/index.js`](../../dist/index.js)
7. Click **"Save and Deploy"**

Your worker is now deployed at: `https://your-worker-name.your-subdomain.workers.dev`

</details>

### Step 4: Configure Environment Variables

<details>
<summary>Click to expand detailed instructions</summary>

1. In your worker dashboard, go to **Settings** → **Variables**
2. Add the following **Environment Variables**:

**Required Variables:**
```bash
TELEGRAM_AVAILABLE_TOKENS = "your_telegram_bot_token"
OPENAI_API_KEY = "your_openai_api_key"
```

**Recommended Variables:**
```bash
LANGUAGE = "en"                    # or "zh-cn", "zh-hant", "pt"
CHAT_WHITE_LIST = "user_id1,user_id2"  # Optional: restrict access
AI_CHAT_PROVIDER = "openai"        # Default AI provider
```

**For Group Usage:**
```bash
GROUP_CHAT_BOT_ENABLE = "true"
CHAT_GROUP_WHITE_LIST = "group_id1,group_id2"  # Important for security!
```

3. Click **"Save and Deploy"** after adding variables

</details>

### Step 5: Set Up KV Storage

<details>
<summary>Click to expand detailed instructions</summary>

1. Go to **Workers & Pages** → **KV**
2. Click **"Create a namespace"**
3. Name it anything (e.g., `chatgpt-storage`)
4. Go back to your worker → **Settings** → **Variables**
5. Under **KV Namespace Bindings**, click **"Add binding"**
6. Set:
   - **Variable name**: `DATABASE`
   - **KV namespace**: Select the namespace you created
7. Click **"Save and Deploy"**

</details>

### Step 6: Initialize the Bot

<details>
<summary>Click to expand detailed instructions</summary>

1. Visit your worker URL: `https://your-worker-name.your-subdomain.workers.dev/init`
2. You should see a success message confirming:
   - Telegram webhook was set
   - Bot commands were configured
3. If you see errors, check your environment variables

**What this does:**
- Sets up Telegram webhook to receive messages
- Configures bot commands menu
- Tests your configuration

</details>

### Step 7: Start Chatting!

<details>
<summary>Click to expand detailed instructions</summary>

1. Find your bot on Telegram using the username you created
2. Send `/start` to begin
3. Send `/new` to start a new conversation
4. Start chatting with your AI assistant!

**Useful Commands:**
- `/help` - Show all available commands
- `/new` - Start fresh conversation
- `/img prompt` - Generate images
- `/setenv KEY=VALUE` - Configure settings
- `/system` - Show current configuration

</details>

## 🖥️ CLI Deployment

For developers who prefer command-line deployment:

### Prerequisites

```bash
# Install Node.js and npm
npm install -g wrangler

# Login to Cloudflare
wrangler login
```

### Quick Setup

```bash
# Clone and setup
git clone https://github.com/SzeMeng76/ChatGPT-Telegram-Workers.git
cd ChatGPT-Telegram-Workers
npm install

# Configure
cp wrangler-example.toml wrangler.toml
# Edit wrangler.toml with your configuration

# Build and deploy
npm run build
npm run deploy
```

### Configuration File Example

Create `wrangler.toml`:

```toml
name = "chatgpt-telegram-workers"
main = "dist/index.js"
compatibility_date = "2024-01-01"

[vars]
TELEGRAM_AVAILABLE_TOKENS = "your_bot_token"
OPENAI_API_KEY = "your_openai_key"
LANGUAGE = "en"

[[kv_namespaces]]
binding = "DATABASE"
id = "your_kv_namespace_id"
```

## 🔧 Advanced Configuration

### Multiple Bots Setup

```bash
TELEGRAM_AVAILABLE_TOKENS = "token1,token2,token3"
TELEGRAM_BOT_NAME = "Bot1,Bot2,Bot3"
```

### Multi-AI Provider Setup

```bash
# Enable multiple providers
OPENAI_API_KEY = "sk-openai-key"
ANTHROPIC_API_KEY = "sk-ant-key"
GOOGLE_API_KEY = "google-key"

# Users can switch with /setenv AI_CHAT_PROVIDER=claude
```

### Security Configuration

```bash
# Restrict access
CHAT_WHITE_LIST = "123456789,987654321"
CHAT_GROUP_WHITE_LIST = "-1001234567890"

# Lock sensitive settings
LOCK_USER_CONFIG_KEYS = "OPENAI_API_BASE,ANTHROPIC_API_BASE"
```

## 🐛 Troubleshooting

### Common Issues

<details>
<summary><strong>Bot not responding</strong></summary>

**Possible causes:**
- Incorrect bot token
- Webhook not set properly
- Environment variables missing

**Solutions:**
1. Check bot token is correct
2. Visit `/init` endpoint again
3. Verify all required environment variables are set
4. Check worker logs in Cloudflare dashboard

</details>

<details>
<summary><strong>API errors</strong></summary>

**Possible causes:**
- Invalid API keys
- Insufficient credits/quota
- Network connectivity issues

**Solutions:**
1. Verify API keys are valid and have credits
2. Check API key permissions
3. Try different AI provider temporarily
4. Check Cloudflare worker logs for specific errors

</details>

<details>
<summary><strong>Bot not working in groups</strong></summary>

**Possible causes:**
- Group not in whitelist
- Privacy mode enabled
- Bot not admin in large groups

**Solutions:**
1. Add group ID to `CHAT_GROUP_WHITE_LIST`
2. Disable privacy mode in BotFather: `/setprivacy` → `Disable`
3. Make bot admin if group has >2000 members
4. Ensure `GROUP_CHAT_BOT_ENABLE=true`

</details>

<details>
<summary><strong>High CPU usage / Worker timeout</strong></summary>

**Possible causes:**
- AI SDK consuming too much CPU time
- Complex tool/function calls
- Large conversation history

**Solutions:**
1. **Recommended**: Switch to [Docker deployment](LOCAL.md)
2. Reduce `MAX_HISTORY_LENGTH`
3. Disable unnecessary tools: `USE_TOOLS=[]`
4. Use lighter AI models
5. Consider upgrading to Workers Paid plan

</details>

<details>
<summary><strong>Configuration locked errors</strong></summary>

**Error message:** `Key XXX is locked`

**Solution:**
Remove the key from `LOCK_USER_CONFIG_KEYS` or set it as system environment variable instead of user configuration.

</details>

### Debug Mode

Enable debugging for troubleshooting:

```bash
DEBUG_MODE = "true"
DEV_MODE = "true"
LOG_LEVEL = "debug"
```

### Getting Help

1. **Check logs**: Cloudflare Dashboard → Workers → Your Worker → Logs
2. **GitHub Issues**: [Report bugs or ask questions](https://github.com/SzeMeng76/ChatGPT-Telegram-Workers/issues)
3. **Documentation**: Review [Configuration Guide](CONFIG.md)
4. **Community**: Join discussions in project repository

### Performance Tips

1. **Use Docker for production**: Better performance and no CPU limits
2. **Optimize history**: Reduce `MAX_HISTORY_LENGTH` for faster responses
3. **Choose efficient models**: `gpt-4o-mini` is faster than `gpt-4`
4. **Limit tools**: Only enable tools you actually use
5. **Use caching**: Enable `SAFE_MODE` for better caching

---

## 📚 Next Steps

After successful deployment:

1. **Customize your bot**: Review [Configuration Guide](CONFIG.md)
2. **Add more features**: Enable tools, MCP, or custom commands
3. **Scale up**: Consider [Docker deployment](LOCAL.md) for heavy usage
4. **Secure your bot**: Set up proper whitelists and access controls
5. **Monitor usage**: Keep track of API costs and usage patterns

**Enjoy your new AI-powered Telegram bot! 🤖✨**