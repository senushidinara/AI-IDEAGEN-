import React, { useState, useEffect, useCallback } from 'react';
import { ApiKeySelector } from './components/ApiKeySelector';
import { Storyboard } from './components/Storyboard';
import { LoadingIndicator } from './components/LoadingIndicator';
import { VideoPlayer } from './components/VideoPlayer';
import { generateVideo, generateSpeech } from './services/geminiService';
import type { Clip, VideoConfig, VoiceoverConfig, ImageFile } from './types';

type AppStatus = 'init' | 'selecting_key' | 'editing' | 'generating' | 'merging' | 'done';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>('init');
  const [clips, setClips] = useState<Clip[]>([]);
  const [finalVideoUrl, setFinalVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const checkApiKey = useCallback(async () => {
    try {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setStatus(hasKey ? 'editing' : 'selecting_key');
      } else {
          console.warn('aistudio is not available. Assuming API key is set via environment variable.');
          setStatus('editing');
      }
    } catch (e) {
      console.error("Error checking API key status:", e);
      setError("Could not verify API key status. Please select a new key if the problem persists.");
      setStatus('selecting_key');
    }
  }, []);

  useEffect(() => {
    checkApiKey();
  }, [checkApiKey]);
  
  const handleApiKeySelected = () => {
    setStatus('editing');
  };
  
  const resetApiKey = () => {
    setStatus('selecting_key');
    setError('API Key not found or invalid. Please select a valid API key and try again.');
  };

  const handleGenerateAll = async () => {
    setError(null);
    setStatus('generating');

    for (let i = 0; i < clips.length; i++) {
        setLoadingMessage(`Generating clip ${i + 1} of ${clips.length}...`);
        
        try {
            const currentClip = clips[i];
            
            // Set generating status for the specific clip
            setClips(prev => prev.map(c => c.id === currentClip.id ? { ...c, isGenerating: true } : c));

            const promises: [Promise<string>, Promise<Uint8Array | null>] = [
                generateVideo(currentClip.prompt, currentClip.image, currentClip.videoConfig, resetApiKey),
                currentClip.voiceoverConfig.script.trim() ? generateSpeech(currentClip.voiceoverConfig, resetApiKey) : Promise.resolve(null),
            ];

            const [generatedVideoUrl, generatedAudioData] = await Promise.all(promises);

            setClips(prev => prev.map(c => c.id === currentClip.id ? { ...c, generatedVideoUrl, generatedAudioData: generatedAudioData ?? undefined, isGenerating: false } : c));
        } catch (e: any) {
            console.error(e);
            setError(`Error generating clip ${i + 1}: ${e.message}`);
            setStatus('editing');
            setClips(prev => prev.map(c => ({...c, isGenerating: false}))); // Reset all generating statuses
            return;
        }
    }
    setStatus('editing'); // Back to editing to show merge button
  };

  const handleMerge = async () => {
    setError(null);
    setStatus('merging');
    setLoadingMessage("Preparing to merge videos...");

    try {
      const { mergeClips } = await import('./services/ffmpegService');
      const finalUrl = await mergeClips(clips.filter(c => c.generatedVideoUrl), (message) => setLoadingMessage(message));
      setFinalVideoUrl(finalUrl);
      setStatus('done');
    } catch(e: any) {
      console.error(e);
      setError(`Failed to merge videos: ${e.message}`);
      setStatus('editing');
    }
  }

  const handleReset = () => {
    setFinalVideoUrl(null);
    setClips([]);
    setError(null);
    setStatus('editing');
  };
  
  const renderContent = () => {
     if (status === 'generating' || status === 'merging') {
        return <LoadingIndicator message={loadingMessage} />;
     }
     if (status === 'done' && finalVideoUrl) {
        return <VideoPlayer videoUrl={finalVideoUrl} onReset={handleReset} />;
     }
     if (status === 'editing') {
         const allClipsGenerated = clips.length > 0 && clips.every(c => c.generatedVideoUrl);
         return <Storyboard clips={clips} setClips={setClips} onGenerate={handleGenerateAll} onMerge={handleMerge} canMerge={allClipsGenerated}/>;
     }
     if (status === 'selecting_key') {
        return <ApiKeySelector onApiKeySelected={handleApiKeySelected} />;
     }
     return <LoadingIndicator message="Initializing..." />; // Initializing or init state
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 selection:bg-purple-500 selection:text-white">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            AI Video Generator
          </h1>
          <p className="text-gray-400 mt-2">Create epic videos by generating and merging clips in a storyboard.</p>
        </header>

        <main className="bg-gray-800/50 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-2xl border border-gray-700 min-h-[400px] flex flex-col justify-center">
            {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 text-center">
                    <p>{error}</p>
                </div>
            )}
            {renderContent()}
        </main>
        <footer className="text-center mt-8 text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} AI Video Generator. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;