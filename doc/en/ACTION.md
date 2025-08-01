# GitHub Actions Automation Guide

This guide covers setting up automated deployment and maintenance workflows for your ChatGPT Telegram Workers bot using GitHub Actions.

## 📋 Table of Contents

- [Quick Setup](#quick-setup)
- [Deployment Workflows](#deployment-workflows)
- [Maintenance Automation](#maintenance-automation)
- [Security Best Practices](#security-best-practices)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Setup

### Prerequisites

1. **Complete Manual Deployment**: Follow the [Deployment Guide](DEPLOY.md) to deploy once manually
2. **Fork Repository**: Fork this repository to your GitHub account
3. **Choose Deployment Target**: Select your preferred platform (Cloudflare Workers, Vercel, Docker)

---

## ⚙️ Deployment Workflows

### Cloudflare Workers Deployment

#### Step 1: Create Cloudflare API Token

1. **Navigate to Cloudflare Dashboard**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
   - Click "Create Token"

2. **Configure Token Permissions**
   - Template: "Edit Cloudflare Workers"
   - Zone Resources: Include specific zone or all zones
   - Account Resources: Include your account

3. **Token Permissions Required**:
   ```
   Zone:Zone Settings:Read
   Zone:Zone:Read
   Account:Cloudflare Workers:Edit
   ```

#### Step 2: Set GitHub Secrets

Navigate to your repository's **Settings → Secrets and Variables → Actions** and add:

| Secret Name | Description | Required |
|-------------|-------------|----------|
| `CF_API_TOKEN` | Cloudflare API Token | ✅ Yes |
| `CF_ACCOUNT_ID` | Cloudflare Account ID | ✅ Yes |
| `WRANGLER_TOML` | Complete wrangler.toml content | ✅ Yes |
| `CF_WORKERS_DOMAIN` | Your *.workers.dev domain (optional) | ❌ No |

#### Step 3: Create Workflow File

Create `.github/workflows/deploy-cloudflare.yml`:

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build project
        run: npm run build
        
      - name: Create wrangler.toml
        run: echo "${{ secrets.WRANGLER_TOML }}" > wrangler.toml
        
      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          accountId: ${{ secrets.CF_ACCOUNT_ID }}
          command: deploy
```

---

### Vercel Deployment

#### Required Secrets for Vercel

| Secret Name | Description |
|-------------|-------------|
| `VERCEL_ORG_ID` | Vercel Organization ID |
| `VERCEL_PROJECT_ID` | Vercel Project ID |
| `VERCEL_TOKEN` | Vercel API Token |
| `UPSTASH_REDIS_REST_URL` | Redis URL |
| `UPSTASH_REDIS_REST_TOKEN` | Redis Token |

#### Vercel Workflow

Create `.github/workflows/deploy-vercel.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
        
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
        
      - name: Build Project Artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
        
      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

### Docker Deployment

#### Docker Registry Deployment

Create `.github/workflows/docker-build.yml`:

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [ main, master ]
    tags: [ 'v*' ]
  workflow_dispatch:

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
      
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Docker Buildx
        uses: docker/setup-buildx-action@v3
        
      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
          
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

---

## 🔄 Maintenance Automation

### Auto-sync with Upstream

Create `.github/workflows/sync-upstream.yml`:

```yaml
name: Sync with Upstream

on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          fetch-depth: 0
          
      - name: Add upstream remote
        run: |
          git remote add upstream https://github.com/TBXark/ChatGPT-Telegram-Workers.git
          git fetch upstream
          
      - name: Merge upstream changes
        run: |
          git checkout main
          git merge upstream/master --no-edit
          
      - name: Push changes
        run: git push origin main
        
      - name: Create Pull Request
        if: failure()
        uses: peter-evans/create-pull-request@v5
        with:
          title: 'Auto-sync with upstream'
          body: 'Automated sync with upstream repository'
          branch: auto-sync-upstream
```

### Dependency Updates

Create `.github/workflows/update-dependencies.yml`:

```yaml
name: Update Dependencies

on:
  schedule:
    - cron: '0 3 * * 1'  # Weekly on Monday at 3 AM UTC
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Update dependencies
        run: |
          npx npm-check-updates -u
          npm install
          
      - name: Run tests
        run: npm test
        
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v5
        with:
          title: 'chore: update dependencies'
          body: 'Automated dependency updates'
          branch: update-dependencies
```

---

## 🔒 Security Best Practices

### Secret Management

1. **Use GitHub Secrets**: Never hardcode sensitive information
2. **Rotate Tokens Regularly**: Update API tokens every 90 days
3. **Minimal Permissions**: Grant only necessary permissions to tokens
4. **Environment Separation**: Use different secrets for staging/production

### Workflow Security

```yaml
# Example secure workflow configuration
permissions:
  contents: read
  packages: write
  id-token: write  # For OIDC authentication

env:
  # Environment variables for security
  NODE_OPTIONS: '--max-old-space-size=4096'
  FORCE_COLOR: 0
```

### Branch Protection

Configure branch protection rules:

1. **Settings → Branches → Add rule**
2. **Branch name pattern**: `main` or `master`
3. **Requirements**:
   - Require pull request reviews
   - Require status checks to pass
   - Require branches to be up to date
   - Include administrators

---

## 🎯 Advanced Workflows

### Multi-Environment Deployment

Create `.github/workflows/deploy-multi-env.yml`:

```yaml
name: Multi-Environment Deploy

on:
  push:
    branches:
      - main
      - develop
      - staging

jobs:
  deploy:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        environment:
          - name: staging
            branch: develop
            domain: staging.example.com
          - name: production
            branch: main
            domain: bot.example.com
            
    environment: ${{ matrix.environment.name }}
    
    if: github.ref_name == matrix.environment.branch
    
    steps:
      - name: Deploy to ${{ matrix.environment.name }}
        run: |
          echo "Deploying to ${{ matrix.environment.name }}"
          echo "Domain: ${{ matrix.environment.domain }}"
```

### Health Check and Monitoring

Create `.github/workflows/health-check.yml`:

```yaml
name: Health Check

on:
  schedule:
    - cron: '*/15 * * * *'  # Every 15 minutes
  workflow_dispatch:

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - name: Check Bot Status
        run: |
          response=$(curl -s -o /dev/null -w "%{http_code}" https://your-bot-domain.com/health)
          if [ $response -ne 200 ]; then
            echo "Health check failed with status: $response"
            exit 1
          fi
          
      - name: Notify on failure
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: failure
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 🔍 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check Node.js version compatibility
node --version
npm --version

# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### Deployment Failures

**Cloudflare Workers:**
- Verify API token permissions
- Check account ID and zone ID
- Ensure wrangler.toml is properly formatted

**Vercel:**
- Verify project and organization IDs
- Check environment variables
- Ensure build command is correct

**Docker:**
- Verify registry authentication
- Check Dockerfile syntax
- Ensure proper platform targeting

#### Secret Issues

1. **Invalid Secrets**: Verify secret names match exactly
2. **Permission Denied**: Check token permissions
3. **Expired Tokens**: Rotate and update tokens

### Debug Mode

Enable debug logging in workflows:

```yaml
env:
  ACTIONS_STEP_DEBUG: true
  ACTIONS_RUNNER_DEBUG: true
```

### Workflow Monitoring

1. **GitHub Actions Tab**: Monitor workflow runs
2. **Status Badges**: Add status badges to README
3. **Notifications**: Set up email/Slack notifications

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Cloudflare Workers Actions](https://github.com/cloudflare/wrangler-action)
- [Vercel Actions](https://vercel.com/guides/how-can-i-use-github-actions-with-vercel)
- [Docker Build Push Action](https://github.com/docker/build-push-action)

---

**Need help with GitHub Actions?** Check the [troubleshooting section](#troubleshooting) or create an issue in the repository.
