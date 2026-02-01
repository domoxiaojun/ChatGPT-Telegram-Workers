# Gateway 控制面板

## 概述

Gateway 控制面板提供了一个基于 Web 的控制台，用于监控和管理你的 ChatGPT-Telegram-Worker 机器人。

## 功能特性

- **实时监控**
  - 机器人状态和运行时间
  - 请求统计（总计和今日）
  - 活跃聊天数量

- **实时日志** (即将推出)
  - 通过 WebSocket 实时日志流
  - 按日志级别过滤

- **配置管理** (即将推出)
  - 管理白名单/黑名单
  - 更新环境变量

- **定时任务管理** (即将推出)
  - 查看所有定时任务
  - 添加/编辑/删除任务
  - 启用/禁用任务

## 访问方式

### 访问地址

访问控制面板：`http://your-server:8787/admin`

### 身份验证

设置 `ADMIN_TOKEN` 环境变量来启用身份验证：

```bash
# 在 docker-compose.yml 或 .env 中
ADMIN_TOKEN=your-secret-token-here
```

然后使用 token 访问：
- URL 参数方式：`http://your-server:8787/admin?token=your-secret-token-here`
- Authorization header 方式：`Authorization: Bearer your-secret-token-here`

如果未设置 `ADMIN_TOKEN`，控制面板可以无需认证访问（不建议在生产环境使用）。

## API 接口

### GET /admin
返回控制面板 HTML 页面。

### GET /api/stats
返回 JSON 格式的统计数据：
```json
{
  "totalRequests": 1234,
  "todayRequests": 56,
  "activeChats": 12,
  "timestamp": 1234567890
}
```

## 安全建议

- 生产环境务必设置 `ADMIN_TOKEN`
- 生产环境使用 HTTPS
- 考虑在防火墙层面进行 IP 白名单限制
- 定期轮换 token
