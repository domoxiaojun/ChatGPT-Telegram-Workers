/* eslint-disable */
export default {"env":{"system_init_message":"你是一个得力的助手"},"command":{"help":{"summary":"当前支持以下命令:\n","help":"获取命令帮助","new":"发起新的对话","start":"获取你的ID, 并发起新的对话","img":"生成一张图片, 命令完整格式为 `/img 图片描述`, 例如`/img 月光下的沙滩`","version":"获取当前版本号, 判断是否需要更新","setenv":"设置用户配置，命令完整格式为 /setenv KEY=VALUE","setenvs":"批量设置用户配置, 命令完整格式为 /setenvs {\"KEY1\": \"VALUE1\", \"KEY2\": \"VALUE2\"}","delenv":"删除用户配置，命令完整格式为 /delenv KEY","clearenv":"清除所有用户配置","system":"查看当前一些系统信息","redo":"重做上一次的对话, /redo 加修改过的内容 或者 直接 /redo","echo":"回显消息","set":"/set 命令格式为 /set 选项 值 [选项 值…] "},"new":{"new_chat_start":"新的对话已经开始"},"detail":{"set":"/set 命令格式为 /set 选项 值 [选项 值…] 或 /set \"选项\" 值 [\"选项\" 值…] \n  选项预置如下： \n  -p 调整 SYSTEM_INIT_MESSAGE\n  -o 调整 CHAT_MODEL\n  -n 调整 MAX_HISTORY_LENGTH\n  -a 调整 AI_PROVIDER\n  -ai 调整 AI_IMAGE_PROVIDER\n  -v 调整 OPENAI_VISION_MODEL\n  -t 调整 OPENAI_TTS_MODEL\n  \n  可自行设置 MAPPING_KEY, 使用半角|进行分割,:左边为选项，右边为对应变量\n  可设置值 MAPPING_KEY 对某些常用值进行简写，同样半角|进行分割, :左边为选项，右边为对应变量\n  例如：MAPPING_VALUE = 'c35son:claude-3-5-sonnet-20240620|r+:command-r-plus'\n  在使用/set时快速调整参数: /set -m r+ -v gpt-4o\n\n  /set命令可追加消息 此时不会将修改的参数存储\n  调整SYSTEM_INIT_MESSAGE时，若设置了PROMPT可直接使用设置为角色名，自动填充角色prompt，例如：\n  /set -p ~doctor"}}}
