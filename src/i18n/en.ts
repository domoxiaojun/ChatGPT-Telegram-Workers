/* eslint-disable */
export default {"env":{"system_init_message":"You are a helpful assistant"},"command":{"help":{"summary":"The following commands are currently supported:\n","help":"Get command help","new":"Start a new conversation","start":"Get your ID and start a new conversation","img":"Generate an image, the complete command format is `/img image description`, for example `/img beach at moonlight`","version":"Get the current version number to determine whether to update","setenv":"Set user configuration, the complete command format is /setenv KEY=VALUE","setenvs":"Batch set user configurations, the full format of the command is /setenvs {\"KEY1\": \"VALUE1\", \"KEY2\": \"VALUE2\"}","delenv":"Delete user configuration, the complete command format is /delenv KEY","clearenv":"Clear all user configuration","system":"View some system information","redo":"Redo the last conversation, /redo with modified content or directly /redo","echo":"Echo the message","set": "/set command format is /set option value [option value...] "},"new":{"new_chat_start":"A new conversation has started"},"detail":{"set":"/set command format is /set option value [option value...] or /set \"option\" value [\"option\" value...]\n The preset options are as follows:\n -p adjust SYSTEM_INIT_MESSAGE\n -o adjust CHAT_MODEL\n -n adjust MAX_HISTORY_LENGTH\n -a adjust AI_PROVIDER\n -ai adjust AI_IMAGE_PROVIDER\n -v adjust OPENAI_VISION_MODEL\n -t adjust OPENAI_TTS_MODEL\n \n You can set MAPPING_KEY by yourself, use a half-width | for separation, the left side is the option, and the right side is the corresponding variable.\n You can set values of MAPPING_KEY to abbreviate some common values, also separated by a half-width |, with : on the left being the option and on the right being the corresponding variable.\n For example: MAPPING_VALUE = 'c35son:claude-3-5-sonnet-20240620|r+:command-r-plus'\n Quickly adjust parameters when using /set: /set -m r+ -v gpt-4o \n \nThe /set command can append messages without storing modified parameters at this time. When adjusting SYSTEM_INIT_MESSAGE, if PROMPT is set directly using it as a role name will automatically fill in role prompt. For example:\n/set -p ~doctor"}}}
