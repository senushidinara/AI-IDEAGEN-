
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

// Fix: Removed unused functions (decode, generateVideo, generateSpeech, createWavBlob).
// These functions contained client-side API calls which is not the intended architecture for this application
// and represents a security risk. All API calls are handled by the backend via `apiService`.
