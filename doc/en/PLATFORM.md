# Supported platforms

### 1. [Cloudflare Workers](https://workers.cloudflare.com/)

The easiest way, the deployment method supported by this project by default, see [Deployment Process](DEPLOY.md) for details. Free, no domain, no server, no need to configure local development environment. kv storage, no database, but there are some storage limitations.

> KV write limit is 1000 times per day, but it should be enough for chatbot. (Debug mode `DEBUG_MODE` will save the latest message to KV, token stats will update the stats every time the conversation is successful, so there will be a certain number of writes. If you regularly use it more than 1000 times, consider turning off debug mode and token usage statistics)

### 2. [Vercel](https://vercel.com/)

See details at [Vercel](VERCEL.md). It is free, does not require a domain name or server. Deployment requires configuring the local development environment and cannot be done by copying and pasting. There is no storage service, so you need to configure your own database. You can use the free Redis from [UpStash Redis](https://upstash.com). It can connect to GitHub for automatic deployment, but you need to understand Vercel's configuration.

### 3. Local

See [Local](LOCAL.md) for details. For local deployment method, you need to configure local development environment. Supports Docker deployment.

### 4. Koyeb
#### Quick Deployment
[![Deploy to Koyeb](https://www.koyeb.com/static/images/deploy/button.svg)](https://app.koyeb.com/deploy?name=chatgpt-telegram-workers&type=docker&image=adolphnov%2Fchatgpt-telegram-workers%3Alatest&instance_type=free&instances_min=0&autoscaling_sleep_idle_delay=300&ports=8787%3Bhttp%3B%2F&hc_protocol%5B8787%5D=http&hc_grace_period%5B8787%5D=5&hc_interval%5B8787%5D=30&hc_restart_limit%5B8787%5D=3&hc_timeout%5B8787%5D=5&hc_path%5B8787%5D=%2F&hc_method%5B8787%5D=get)

> Tip: Koyeb free instances may enter a sleep state, resulting in latency

##### Deploy via docker image, using webhook mode

1. Go to the console, select create service

2. Select web service, and choose docker on the right

3. Enter the image name: `adolphnov/chatgpt-telegram-workers:latest`

4. After verification, click next, select an appropriate instance

5. Click on `Environment variables and files`, switch to files

6. Click add file, copy and paste the content of config.json from the local deployment method, set mode to webhook, leave baseURL empty for now (if you have your own domain, you can set it), and fill in path as `/app/config.json`

7. Continue to add file, copy the content of wrangle.toml, this file is the configuration file for all environment variables, fill in data such as token, botname, apikey, etc., and fill in path as `/app/config.toml`

> It is recommended to select `Frankfurt` for Instance region

8. Click on `Environment variables and files`, set the port to 8787 (the same as the port in config.json)

9. Deploy

10. Copy Overview - Web service Public URL, modify the baseURL left empty in step 6 of config.json, and redeploy

11. Visit the Web service Public URL to activate webhook, complete


##### Deploy via docker image, using polling mode 
> this method does not require a domain, and can handle multiple messages at the same time

1. Go to the console, select create service

2. Select worker, and choose docker on the right (worker mode requires payment)

3. Enter the image name: `adolphnov/chatgpt-telegram-workers:latest`

4. In the `config.json` file, set mode to polling, no need to set a domain, the rest of the steps are the same as webhook mode