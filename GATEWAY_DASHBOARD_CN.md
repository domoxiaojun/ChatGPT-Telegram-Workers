# Gateway 控制面板

## 概述

Gateway 控制面板提供了一个基于 Web 的控制台，用于监控和管理你的 ChatGPT-Telegram-Worker 机器人。支持响应式设计，在桌面端和移动端都能正常使用。

## 功能特性

### 实时监控
- 机器人状态和运行时间追踪
- 使用统计（总用户数、群组数、消息数）
- 今日消息数量及日期显示

### 实时日志
- 实时日志流
- 彩色日志级别显示（info、error）
- 自动滚动并显示时间戳
- 最多保留 500 行日志

### 用户配置管理
- 按 Chat ID 查看所有用户配置
- 显示配置键和值
- 删除单个配置项
- 自动隐藏内部字段（如 DEFINE_KEYS）
- 空配置不显示

### 定时任务管理
- 查看所有定时任务详情
- 使用简化格式添加新任务：`ChatID | 时间/Cron表达式 [时区] 提示词`
- 示例：
  - `123456 | 09:00 每日早报`（使用默认时区）
  - `123456 | 09:00 Asia/Tokyo 早间新闻`（自定义时区）
  - `123456 | 0 9 * * * Asia/Shanghai 每日早报`（完整 cron 表达式）
- 启用/禁用任务切换按钮
- 删除任务
- 显示任务状态（启用/禁用）、cron 表达式、时区和提示词

### 环境变量显示
- 查看所有环境变量键
- 系统信息有序展示

## 访问方式

### 访问地址

访问控制面板：`http://your-ip:8787/admin`

如需使用自定义域名，请配置反向代理（如 Nginx、Caddy）将请求转发到 8787 端口。

### 身份验证

设置 `ADMIN_TOKEN` 环境变量来启用身份验证：

```bash
# 在 docker-compose.yml 或 .env 中
ADMIN_TOKEN=your-secret-token-here
```

然后使用 token 访问：
- URL 参数方式：`http://your-ip:8787/admin?token=your-secret-token-here`
- Authorization header 方式：`Authorization: Bearer your-secret-token-here`

如果未设置 `ADMIN_TOKEN`，控制面板可以无需认证访问（不建议在生产环境使用）。

## API 接口

### 控制面板

#### GET /admin
返回控制面板 HTML 页面。

### 统计数据

#### GET /api/stats
返回 JSON 格式的统计数据：
```json
{
  "totalUsers": 100,
  "totalGroups": 20,
  "totalMessages": 5000,
  "todayMessages": 150,
  "todayDate": "2026-02-02"
}
```

### 用户配置

#### GET /api/user-configs
返回所有用户配置：
```json
{
  "user_config:123456": {
    "AI_CHAT_PROVIDER": "openai",
    "CHAT_MODEL": "gpt-4"
  }
}
```

#### DELETE /api/user-config/:chatId/:key
删除指定用户的特定配置项。

### 定时任务

#### GET /api/cron
返回所有定时任务：
```json
[
  {
    "id": "uuid",
    "chatId": "123456",
    "cronExpr": "0 9 * * *",
    "timezone": "Asia/Shanghai",
    "prompt": "每日早报",
    "enabled": true,
    "createdAt": 1234567890
  }
]
```

#### POST /api/cron
创建新的定时任务：
```json
{
  "chatId": "123456",
  "args": "09:00 每日早报"
}
```

或使用完整参数：
```json
{
  "chatId": "123456",
  "cronExpr": "0 9 * * *",
  "timezone": "Asia/Shanghai",
  "prompt": "每日早报",
  "botToken": "可选"
}
```

#### PATCH /api/cron/:id
更新定时任务（启用/禁用）：
```json
{
  "enabled": false
}
```

#### DELETE /api/cron/:id
删除定时任务。

## 移动端支持

控制面板完全响应式设计，针对移动设备优化：
- 自适应网格布局（平板 2 列，手机 1 列）
- 触屏友好的按钮和控件
- 小屏幕上可读的字体大小
- 日志容器可滚动且高度适中

## 安全建议

- 生产环境务必设置 `ADMIN_TOKEN`
- 生产环境使用 HTTPS
- 考虑在防火墙层面进行 IP 白名单限制
- 定期轮换 token
- 用户配置中的敏感数据已进行 HTML 转义以防止 XSS 攻击
