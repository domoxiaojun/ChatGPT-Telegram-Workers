import type { AgentUserConfig } from '../config/env';
import type { TTSAgent } from './types';

const REFERENCE_IDS: Record<string, string> = {
    丁真: '54a5170264694bfc8e9ad98df7bd89c3',
    AD学姐: '7f92f8afb8ec43bf81429cc1c9199cb1',
    雷军: 'aebaa2305aa2452fbdc8f41eec852a79',
    蔡徐坤: 'e4642e5edccd4d9ab61a69e82d4f8a14',
    郭德纲: '7c66db6e457c4d53b1fe428a8c547953',
    周杰伦: '1512d05841734931bf905d0520c272b1',
    卢本伟: '24d524b57c5948f598e9b74c4dacc7ab',
    烧姐姐: '60d377ebaae44829ad4425033b94fdea',
    小雯: '992fa0a96e454b339376d167137dfea6',
    蜡笔小新: '60b9a847ba6e485fa8abbde1b9470bc4',
    李云龙: '2e576989a8f94e888bf218de90f8c19a',
    黑手: 'f7561ff309bd4040a59f1e600f4f4338',
    御姐: 'f44181a3d6d444beae284ad585a1af37',
    女大学生: '5c353fdb312f4888836a9a5680099ef0',
    马保国: '794ed17659b243f69cfe6838b03fd31a',
    温柔女生: 'faccba1a8ac54016bcfc02761285e67f',
    赛马娘: '0eb38bc974e1459facca38b359e13511',
    芙宁娜: '1aacaeb1b840436391b835fd5513f4c4',
    奶龙: '3d1cb00d75184099992ddbaf0fdd7387',
    夯大力: '84ed22e0ec8746969adf08bef0407494',
    温情女学生: 'a1417155aa234890aab4a18686d12849',
    御女萝莉: '6ce7ea8ada884bf3889fa7c7fb206691',
    麦克阿瑟: '405736979e244634914add64e37290b0',
    剑魔: '26bc965a599549f5b3bde772cbf251bd',
    罗永浩: '9cc8e9b9d9ed471a82144300b608bf7f',
    纳西妲: '9f7eb4b1663a4d58b1554921121c4a47',
    可莉: '626bb6d3f3364c9cbc3aa6a67300a664',
    tim: '91648d8a8d9841c5a1c54fb18e54ab04',
    何炅: '595142b6de204352914aeec27f64f230',
};

export class FishTTS implements TTSAgent {
    readonly name = 'fish';
    readonly modelKey = 'FISH_TTS_MODEL';

    readonly enable = (context: AgentUserConfig): boolean => {
        return (context.FISH_TTS_MODEL !== '' || context.FISH_TTS_VOICE !== '') && context.FISH_API_KEY !== '';
    };

    model = (ctx: AgentUserConfig): string => {
        return ctx.FISH_TTS_MODEL;
    };

    readonly request = async (text: string, context: AgentUserConfig): Promise<Blob> => {
        const url = `${context.FISH_API_BASE}/tts`;
        const reference_id = REFERENCE_IDS[context.FISH_TTS_VOICE as keyof typeof REFERENCE_IDS] || context.FISH_TTS_VOICE || undefined;
        const resp = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${context.FISH_API_KEY}`,
                ...(reference_id && { model: context.FISH_TTS_MODEL }),
            },
            body: JSON.stringify({
                text,
                reference_id,
                format: 'opus',
            }),
        });
        if (resp.ok) {
            return resp.blob();
        } else {
            throw new Error(`${resp.status} ${resp.statusText}\n\n${await resp.text()}`);
        }
    };
}
