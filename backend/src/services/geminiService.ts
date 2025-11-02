
import { GoogleGenAI, Modality } from '@google/genai';
import type { VideoConfig, ImageFile, VoiceoverConfig } from '../../../types';

function decode(base64: string): Uint8Array {
  return Buffer.from(base64, 'base64');
}

export const generateVideo = async (
  prompt: string,
  image: ImageFile | null,
  config: VideoConfig
): Promise<Blob> => {
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!geminiApiKey) {
    throw new Error('Gemini API key (GEMINI_API_KEY or GOOGLE_API_KEY) is not configured in the backend environment variables.');
  }

  const ai = new GoogleGenAI({ apiKey: geminiApiKey });
  
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

    const videoResponse = await fetch(`${downloadLink}&key=${geminiApiKey}`);
    if (!videoResponse.ok) {
        throw new Error(`Failed to download video: ${videoResponse.statusText}`);
    }

    return videoResponse.blob();

  } catch (error: any) {
    if (error.message && error.message.includes('API key not valid')) {
      throw new Error('The provided Gemini API key (GEMINI_API_KEY or GOOGLE_API_KEY) is invalid.');
    }
    throw error;
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!geminiApiKey) {
        throw new Error('Gemini API key (GEMINI_API_KEY or GOOGLE_API_KEY) is not configured in the backend environment variables.');
    }

    const ai = new GoogleGenAI({ apiKey: geminiApiKey });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);

        if (part?.inlineData) {
            return part.inlineData.data; // This is the base64 string
        }
        
        throw new Error('Image generation succeeded, but no image data was found in the response.');

    } catch (error: any) {
         if (error.message && error.message.includes('API key not valid')) {
            throw new Error('The provided Gemini API key (GEMINI_API_KEY or GOOGLE_API_KEY) is invalid.');
        }
        throw new Error(`Failed to generate preview image: ${error.message}`);
    }
};


export const generateSpeech = async (
    config: VoiceoverConfig
): Promise<Uint8Array> => {
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!geminiApiKey) {
        throw new Error('Gemini API key (GEMINI_API_KEY or GOOGLE_API_KEY) is not configured in the backend environment variables.');
    }
    
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });

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
        if (error.message && error.message.includes('API key not valid')) {
             throw new Error('The provided Gemini API key (GEMINI_API_KEY or GOOGLE_API_KEY) is invalid.');
        }
        throw new Error(`Failed to generate speech: ${error.message}`);
    }
};