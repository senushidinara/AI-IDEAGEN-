export interface VideoConfig {
  aspectRatio: '16:9' | '9:16';
  resolution: '720p' | '1080p';
}

export interface ImageFile {
  base64: string;
  mimeType: string;
}

export interface VoiceoverConfig {
  script: string;
  voice: string;
}

export interface Clip {
  id: number;
  prompt: string;
  image: ImageFile | null;
  videoConfig: VideoConfig;
  voiceoverConfig: VoiceoverConfig;
  // For generated content
  isGenerating?: boolean;
  generatedVideoUrl?: string;
  generatedAudioData?: Uint8Array;
}
