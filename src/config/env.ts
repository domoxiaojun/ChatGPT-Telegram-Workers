import type { APIGuard, CommandConfig, KVNamespace, MCPTransport } from './types';
import { blockAgent } from '../agent';
import loadI18n from '../i18n';
import { initializeMcp } from '../mcp';
import { blockCommand } from '../telegram/command';
import { initializeTools } from '../tools';
import {
    AgentShareConfig,
    AnthropicConfig,
    AzureConfig,
    BlackForestLabsConfig,
    CohereConfig,
    DefineKeys,
    EnvironmentConfig,
    ExtraUserConfig,
    FishConfig,
    GeminiConfig,
    MistralConfig,
    OpenAIConfig,
    OpenAILikeConfig,
    VertexConfig,
    WorkersConfig,
    XAIConfig,
} from './config';
import { ConfigMerger, resolveUserConfigKeyAlias } from './merger';

export type AgentUserConfig = Record<string, any>
    & DefineKeys
    & AgentShareConfig
    & OpenAIConfig
    & AzureConfig
    & WorkersConfig
    & GeminiConfig
    & MistralConfig
    & CohereConfig
    & AnthropicConfig
    & OpenAILikeConfig
    & ExtraUserConfig
    & VertexConfig
    & XAIConfig
    & FishConfig
    & BlackForestLabsConfig;

function createAgentUserConfig(): AgentUserConfig {
    return Object.assign(
        {},
        new DefineKeys(),
        new AgentShareConfig(),
        new OpenAIConfig(),
        new AzureConfig(),
        new WorkersConfig(),
        new GeminiConfig(),
        new MistralConfig(),
        new CohereConfig(),
        new AnthropicConfig(),
        new OpenAILikeConfig(),
        new ExtraUserConfig(),
        new VertexConfig(),
        new XAIConfig(),
        new FishConfig(),
        new BlackForestLabsConfig(),
    );
}

class Environment extends EnvironmentConfig {
    // -- 版本数据 --
    //
    // 当前版本
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    BUILD_TIMESTAMP = typeof __BUILD_TIMESTAMP__ === 'number' ? __BUILD_TIMESTAMP__ : 0;
    // 当前版本 commit id
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    BUILD_VERSION = typeof __BUILD_VERSION__ === 'string' ? __BUILD_VERSION__ : 'unknown';

    // -- 基础配置 --
    I18N = loadI18n();
    readonly PLUGINS_ENV: Record<string, string> = {};
    readonly USER_CONFIG: AgentUserConfig = createAgentUserConfig();
    readonly CUSTOM_COMMAND: Record<string, CommandConfig> = {};
    readonly PLUGINS_COMMAND: Record<string, CommandConfig> = {};
    readonly PLUGINS_FUNCTION: Record<string, any> = {};
    readonly MCP_CONFIG: Record<string, MCPTransport> = {};
    DATABASE: KVNamespace = null as any;
    API_GUARD: APIGuard | null = null;

    constructor() {
        super();
        this.merge = this.merge.bind(this);
    }

