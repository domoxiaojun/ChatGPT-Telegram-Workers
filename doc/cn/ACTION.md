# GitHub Actions 自动化指南

本指南涵盖如何使用 GitHub Actions 为您的 ChatGPT Telegram Workers 机器人设置自动化部署和维护工作流。

## 📋 目录

- [快速设置](#快速设置)
- [部署工作流](#部署工作流)
- [维护自动化](#维护自动化)
- [安全最佳实践](#安全最佳实践)
- [故障排除](#故障排除)

---

## 🚀 快速设置

### 前置条件

1. **完成手动部署**: 按照[部署指南](DEPLOY.md)至少手动部署一次
2. **Fork 仓库**: 将此仓库 Fork 到您的 GitHub 账户
3. **选择部署目标**: 选择您偏好的平台（Cloudflare Workers、Vercel、Docker）

---

## ⚙️ 部署工作流

### Cloudflare Workers 部署

#### 步骤 1: 创建 Cloudflare API Token

1. **导航到 Cloudflare 控制台**
   - 访问 [Cloudflare 控制台](https://dash.cloudflare.com/profile/api-tokens)
   - 点击"Create Token"

2. **配置 Token 权限**
   - 模板: "Edit Cloudflare Workers"
   - Zone Resources: 包含特定区域或所有区域
   - Account Resources: 包含您的账户

3. **所需 Token 权限**:
   ```
   Zone:Zone Settings:Read
   Zone:Zone:Read
   Account:Cloudflare Workers:Edit
   ```

#### 步骤 2: 设置 GitHub Secrets

导航到您仓库的 **Settings → Secrets and Variables → Actions** 并添加:

| Secret 名称 | 描述 | 必需 |
|-------------|------|------|
| `CF_API_TOKEN` | Cloudflare API Token | ✅ 是 |
| `CF_ACCOUNT_ID` | Cloudflare 账户 ID | ✅ 是 |
| `WRANGLER_TOML` | 完整的 wrangler.toml 内容 | ✅ 是 |
| `CF_WORKERS_DOMAIN` | 您的 *.workers.dev 域名（可选）| ❌ 否 |

#### 步骤 3: 创建工作流文件

创建 `.github/workflows/deploy-cloudflare.yml`:

```yaml
name: 部署到 Cloudflare Workers

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: 部署
    steps:
      - name: 检出代码
        uses: actions/checkout@v4
        
      - name: 设置 Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: 安装依赖
        run: npm ci
        
      - name: 构建项目
        run: npm run build
        
      - name: 创建 wrangler.toml
        run: echo "${{ secrets.WRANGLER_TOML }}" > wrangler.toml
        
      - name: 部署到 Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          accountId: ${{ secrets.CF_ACCOUNT_ID }}
          command: deploy
```

---

### Vercel 部署

#### Vercel 所需 Secrets

| Secret 名称 | 描述 |
|-------------|------|
| `VERCEL_ORG_ID` | Vercel 组织 ID |
| `VERCEL_PROJECT_ID` | Vercel 项目 ID |
| `VERCEL_TOKEN` | Vercel API Token |
| `UPSTASH_REDIS_REST_URL` | Redis URL |
| `UPSTASH_REDIS_REST_TOKEN` | Redis Token |

#### Vercel 工作流

创建 `.github/workflows/deploy-vercel.yml`:

```yaml
name: 部署到 Vercel

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: 检出代码
        uses: actions/checkout@v4
        
      - name: 设置 Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: 安装 Vercel CLI
        run: npm install --global vercel@latest
        
      - name: 拉取 Vercel 环境信息
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
        
      - name: 构建项目
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
        
      - name: 部署到 Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

### Docker 部署

#### Docker 镜像仓库部署

创建 `.github/workflows/docker-build.yml`:

```yaml
name: 构建和推送 Docker 镜像

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
      - name: 检出代码
        uses: actions/checkout@v4
        
      - name: 设置 Docker Buildx
        uses: docker/setup-buildx-action@v3
        
      - name: 登录容器镜像仓库
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
          
      - name: 提取元数据
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            
      - name: 构建和推送 Docker 镜像
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

## 🔄 维护自动化

### 与上游同步

创建 `.github/workflows/sync-upstream.yml`:

```yaml
name: 与上游同步

on:
  schedule:
    - cron: '0 2 * * *'  # 每天凌晨2点 UTC
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: 检出代码
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          fetch-depth: 0
          
      - name: 添加上游远程仓库
        run: |
          git remote add upstream https://github.com/TBXark/ChatGPT-Telegram-Workers.git
          git fetch upstream
          
      - name: 合并上游更改
        run: |
          git checkout main
          git merge upstream/master --no-edit
          
      - name: 推送更改
        run: git push origin main
        
      - name: 创建 Pull Request
        if: failure()
        uses: peter-evans/create-pull-request@v5
        with:
          title: '自动同步上游仓库'
          body: '自动化同步上游仓库的更改'
          branch: auto-sync-upstream
```

### 依赖更新

创建 `.github/workflows/update-dependencies.yml`:

```yaml
name: 更新依赖

on:
  schedule:
    - cron: '0 3 * * 1'  # 每周一凌晨3点 UTC
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - name: 检出代码
        uses: actions/checkout@v4
        
      - name: 设置 Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: 更新依赖
        run: |
          npx npm-check-updates -u
          npm install
          
      - name: 运行测试
        run: npm test
        
      - name: 创建 Pull Request
        uses: peter-evans/create-pull-request@v5
        with:
          title: 'chore: 更新依赖'
          body: '自动化依赖更新'
          branch: update-dependencies
```

---

## 🔒 安全最佳实践

### Secret 管理

1. **使用 GitHub Secrets**: 永远不要硬编码敏感信息
2. **定期轮换 Token**: 每90天更新 API Token
3. **最小权限原则**: 只授予必要的权限给 Token
4. **环境分离**: 为预发布/生产环境使用不同的 Secrets

### 工作流安全

```yaml
# 安全工作流配置示例
permissions:
  contents: read
  packages: write
  id-token: write  # 用于 OIDC 认证

env:
  # 安全环境变量
  NODE_OPTIONS: '--max-old-space-size=4096'
  FORCE_COLOR: 0
```

### 分支保护

配置分支保护规则:

1. **Settings → Branches → Add rule**
2. **分支名称模式**: `main` 或 `master`
3. **要求**:
   - 需要 Pull Request 审查
   - 需要状态检查通过
   - 需要分支保持最新
   - 包括管理员

---

## 🎯 高级工作流

### 多环境部署

创建 `.github/workflows/deploy-multi-env.yml`:

```yaml
name: 多环境部署

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
      - name: 部署到 ${{ matrix.environment.name }}
        run: |
          echo "部署到 ${{ matrix.environment.name }}"
          echo "域名: ${{ matrix.environment.domain }}"
```

### 健康检查和监控

创建 `.github/workflows/health-check.yml`:

```yaml
name: 健康检查

on:
  schedule:
    - cron: '*/15 * * * *'  # 每15分钟
  workflow_dispatch:

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - name: 检查机器人状态
        run: |
          response=$(curl -s -o /dev/null -w "%{http_code}" https://your-bot-domain.com/health)
          if [ $response -ne 200 ]; then
            echo "健康检查失败，状态码: $response"
            exit 1
          fi
          
      - name: 失败通知
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: failure
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 🔍 故障排除

### 常见问题

#### 构建失败
```bash
# 检查 Node.js 版本兼容性
node --version
npm --version

# 清除缓存并重新安装
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 部署失败

**Cloudflare Workers:**
- 验证 API Token 权限
- 检查账户 ID 和区域 ID
- 确保 wrangler.toml 格式正确

**Vercel:**
- 验证项目和组织 ID
- 检查环境变量
- 确保构建命令正确

**Docker:**
- 验证镜像仓库认证
- 检查 Dockerfile 语法
- 确保正确的平台目标

#### Secret 问题

1. **无效 Secrets**: 验证 Secret 名称完全匹配
2. **权限被拒绝**: 检查 Token 权限
3. **Token 过期**: 轮换和更新 Token

### 调试模式

在工作流中启用调试日志:

```yaml
env:
  ACTIONS_STEP_DEBUG: true
  ACTIONS_RUNNER_DEBUG: true
```

### 工作流监控

1. **GitHub Actions Tab**: 监控工作流运行
2. **状态徽章**: 向 README 添加状态徽章
3. **通知**: 设置邮件/Slack 通知

---

## 📚 其他资源

- [GitHub Actions 文档](https://docs.github.com/zh/actions)
- [Cloudflare Workers Actions](https://github.com/cloudflare/wrangler-action)
- [Vercel Actions](https://vercel.com/guides/how-can-i-use-github-actions-with-vercel)
- [Docker Build Push Action](https://github.com/docker/build-push-action)

---

**需要 GitHub Actions 帮助？** 查看[故障排除部分](#故障排除)或在仓库中创建 issue。
