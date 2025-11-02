import type { Clip, Engine, VoiceoverEngine } from '../types';

// This function converts a file to a base64 string for upload
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

// Decodes a base64 string into a Uint8Array (for audio)
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Converts a base64 string to a Blob (for video)
const b64toBlob = (b64Data: string, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
};


export const generateClip = async (clip: Clip, engine: Engine, voiceoverEngine: VoiceoverEngine): Promise<{ generatedVideoUrl: string; generatedAudioData?: Uint8Array }> => {
    // The backend is expected to be running on localhost:8080 during development
    const backendUrl = 'http://localhost:8080/api/generate-clip';

    const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...clip, engine, voiceoverEngine })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred on the backend.' }));
        throw new Error(errorData.message || `Backend request failed with status ${response.status}`);
    }

    const { videoBase64, audioBase64 } = await response.json();

    if (!videoBase64) {
        throw new Error('Backend did not return video data.');
    }

    const videoBlob = b64toBlob(videoBase64, 'video/mp4');
    const videoUrl = URL.createObjectURL(videoBlob);
    
    const audioData = audioBase64 ? decode(audioBase64) : undefined;
    
    return { generatedVideoUrl: videoUrl, generatedAudioData: audioData };
}