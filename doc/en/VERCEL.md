# Vercel Deployment Guide

This comprehensive guide covers deploying your ChatGPT Telegram Workers bot to Vercel, including setup, configuration, and best practices.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Quick Deploy](#quick-deploy)
- [Manual Deployment](#manual-deployment)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## 🌟 Overview

Vercel provides an excellent serverless platform for deploying this bot with the following advantages:

### ✅ Advantages
- **Free Tier**: Generous limits for personal projects
- **Auto-scaling**: Automatic scaling based on demand
- **Global CDN**: Fast response times worldwide
- **GitHub Integration**: Seamless CI/CD workflows
- **Zero Configuration**: Works out of the box
- **Built-in Analytics**: Monitor performance and usage

### ⚠️ Limitations
- **External Database Required**: Need Redis/PostgreSQL for persistence
- **Function Timeout**: Limited execution time per request
- **Cold Starts**: Initial request delay after inactivity
- **Memory Limits**: 1GB RAM limit per function

---

## 📋 Prerequisites

Before starting, ensure you have:

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Fork or clone this repository
3. **Redis Database**: Set up [Upstash Redis](https://upstash.com) (free tier available)
4. **Telegram Bot**: Create bot via [@BotFather](https://t.me/BotFather)
5. **AI Provider Keys**: OpenAI, Anthropic, etc.

---

## 🚀 Quick Deploy

### One-Click Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FTBXark%2FChatGPT-Telegram-Workers&env=UPSTASH_REDIS_REST_URL,UPSTASH_REDIS_REST_TOKEN,VERCEL_DOMAIN,TELEGRAM_AVAILABLE_TOKENS&project-name=chatgpt-telegram-workers&repository-name=ChatGPT-Telegram-Workers&demo-title=ChatGPT-Telegram-Workers&demo-description=Deploy%20your%20own%20Telegram%20ChatGPT%20bot%20on%20Vercel%20with%20ease.&demo-url=https%3A%2F%2Fchatgpt-telegram-workers.vercel.app)

### Required Environment Variables

During deployment, you'll be prompted to set these variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL | ✅ Yes |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis Token | ✅ Yes |
| `VERCEL_DOMAIN` | Your Vercel app domain | ✅ Yes |
| `TELEGRAM_AVAILABLE_TOKENS` | Telegram bot tokens (comma-separated) | ✅ Yes |
| `OPENAI_API_KEY` | OpenAI API key | ❌ Optional |
| `ANTHROPIC_API_KEY` | Anthropic API key | ❌ Optional |

---

## 🔧 Manual Deployment

### Step 1: Install Vercel CLI

```bash
# Install globally
npm install -g vercel

# Or use npx
npx vercel --version
```

### Step 2: Prepare Your Project

```bash
# Clone the repository
git clone https://github.com/TBXark/ChatGPT-Telegram-Workers.git
cd ChatGPT-Telegram-Workers

# Install dependencies
npm install

# Build for Vercel
npm run build:vercel

# Convert wrangler.toml to Vercel environment variables
npm run prepare:vercel
```

### Step 3: Configure Environment

Create a `.env.local` file in your project root:

```bash
# Database Configuration
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# Vercel Configuration
VERCEL_DOMAIN=your-app.vercel.app

# Telegram Configuration
TELEGRAM_AVAILABLE_TOKENS=bot_token_1,bot_token_2

# AI Provider Keys
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key

# Optional: Additional Configuration
NODE_ENV=production
LOG_LEVEL=info
```

### Step 4: Deploy to Vercel

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Or deploy with specific environment
vercel deploy --prod --env-file .env.local
```

---

## ⚙️ Configuration

### Database Setup (Upstash Redis)

1. **Create Redis Database**:
   - Visit [Upstash Console](https://console.upstash.com)
   - Create new Redis database
   - Choose region closest to your users
   - Copy REST URL and token

2. **Configure Redis in Vercel**:
   ```bash
   # Set environment variables
   vercel env add UPSTASH_REDIS_REST_URL
   vercel env add UPSTASH_REDIS_REST_TOKEN
   ```

### Custom Domain Setup

1. **Add Domain in Vercel Dashboard**:
   - Go to Project Settings → Domains
   - Add your custom domain
   - Configure DNS records

2. **Update Environment Variables**:
   ```bash
   vercel env add VERCEL_DOMAIN production
   # Enter: your-domain.com
   ```

### Webhook Configuration

After deployment, set up the Telegram webhook:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://your-app.vercel.app/telegram"}'
```

---

## 🏗️ Advanced Configuration

### Custom Build Configuration

Create `vercel.json` in your project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/adapter/vercel/index.js",
      "use": "@vercel/node",
      "config": {
        "maxDuration": 30,
        "memory": 1024
      }
    }
  ],
  "routes": [
    {
      "src": "/telegram",
      "dest": "/src/adapter/vercel/index.js"
    },
    {
      "src": "/health",
      "dest": "/src/adapter/vercel/health.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Environment-Specific Configuration

Create different configurations for staging and production:

```bash
# Staging environment
vercel env add OPENAI_API_KEY preview
vercel env add REDIS_URL preview

# Production environment  
vercel env add OPENAI_API_KEY production
vercel env add REDIS_URL production
```

### Function Configuration

Optimize function performance in `vercel.json`:

```json
{
  "functions": {
    "src/adapter/vercel/*.js": {
      "maxDuration": 30,
      "memory": 1024,
      "runtime": "nodejs18.x"
    }
  }
}
```

---

## 🔍 Troubleshooting

### Common Issues

#### 1. Function Timeout Errors

**Problem**: Functions timing out during AI responses

**Solutions**:
```javascript
// Optimize timeout handling
export const config = {
  maxDuration: 30, // Maximum allowed on free tier
}

// Stream responses for long operations
async function handleLongOperation() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}
```

#### 2. Cold Start Issues

**Problem**: Slow response on first request

**Solutions**:
- Implement keep-alive mechanism
- Use Vercel's Edge Functions for faster cold starts
- Optimize bundle size

```javascript
// Keep function warm
setInterval(() => {
  fetch(process.env.VERCEL_DOMAIN + '/health');
}, 5 * 60 * 1000); // Every 5 minutes
```

#### 3. Redis Connection Issues

**Problem**: Too many Redis connections

**Solutions**:
```javascript
// Use connection pooling
import { createClient } from '@upstash/redis';

const redis = createClient({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
  retry: {
    retries: 3,
    initialDelayMs: 100
  }
});

// Always close connections
try {
  await redis.set('key', 'value');
} finally {
  // Redis HTTP client doesn't need explicit closing
}
```

#### 4. Environment Variable Issues

**Problem**: Variables not loading correctly

**Solutions**:
```bash
# Check current environment variables
vercel env ls

# Pull environment variables locally
vercel env pull .env.local

# Add missing variables
vercel env add VARIABLE_NAME production
```

### Debug Mode

Enable debug logging:

```javascript
// In your Vercel function
export default function handler(req, res) {
  if (process.env.DEBUG === 'true') {
    console.log('Request:', req.method, req.url);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
  }
  
  // Your handler logic
}
```

---

## 🏆 Best Practices

### Performance Optimization

1. **Bundle Size Optimization**:
   ```bash
   # Analyze bundle size
   npm run build:vercel -- --analyze
   
   # Use dynamic imports
   const heavyLibrary = await import('./heavy-library');
   ```

2. **Caching Strategy**:
   ```javascript
   // Cache responses in Redis
   const cacheKey = `response:${userId}:${messageHash}`;
   const cached = await redis.get(cacheKey);
   
   if (cached) {
     return JSON.parse(cached);
   }
   
   const response = await generateResponse();
   await redis.setex(cacheKey, 3600, JSON.stringify(response));
   ```

3. **Edge Functions**:
   ```javascript
   // Use Edge Runtime for faster cold starts
   export const config = {
     runtime: 'edge',
   }
   ```

### Security Best Practices

1. **Environment Variables**:
   - Never commit secrets to repository
   - Use different keys for staging/production
   - Rotate keys regularly

2. **Request Validation**:
   ```javascript
   // Validate Telegram webhook
   import crypto from 'crypto';
   
   function validateTelegramWebhook(body, signature) {
     const hash = crypto
       .createHmac('sha256', process.env.TELEGRAM_BOT_TOKEN)
       .update(body)
       .digest('hex');
     
     return `sha256=${hash}` === signature;
   }
   ```

3. **Rate Limiting**:
   ```javascript
   // Implement rate limiting with Redis
   const rateLimitKey = `rate_limit:${userId}`;
   const requests = await redis.incr(rateLimitKey);
   
   if (requests === 1) {
     await redis.expire(rateLimitKey, 60); // 1 minute window
   }
   
   if (requests > 10) {
     return res.status(429).json({ error: 'Rate limit exceeded' });
   }
   ```

### Monitoring and Analytics

1. **Enable Vercel Analytics**:
   ```bash
   # Install analytics package
   npm install @vercel/analytics
   ```

2. **Custom Metrics**:
   ```javascript
   // Track custom metrics
   import { track } from '@vercel/analytics';
   
   track('message_processed', {
     userId,
     messageType,
     processingTime: Date.now() - startTime
   });
   ```

3. **Health Checks**:
   ```javascript
   // Create health check endpoint
   export default async function handler(req, res) {
     try {
       // Check Redis connection
       await redis.ping();
       
       // Check AI provider
       const testResponse = await openai.models.list();
       
       res.status(200).json({
         status: 'healthy',
         timestamp: new Date().toISOString(),
         checks: {
           redis: 'ok',
           openai: 'ok'
         }
       });
     } catch (error) {
       res.status(500).json({
         status: 'unhealthy',
         error: error.message
       });
     }
   }
   ```

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Functions](https://vercel.com/docs/functions)
- [Upstash Redis](https://docs.upstash.com/redis)
- [Telegram Bot API](https://core.telegram.org/bots/api)

---

## 🚀 Next Steps

After successful deployment:

1. **Monitor Performance**: Use Vercel Analytics and logs
2. **Set Up Alerts**: Configure notifications for errors
3. **Optimize Costs**: Monitor usage and optimize functions
4. **Scale Up**: Consider Pro plan for higher limits
5. **Custom Domain**: Set up your own domain for branding

**Need help?** Check our [troubleshooting section](#troubleshooting) or create an issue in the repository.