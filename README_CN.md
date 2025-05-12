[![Build and Push Docker Image](https://github.com/adolphnov/ChatGPT-Telegram-Workers/actions/workflows/build-docker.yml/badge.svg)](https://github.com/adolphnov/ChatGPT-Telegram-Workers/actions/workflows/build-docker.yml)
<h1 align="center">
ChatGPT-Telegram-Workers
</h1>

<p align="center">
    <br> <a href="README.md">English</a> | 中文
</p>
<p align="center">
    <em>轻松在Cloudflare Workers上部署您自己的Telegram ChatGPT机器人。</em>
</p>

## 此项目为原项目的修改版本
> 修改内容较多，请直接查阅[config doc](./doc/cn/CONFIG.md)
修改内容包括但不限于：
- 除workerAI 全部切换为AI SDK
- 增加模型名、使用时间等信息显示
- 支持函数调用，已内置数个函数，允许通过环境变量额外增设函数
- 在原有项目上额外增加 vertex ai 等agent
- 支持自定义触发词
- 支持自定义替换词，简化环境变量修改步骤，同时支持临时性调整变量进行AI对话，不会修改变量
- 增加数个命令，如`/set`，`/settings`，`/history`
- 支持通过函数调用的方式生图，支持google生图
- 支持markdownV2实时渲染，代码块特殊优化
- 支持超长文本分割，超长文本渲染（代码分块后仍正常渲染）
- 支持自定义领域折叠功能，防止在群内回复时过长文本干扰正常交流
- 支持不同的媒体发送方式
- 支持tts asr
- 支持以不同的方式处理文本/语音（例如：文本输入语音输出等）
- 支持更流畅的消息发送机制，几乎0延迟发送文本（优化过于频繁的发送导致的429），最终消息即使429依然正常发送。
- 支持定时删除不同类型消息的功能
- 支持多张图片读取；支持超长文本被分割后的处理
- 支持klingai生图
- 支持特殊参数处理，允许特定模型移除、增加特定参数
- 支持智能调整对话模型
- 支持内联消息（需在botfather中将inline mode开启，并将inlinefeedback调整为100%）
- OAILIKE特殊agent针对newapi特殊优化，允许开启googleSearch等特殊内建工具
- 支持gpt-4o-search模型搜索源读取，支持google vertex oailike搜索来源读取
- 支持长文本回复转telegraph 转文本文件
- 支持模型thinking内容折叠（需开启折叠功能）
等等

### 注意
- 由于使用AI SDK，大幅增加CPU time，不太适合在cloudflare worker中使用(worker free tier limit cpu time: 10ms)，同时由于通过webhook方式处理，最大运行时间仅60s
- 未编译cloudflare worker产物，如有需要，请自行编译
> 建议使用docker部署，polling模式
> 部署方式与原项目一致；请查看 [LOCAL/DOCKER部署文档](./doc/cn/LOCAL.md)。
> 其他部署方式，请查看[部署文档](./doc/cn/PLATFORM.md)。

---


## 关于

最简单快捷部署属于自己的ChatGPT Telegram机器人的方法。使用Cloudflare Workers，单文件，直接复制粘贴一把梭，无需任何依赖，无需配置本地开发环境，不用域名，免服务器。 可以自定义系统初始化信息，让你调试好的性格永远不消失。

<details>
<summary>查看Demo</summary>
<img style="max-width: 600px;" alt="image" src="doc/demo.jpg">
</details>


## 特性

- 无服务器部署
- 多平台部署支持(Cloudflare Workers, Vercel, Docker[...](doc/cn/PLATFORM.md))
- 适配多种AI服务商(OpenAI, Azure OpenAI, Cloudflare AI, Cohere, Anthropic, Mistral...)
- 自定义指令(可以实现快速切换模型,切换机器人预设)
- 支持多个Telegram机器人
- 流式输出
- 多语言支持
- 文字生成图片
- [插件系统](plugins),可以自定义插件


## 文档

- [部署Cloudflare Workers](./doc/cn/DEPLOY.md)
- [本地(或Docker)部署](./doc/cn/LOCAL.md)
- [部署其他平台](./doc/cn/PLATFORM.md)
- [配置参数和指令](./doc/cn/CONFIG.md)
- [自动更新](./doc/cn/ACTION.md)
- [变更日志](./doc/cn/CHANGELOG.md)


## 关联项目

- [cloudflare-worker-adapter](https://github.com/TBXark/cloudflare-worker-adapter)  一个简单的Cloudflare Worker适配器,让本项目脱离Cloudflare Worker独立运行
- [telegram-bot-api-types](https://github.com/TBXark/telegram-bot-api-types)  编译后0输出的Telegram Bot API SDK, 文档齐全,支持所有API


## 特别感谢

![https://www.jetbrains.com/?from=tbxark](https://user-images.githubusercontent.com/9513891/236592683-1ea579cf-08ff-4703-b313-db038f62bab0.svg)

感谢[JetBrains](https://www.jetbrains.com/?from=tbxark)提供的开源开发许可证。


## 贡献者

这个项目存在是因为所有贡献的人。[贡献](https://github.com/tbxark/ChatGPT-Telegram-Workers/graphs/contributors)。


## 许可证

**ChatGPT-Telegram-Workers** 以 MIT 许可证发布。[详见 LICENSE](LICENSE) 获取详情。
