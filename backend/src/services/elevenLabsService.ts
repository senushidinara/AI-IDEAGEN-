import fetch from 'node-fetch';
import type { CustomVoice } from '../../../types';

export const generateElevenLabsSpeech = async (text: string, voiceId: string = '21m00Tcm4TlvDq8ikWAM'): Promise<Uint8Array> => {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    
    if (!apiKey || apiKey === 'YOUR_ELEVENLABS_API_KEY_HERE') {
        throw new Error("ElevenLabs API key is not configured in the backend's .env file.");
    }

    const API_URL = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

    console.log(`Generating speech with ElevenLabs (voice: ${voiceId}) for text: "${text.substring(0, 30)}..."`);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': apiKey,
            },
            body: JSON.stringify({
                text: text,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                }
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText} - ${errorBody}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        return new Uint8Array(arrayBuffer);

    } catch (error: any) {
        console.error("Error calling ElevenLabs API:", error);
        throw new Error(`Failed to generate speech with ElevenLabs: ${error.message}`);
    }
};

/**
 * MOCK IMPLEMENTATION for ElevenLabs voice cloning.
 * In a real application, this function would make a multipart/form-data API call
 * to the ElevenLabs '/v1/voices/add' endpoint.
 *
 * This mock simulates the process and returns a placeholder voice object.
 * @returns A promise that resolves to a CustomVoice object.
 */
export const addClonedVoice = async (
  name: string,
  filesData: { base64: string, mimeType: string }[]
): Promise<CustomVoice> => {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    
    if (!apiKey || apiKey === 'YOUR_ELEVENLABS_API_KEY_HERE') {
        throw new Error("ElevenLabs API key is not configured in the backend's .env file.");
    }
    
    if (!name || filesData.length === 0) {
        throw new Error("Voice name and at least one audio file are required.");
    }

    console.log(`Simulating voice cloning for voice name: "${name}" with ${filesData.length} files.`);
    
    // A real implementation would look something like this, using a library like 'form-data':
    /*
    const FormData = require('form-data');
    const form = new FormData();
    form.append('name', name);
    filesData.forEach((file, index) => {
        const buffer = Buffer.from(file.base64, 'base64');
        form.append(`files`, buffer, { filename: `sample-${index}.mp3`, contentType: file.mimeType });
    });

    const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
        method: 'POST',
        headers: {
            'xi-api-key': apiKey,
            ...form.getHeaders(),
        },
        body: form,
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const { voice_id } = await response.json();
    return { id: voice_id, name };
    */

   // MOCK RESPONSE
   const mockVoiceId = `cloned_voice_${Date.now()}`;
   console.log(`Successfully simulated cloning. Mock Voice ID: ${mockVoiceId}`);
   
   return { id: mockVoiceId, name };
};
