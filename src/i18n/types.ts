interface HelpI18n {
    summary: string;
    help: string;
    new: string;
    start: string;
    img: string;
    version: string;
    setenv: string;
    setenvs: string;
    delenv: string;
    system: string;
    redo: string;
    echo: string;
    set: string;
}

export interface I18n {
    env: {
        system_init_message: string;
    };
    command: {
        help: HelpI18n & Record<string, string>;
        new: {
            new_chat_start: string;
        };
        detail?: {
            set: string;
        };
    };
    whitelist: {
        not_in_user_whitelist: string;
        not_in_group_whitelist: string;
    };
}
