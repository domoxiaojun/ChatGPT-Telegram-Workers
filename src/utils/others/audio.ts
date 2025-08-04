import { FFmpeg } from '@ffmpeg.wasm/main';

export async function convertAudio({ file, target = 'base64', inputType = 'oga', outputType = 'mp3', command = [] }: { file: Blob | Response; target?: 'base64' | 'blob'; inputType?: string; outputType?: string; command?: string[] }) {
    const ffmpeg = await FFmpeg.create({ core: '@ffmpeg.wasm/core-st' });
    try {
        const uint8Array = new Uint8Array(await file.arrayBuffer());
        ffmpeg.fs.writeFile(`input.${inputType}`, uint8Array);
        await ffmpeg.run(...command, '-i', `input.${inputType}`, `output.${outputType}`);
        const output = ffmpeg.fs.readFile(`output.${outputType}`);
        return target === 'base64' ? uint8ArrayToBase64(output) : new Blob([new Uint8Array(output)], { type: `audio/${outputType}` });
    } catch (error) {
        console.error(`audio convert error: ${error}`);
        throw error;
    } finally {
        ffmpeg.exit();
    }
}

function uint8ArrayToBase64(uint8Array: Uint8Array) {
    return Buffer.from(uint8Array).toString('base64');
}
