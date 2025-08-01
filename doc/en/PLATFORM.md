# Supported Deployment Platforms

This guide covers all supported deployment platforms for the ChatGPT Telegram Workers bot, with detailed instructions and platform-specific considerations.

## 📋 Platform Overview

| Platform | Difficulty | Cost | Performance | Recommended For |
|----------|------------|------|-------------|-----------------|
| [Docker](#docker-recommended) | ⭐⭐ | Free/Paid | ⭐⭐⭐⭐⭐ | Production, Heavy Usage |
| [Cloudflare Workers](#cloudflare-workers) | ⭐ | Free/Paid | ⭐⭐ | Light Usage, Beginners |
| [Vercel](#vercel) | ⭐⭐ | Free/Paid | ⭐⭐⭐ | Serverless, Medium Usage |
| [Railway](#railway) | ⭐⭐ | Paid | ⭐⭐⭐⭐ | Easy Docker Deploy |
| [Render](#render) | ⭐⭐ | Free/Paid | ⭐⭐⭐ | Simple Docker Deploy |
| [Koyeb](#koyeb) | ⭐⭐ | Free/Paid | ⭐⭐⭐ | Global Edge Deployment |

## 🐳 Docker (Recommended)

**Best for**: Production environments, heavy usage, full control

### Advantages
- ✅ No CPU time limits
- ✅ Full feature support
- ✅ Easy to scale and monitor
- ✅ Works with any cloud provider
- ✅ Complete isolation and security

### Quick Start
```bash
docker pull szemeng76/chatgpt-telegram-workers:latest
docker run -d \
  --name chatgpt-telegram-bot \
  -p 8787:8787 \
  -v $(pwd)/config.json:/app/config.json:ro \
  -v $(pwd)/wrangler.toml:/app/config.toml:ro \
  szemeng76/chatgpt-telegram-workers:latest
```

**📖 Full Guide**: [Docker Deployment Documentation](LOCAL.md)

---

## ☁️ Cloudflare Workers

**Best for**: Beginners, light usage, serverless

### Advantages
- ✅ Free tier available
- ✅ Global edge network
- ✅ Easy deployment
- ✅ Built-in KV storage

### Limitations
- ⚠️ CPU time limits (10ms free, 30s paid)
- ⚠️ Not suitable for AI SDK (high CPU usage)
- ⚠️ Limited to 60s execution time

### Quick Deploy
[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/SzeMeng76/ChatGPT-Telegram-Workers)

**📖 Full Guide**: [Cloudflare Workers Deployment](DEPLOY.md)

---

## ▲ Vercel

**Best for**: Serverless deployment, medium usage

### Advantages
- ✅ Free tier with generous limits
- ✅ Automatic scaling
- ✅ Built-in analytics
- ✅ GitHub integration

### Limitations
- ⚠️ Need external database (Redis/PostgreSQL)
- ⚠️ Function timeout limits
- ⚠️ Cold start delays

### Quick Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SzeMeng76/ChatGPT-Telegram-Workers&env=UPSTASH_REDIS_REST_URL,UPSTASH_REDIS_REST_TOKEN,VERCEL_DOMAIN,TELEGRAM_AVAILABLE_TOKENS&project-name=chatgpt-telegram-workers&repository-name=ChatGPT-Telegram-Workers)

### Manual Setup
```bash
npm install -g vercel
npm install
npm run build:vercel
npm run prepare:vercel  # Convert wrangler.toml to Vercel env
vercel deploy --prod
```

**Required Environment Variables:**
```bash
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
VERCEL_DOMAIN=your-app.vercel.app
TELEGRAM_AVAILABLE_TOKENS=your_bot_tokens
OPENAI_API_KEY=your_openai_key
```

**📖 Full Guide**: [Vercel Deployment](VERCEL.md)

---

## 🚂 Railway

**Best for**: Easy Docker deployment with managed infrastructure

### Advantages
- ✅ Simple Docker deployment
- ✅ Automatic HTTPS
- ✅ Built-in monitoring
- ✅ GitHub integration

### Quick Deploy
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/chatgpt-telegram-workers)

### Manual Setup
1. Connect your GitHub repository to Railway
2. Add environment variables from `wrangler.toml`
3. Deploy automatically

**Estimated Cost**: ~$5-20/month depending on usage

---

## 🎨 Render

**Best for**: Simple cloud deployment with free tier

### Advantages
- ✅ Free tier available
- ✅ Automatic deploys from Git
- ✅ Built-in SSL
- ✅ Easy to use

### Setup Instructions

1. **Create Web Service**
   - Connect your GitHub repository
   - Choose "Docker" as environment
   - Set build command: `docker build -t app .`
   - Set start command: `docker run -p 10000:8787 app`

2. **Environment Variables**
   Add all variables from your `wrangler.toml` file

3. **Configuration**
   Create `render.yaml`:
   ```yaml
   services:
     - type: web
       name: chatgpt-telegram-workers
       env: docker
       plan: free
       buildCommand: docker build -t app .
       startCommand: docker run -p 10000:8787 app
       envVars:
         - key: TELEGRAM_AVAILABLE_TOKENS
           value: your_bot_token
         - key: OPENAI_API_KEY
           value: your_openai_key
   ```

**Free Tier Limits**: 750 hours/month, sleeps after 15min inactivity

---

## 🌐 Koyeb

**Best for**: Global edge deployment with automatic scaling

### Advantages
- ✅ Global edge locations
- ✅ Free tier available
- ✅ Automatic scaling
- ✅ Built-in load balancing

### Quick Deploy
[![Deploy to Koyeb](https://www.koyeb.com/static/images/deploy/button.svg)](https://app.koyeb.com/deploy?name=chatgpt-telegram-workers&type=docker&image=szemeng76/chatgpt-telegram-workers:latest
&instance_type=free&instances_min=0&autoscaling_sleep_idle_delay=300&ports=8787%3Bhttp%3B%2F&env%5BTELEGRAM_AVAILABLE_TOKENS%5D=&env%5BOPENAI_API_KEY%5D=)

### Manual Setup

**Webhook Mode:**
1. Create service → Web Service → Docker
2. Image: `szemeng76/chatgpt-telegram-workers:latest`
3. Add environment variables
4. Set port: `8787`
5. Deploy and copy public URL
6. Update `config.json` with the URL and redeploy

**Polling Mode (Recommended):**
1. Create service → Worker → Docker
2. Image: `szemeng76/chatgpt-telegram-workers:latest`
3. Set `config.json` mode to `polling`
4. No domain needed

---

## 🔧 Platform-Specific Configurations

### Docker Compose (Any Cloud Provider)
```yaml
version: '3.8'
services:
  chatgpt-telegram-bot:
    image: szemeng76/chatgpt-telegram-workers:latest
    ports:
      - "8787:8787"
    volumes:
      - ./config.json:/app/config.json:ro
      - ./wrangler.toml:/app/config.toml:ro
    restart: unless-stopped
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: chatgpt-telegram-workers
spec:
  replicas: 1
  selector:
    matchLabels:
      app: chatgpt-telegram-workers
  template:
    metadata:
      labels:
        app: chatgpt-telegram-workers
    spec:
      containers:
      - name: bot
        image: szemeng76/chatgpt-telegram-workers:latest
        ports:
        - containerPort: 8787
        env:
        - name: TELEGRAM_AVAILABLE_TOKENS
          value: "your_bot_token"
        - name: OPENAI_API_KEY
          value: "your_openai_key"
```

---

## 🏗️ Platform Migration Guide

### From Cloudflare Workers to Docker
1. Export your KV data (if needed)
2. Create `config.json` and `wrangler.toml`
3. Choose Docker platform and deploy
4. Update webhook URL if using webhook mode

### From Vercel to Docker
1. Export environment variables to `wrangler.toml`
2. Create `config.json` with database settings
3. Migrate database data if needed
4. Deploy Docker container

---

## 📊 Platform Comparison

### Performance Comparison
| Platform | Cold Start | Concurrent Users | AI SDK Support | Database |
|----------|------------|------------------|----------------|----------|
| Docker | None | High | ✅ Full | Any |
| Cloudflare Workers | ~10ms | Medium | ❌ Limited | KV Only |
| Vercel | ~100-500ms | Medium | ✅ Full | External |
| Railway | ~30s | High | ✅ Full | Built-in |
| Render | ~30s | Medium | ✅ Full | External |
| Koyeb | ~30s | Medium | ✅ Full | External |

### Cost Comparison (Monthly)
| Platform | Free Tier | Paid Plans | Notes |
|----------|-----------|------------|-------|
| Docker (VPS) | $0-5 | $5-50+ | Depends on provider |
| Cloudflare Workers | $0 | $5+ | CPU time limits |
| Vercel | $0 | $20+ | Function invocations |
| Railway | $0 | $5+ | Usage-based |
| Render | $0 | $7+ | Instance hours |
| Koyeb | $0 | $5+ | Instance hours |

---

## 🎯 Deployment Recommendations

### For Beginners
1. **Start with**: Cloudflare Workers (if light usage)
2. **Upgrade to**: Docker on Railway/Render when needed

### For Production
1. **Recommended**: Docker on VPS/Cloud (DigitalOcean, AWS, GCP)
2. **Alternative**: Railway or Render for managed solution

### For Enterprise
1. **Recommended**: Kubernetes cluster
2. **Alternative**: Docker Swarm with load balancer

---

## 🔍 Troubleshooting by Platform

### Cloudflare Workers Issues
- **CPU timeout**: Switch to Docker deployment
- **Memory limits**: Reduce history length, disable tools
- **KV write limits**: Disable debug mode

### Vercel Issues
- **Function timeout**: Use smaller models, reduce processing
- **Cold starts**: Consider keeping functions warm
- **Database connection**: Use connection pooling

### Docker Issues
- **Container crashes**: Check logs, verify config files
- **Network issues**: Verify port mapping and firewall
- **Performance**: Increase memory limits, use Redis

---

## 📚 Additional Resources

- [Configuration Guide](CONFIG.md) - Detailed configuration options
- [Local Development](LOCAL.md) - Docker and local setup
- [GitHub Actions](ACTION.md) - Automated deployment

**Need help choosing a platform?** Consider your:
- **Usage volume**: High → Docker, Medium → Vercel/Railway, Low → Cloudflare
- **Technical expertise**: Beginner → Cloudflare/Railway, Advanced → Docker
- **Budget**: Free → Cloudflare/Vercel, Paid → Railway/Docker
- **Features needed**: Full features → Docker, Basic → Cloudflare