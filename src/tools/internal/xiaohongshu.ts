import type { FuncTool } from '../types';
import { ENV } from '../../config/env';

interface SearchNotesParams {
    keyword: string;
    page: number;
    limit: number; // 限制返回数量
    sort: 'general' | 'time_descending' | 'popularity_descending';
    note_type: 0 | 1 | 2; // 0: 全部, 1: 视频, 2: 图文
}

async function searchNotes({ keyword, page, sort, note_type, limit = 10 }: SearchNotesParams) {
    const body = {
        keyword,
        page,
        page_size: 20, // 无法调节
        search_id: '2ep4cpeeks30jp5gj6gm0',
        sort,
        note_type,
        ext_flags: [],
        geo: '',
        image_formats: ['jpg', 'webp', 'avif'],
    };
    if (!ENV.PLUGINS_ENV.XHS_COOKIE) {
        throw new Error('Xiaohongshu cookie is not set, please set it in the environment variables: PLUGIN_ENV_XHS_COOKIE');
    }
    const res = await fetch('https://edith.xiaohongshu.com/api/sns/web/v1/search/notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': ENV.PLUGINS_ENV.XHS_COOKIE,
        },
        body: JSON.stringify(body),
    }).then(res => res.json());

    if (!res.success || !res.data?.items) {
        throw new Error(res.msg || 'Failed to search notes');
    }
    // console.debug(JSON.stringify(res.data, null, 2));

    const notes = res.data?.items?.slice(0, limit).map((note: any) => getNoteDetail(note.id, note.xsec_token));
    return Promise.all(notes);
}

async function getNoteDetail(note_id: string, xsec_token: string) {
    const { success, data, message } = await fetch(`https://xiaohongshu.day/api/note/${note_id}?type=normal&xsec_token=${xsec_token}`).then(res => res.json());
    if (!success || !data) {
        const desc = `Failed to get note '${note_id}' detail: ${message ?? 'Unknown error'}`;
        console.error(desc);
        return { desc };
    }

    return {
        title: data.title,
        desc: data.desc,
        userName: data.user?.nickname,
        time: data.time,
        ipLocation: data.ipLocation,
        tagList: data.tagList?.map((tag: any) => tag.name),
        interactInfo: data.interactInfo,
    };
}

export const xiaohongshu: FuncTool = {
    schema: {
        name: 'xiaohongshu',
        description: 'Search for notes on Xiaohongshu',
        parameters: {
            type: 'object',
            properties: {
                keyword: {
                    type: 'string',
                    description: 'The keyword to search for; a string composed of 3 to 4 word groups, such as "吃瓜 明星 塌房", etc.',
                },
                page: {
                    type: 'number',
                    description: 'The page number to search for',
                    default: 1,
                },
                sort: {
                    type: 'string',
                    // enum: ['general', 'time_descending', 'popularity_descending'],
                    description: 'The sort to search for, `general` means general, `time_descending` means time descending, `popularity_descending` means popularity descending',
                    default: 'general',
                },
                limit: {
                    type: 'number',
                    description: 'The limit of the number of notes to return, maximum is 20',
                    default: 10,
                },
                note_type: {
                    type: 'number',
                    // enum: [0, 1, 2],
                    description: 'The note type to search for, `0` means all, `1` means video, `2` means image and text',
                    default: 2,
                },
            },
            required: ['keyword'],
        },
    },
    func: async ({ keyword, page = 1, sort = 'general', note_type = 2, limit = 10 }: any) => {
        const startTime = Date.now();
        let notes, time;
        let errorMsg = '';
        try {
            notes = await searchNotes({ keyword, page, sort, note_type, limit });
        } catch (error) {
            errorMsg = (error as Error).message;
        } finally {
            const endTime = Date.now();
            time = `${((endTime - startTime) / 1000).toFixed(2)}s`;
        }

        return { content: notes ?? errorMsg, time };
    },
    buildin: true,
    prompt: 'You should comprehensively summarize the content of the post in detail, without omitting any details, and attribute quotations with proper citations.',
};
