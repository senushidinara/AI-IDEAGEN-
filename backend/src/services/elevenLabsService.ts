import fetch from 'node-fetch';

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