    merge(source: any) {
        // 全局对象
        this.DATABASE = source.DATABASE;
        this.API_GUARD = source.API_GUARD;

        // 绑定自定义命令
        this.mergeCommands(
            'CUSTOM_COMMAND_',
            'COMMAND_DESCRIPTION_',
            'COMMAND_SCOPE_',
            source,
            this.CUSTOM_COMMAND,
        );

        // 绑定插件命令
        this.mergeCommands(
            'PLUGIN_COMMAND_',
            'PLUGIN_DESCRIPTION_',
            'PLUGIN_SCOPE_',
            source,
            this.PLUGINS_COMMAND,
        );

        // 绑定插件环境变量
        const pluginEnvPrefix = 'PLUGIN_ENV_';
        for (const key of Object.keys(source)) {
            if (key.startsWith(pluginEnvPrefix)) {
                const plugin = key.substring(pluginEnvPrefix.length);
                this.PLUGINS_ENV[plugin] = source[key];
            }
        }

        // 读取外部插件
        for (const key of Object.keys(source)) {
            if (key.startsWith('PLUGIN_FUNCTION_')) {
                this.PLUGINS_FUNCTION[key.substring('PLUGIN_FUNCTION_'.length)] = source[key];
            }
        }

        // 读取MCP配置
        this.mergeMCP('MCP_', source, this.MCP_CONFIG);

        // 合并环境变量
        ConfigMerger.merge(this, source, [
            'BUILD_TIMESTAMP',
            'BUILD_VERSION',
            'I18N',
            'PLUGINS_ENV',
            'USER_CONFIG',
            'CUSTOM_COMMAND',
            'PLUGINS_COMMAND',
            'DATABASE',
            'API_GUARD',
        ]);

        ConfigMerger.merge(this.USER_CONFIG, source);
        this.migrateOldEnv(source);
        this.USER_CONFIG.DEFINE_KEYS = [];
        this.I18N = loadI18n(this.LANGUAGE.toLowerCase());

        // 选择对应语言的SYSTEM_INIT_MESSAGE
        if (!this.USER_CONFIG.SYSTEM_INIT_MESSAGE) {
            this.USER_CONFIG.SYSTEM_INIT_MESSAGE = this.I18N?.env?.system_init_message || 'You are a helpful assistant';
        }
        // 清理ENVS_VARIABLES
        if (this.ENVS_VARIABLES.length > 0) {
            this.ENVS_VARIABLES = this.ENVS_VARIABLES.filter((key: string) => Object.keys(this.USER_CONFIG).includes(key));
        }

        // 异步初始化tools和mcp
        this.asyncInit();

        // block agents
        blockAgent();
        // block commands
        blockCommand();
    }

    private mergeCommands(prefix: string, descriptionPrefix: string, scopePrefix: string, source: any, target: Record<string, CommandConfig>) {
        for (const key of Object.keys(source)) {
            if (key.startsWith(prefix)) {
                const cmd = key.substring(prefix.length);
                target[`/${cmd}`] = {
                    value: source[key],
                    description: source[`${descriptionPrefix}${cmd}`],
                    scope: source[`${scopePrefix}${cmd}`]?.split(',').map((s: string) => s.trim()),
                };
            }
        }
    }

    private migrateOldEnv(source: any) {
        // 兼容旧版 TELEGRAM_TOKEN
        if (source.TELEGRAM_TOKEN && !this.TELEGRAM_AVAILABLE_TOKENS.includes(source.TELEGRAM_TOKEN)) {
            if (source.BOT_NAME && this.TELEGRAM_AVAILABLE_TOKENS.length === this.TELEGRAM_BOT_NAME.length) {
                this.TELEGRAM_BOT_NAME.push(source.BOT_NAME);
            }
            this.TELEGRAM_AVAILABLE_TOKENS.push(source.TELEGRAM_TOKEN);
        }

        //  兼容旧的AI_PROVIDER
        if (source.AI_PROVIDER && !source.AI_CHAT_PROVIDER) {
            this.USER_CONFIG.AI_CHAT_PROVIDER = source.AI_PROVIDER;
        }

        // 兼容旧版CHAT_MODEL
        if (source.CHAT_MODEL) {
            const modelKey = resolveUserConfigKeyAlias('CHAT_MODEL', this.USER_CONFIG);
            if (Object.prototype.hasOwnProperty.call(this.USER_CONFIG, modelKey)
                && !Object.prototype.hasOwnProperty.call(source, modelKey)) {
                this.USER_CONFIG[modelKey] = source.CHAT_MODEL;
            }
        }
    }

    private mergeMCP(prefix: string, source: any, target: Record<string, MCPTransport>) {
        for (const key of Object.keys(source)) {
            if (key.startsWith(prefix)) {
                const mcp = key.substring(prefix.length);
                try {
                    target[mcp] = JSON.parse(source[key]);
                } catch (error) {
                    console.error(`[ERROR] Failed to parse MCP config for ${mcp}:`, error);
                }
            }
        }
    }

    private asyncInit() {
        initializeTools().catch(console.error);
        initializeMcp().catch(console.error);
    }
}

export const ENV = new Environment();
