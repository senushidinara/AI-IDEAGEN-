import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import type { Clip } from '../types';

let ffmpeg: FFmpeg | null = null;

// Utility to create a WAV file blob from raw PCM audio data
const createWavBlob = (pcmData: Uint8Array): Blob => {
    const sampleRate = 24000; // Gemini TTS sample rate
    const numChannels = 1;
    const bitsPerSample = 16;
    const dataSize = pcmData.length;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const byteRate = sampleRate * blockAlign;

    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    // RIFF header
    view.setUint32(0, 0x52494646, false); // "RIFF"
    view.setUint32(4, 36 + dataSize, true);
    view.setUint32(8, 0x57415645, false); // "WAVE"
    // fmt subchunk
    view.setUint32(12, 0x666d7420, false); // "fmt "
    view.setUint32(16, 16, true); // Subchunk1Size
    view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    // data subchunk
    view.setUint32(36, 0x64617461, false); // "data"
    view.setUint32(40, dataSize, true);

    // Write PCM data
    new Uint8Array(buffer, 44).set(pcmData);

    return new Blob([view], { type: 'audio/wav' });
};


export const mergeClips = async (clips: Clip[], onProgress: (message: string) => void): Promise<string> => {
    if (!ffmpeg) {
        ffmpeg = new FFmpeg();
        ffmpeg.on('log', ({ message }) => {
            console.log(message);
        });
        onProgress('Loading video engine (FFmpeg)...');
        // NOTE: In a real app, these URLs should be hosted locally
        const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm'
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
    }

    onProgress('Fetching generated clips...');
    const videoInputs: string[] = [];
    const audioInputs: string[] = [];
    const generatedClips = clips.filter(c => c.generatedVideoUrl);
    const hasAudio = generatedClips.some(c => c.generatedAudioData);

    for (let i = 0; i < generatedClips.length; i++) {
        const clip = generatedClips[i];
        
        const videoName = `video${i}.mp4`;
        onProgress(`Loading video data for clip ${i + 1}...`);
        await ffmpeg.writeFile(videoName, await fetchFile(clip.generatedVideoUrl!));
        videoInputs.push('-i', videoName);
        
        if (hasAudio) {
            if (clip.generatedAudioData) {
                const audioName = `audio${i}.wav`;
                onProgress(`Loading audio data for clip ${i + 1}...`);
                const audioBlob = createWavBlob(clip.generatedAudioData);
                await ffmpeg.writeFile(audioName, await fetchFile(audioBlob));
                audioInputs.push('-i', audioName);
            } else {
                 // To keep streams in sync, we need a silent audio track for videos without voiceover.
                audioInputs.push('-f', 'lavfi', '-i', 'anullsrc=channel_layout=mono:sample_rate=24000');
            }
        }
    }

    onProgress('Assembling video timeline...');
    
    // Reworked filter_complex generation for robustness.
    // 1. Reset timestamps for each stream to prevent issues with concatenating varied sources.
    const videoSetptsFilters = generatedClips.map((_, i) => `[${i}:v]setpts=PTS-STARTPTS[v${i}]`).join('; ');
    const audioSetptsFilters = hasAudio 
        ? generatedClips.map((_, i) => `[${generatedClips.length + i}:a]asetpts=PTS-STARTPTS[a${i}]`).join('; ')
        : '';

    // 2. Define the inputs for the concat filters.
    const videoConcatInputs = generatedClips.map((_, i) => `[v${i}]`).join('');
    const audioConcatInputs = hasAudio ? generatedClips.map((_, i) => `[a${i}]`).join('') : '';

    // 3. Define the concat filters themselves.
    const concatVideoFilter = `${videoConcatInputs}concat=n=${generatedClips.length}:v=1:a=0[v]`;
    const concatAudioFilter = hasAudio ? `${audioConcatInputs}concat=n=${generatedClips.length}:v=0:a=1[a]` : '';

    // 4. Join all parts of the filter graph.
    const filterComplexParts = [videoSetptsFilters];
    if (hasAudio) {
        filterComplexParts.push(audioSetptsFilters);
    }
    filterComplexParts.push(concatVideoFilter);
    if (hasAudio) {
        filterComplexParts.push(concatAudioFilter);
    }
    const filterComplex = filterComplexParts.join('; ');

    const mapArgs = hasAudio ? ['-map', '[v]', '-map', '[a]'] : ['-map', '[v]'];
    const allInputs = [...videoInputs, ...(hasAudio ? audioInputs : [])];
    
    const args = [
        ...allInputs,
        '-filter_complex', filterComplex,
        ...mapArgs,
        '-c:v', 'libx264', // Re-encode to ensure compatibility
    ];

    if (hasAudio) {
        args.push(
          '-c:a', 'aac', // Standard audio codec
          '-shortest' // End encoding when the shortest stream ends (video or audio)
        );
    }
    
    args.push('output.mp4');
    
    onProgress('Finalizing video... This may take a while.');
    await ffmpeg.exec(args);

    onProgress('Finishing up...');
    const data = await ffmpeg.readFile('output.mp4');
    const url = URL.createObjectURL(new Blob([(data as Uint8Array).buffer], { type: 'video/mp4' }));

    return url;
};