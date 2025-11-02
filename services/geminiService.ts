
import { GoogleGenAI, Modality } from '@google/genai';
import type { VideoConfig, ImageFile, VoiceoverConfig } from '../types';

// This function converts a file to a base64 string
export const fileToBase64 = (file: File): Promise<{base64: string, mimeType: string}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve({ base64, mimeType: file.type });
    };
    reader.onerror = (error) => reject(error);
  });
};

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}


export const generateVideo = async (
  prompt: string,
  image: ImageFile | null,
  config: VideoConfig,
  onApiKeyError: () => void
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error('API key is not configured. Please select an API key.');
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const generationPayload: any = {
        model: 'veo-3.1-fast-generate-preview',
        prompt,
        config: {
            numberOfVideos: 1,
            resolution: config.resolution,
            aspectRatio: config.aspectRatio,
        },
    };

    if (image) {
        generationPayload.image = {
            imageBytes: image.base64,
            mimeType: image.mimeType,
        };
    }

    let operation = await ai.models.generateVideos(generationPayload);

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }
    
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error('Video generation succeeded, but no download link was found.');
    }

    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!videoResponse.ok) {
        throw new Error(`Failed to download video: ${videoResponse.statusText}`);
    }

    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);

  } catch (error: any) {
    if (error.message && error.message.includes('Requested entity was not found')) {
      onApiKeyError();
      throw new Error('API Key not found or invalid. Please select a valid API key.');
    }
    throw error;
  }
};

export const generateSpeech = async (
    config: VoiceoverConfig,
    onApiKeyError: () => void
): Promise<Uint8Array> => {
    if (!process.env.API_KEY) {
        throw new Error('API key is not configured. Please select an API key.');
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: config.script }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: config.voice },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error('Audio generation failed, no audio data received.');
        }
        return decode(base64Audio);

    } catch (error: any) {
        if (error.message && error.message.includes('Requested entity was not found')) {
            onApiKeyError();
            throw new Error('API Key not found or invalid. Please select a valid API key.');
        }
        throw new Error(`Failed to generate speech: ${error.message}`);
    }
};

// Utility to create a WAV file blob from raw PCM audio data
export const createWavBlob = (pcmData: Uint8Array): Blob => {
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
