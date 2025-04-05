# 支持平台

### 1. [Cloudflare Workers](https://workers.cloudflare.com/)

最简单的方法，本项目默认支持的部署方式，详情看[部署流程](DEPLOY.md)。免费，无需域名，无需服务器，无需配置本地开发环境。KV存储，无需数据库，但是有一定的存储限制，


### 2. [Vercel](https://vercel.com/)

详情看[Vercel](VERCEL.md)。免费，无需域名，无需服务器。需要配置本地开发环境部署，不能通过复制粘贴部署。无存储服务，需要自己配置数据库。可以使用[UpStash Redis](https://upstash.com)的免费redis。可以连接github自动部署，但是需要了解vercel的配置。


### 3. Local

详情看[Local](LOCAL.md)。本地的部署方式，需要配置本地开发环境，需要有一定的开发能力。支持docker部署。

### 4. koyeb
#### 快速部署
[![Deploy to Koyeb](https://www.koyeb.com/static/images/deploy/button.svg)](https://app.koyeb.com/deploy?name=chatgpt-telegram-workers&type=docker&image=adolphnov%2Fchatgpt-telegram-workers%3Alatest&instance_type=free&instances_min=0&autoscaling_sleep_idle_delay=300&ports=8787%3Bhttp%3B%2F&hc_protocol%5B8787%5D=http&hc_grace_period%5B8787%5D=5&hc_interval%5B8787%5D=30&hc_restart_limit%5B8787%5D=3&hc_timeout%5B8787%5D=5&hc_path%5B8787%5D=%2F&hc_method%5B8787%5D=get)

> Tip: Koyeb免费实例存在休眠的情况，会存在延迟
##### 通过docker image 部署， webhook模式
1. 进入控制台，选择create service
2. 选择web service，在右侧选择docker
3. 填写image名称：`adolphnov/chatgpt-telegram-workers:latest`
4. 验证通过后点击next，选择合适的实例
5. 点击 `Environment variables and files`, 切换到files
6. 点击 add file，复制粘贴local部署方式中的config.json内容，mode设置为webhook，baseURL此时暂时留空（若你有自己的域名，可进行设置），path填写`/app/config.json`
7. 继续 add file, 复制wrangle.toml内容，此文件为所有环境变量配置文件，自行填写token botname apikey等数据，path填写 `/app/config.toml`
> Instance region 建议选 `Frankfurt`
8. 点击`Environment variables and files`，端口设置为8787（与config.json中的port一致即可）
9. deploy
10. 复制 Overview - Web service Public URL, 修改第六步中`config.json`留空的baseURL，重新deploy
11. 访问 Web service Public URL 激活webhook, 完成

##### 通过docker image 部署， polling模式
> 此方法无需域名， 能同时处理多条消息
1. 进入控制台，选择create service
2. 选择worker，在右侧选择docker（worker模式需要付费）
3. 填写image名称：`adolphnov/chatgpt-telegram-workers:latest`
4. `config.json`文件中，mode设置为polling，无需设置域名，其余步骤与webhook模式一致

