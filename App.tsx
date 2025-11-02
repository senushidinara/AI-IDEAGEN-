



import React, { useState, useEffect } from 'react';
import { Storyboard } from './components/Storyboard';
import { LoadingIndicator } from './components/LoadingIndicator';
import { VideoPlayer } from './components/VideoPlayer';
import { generateClip } from './services/apiService';
import { initialClips } from './initialClips';
import type { Clip, Engine, VoiceoverEngine, CustomVoice } from './types';
import { ApiKeySelector } from './components/ApiKeySelector';

type AppStatus = 'editing' | 'generating' | 'merging' | 'done';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>('editing');
  const [clips, setClips] = useState<Clip[]>(initialClips);
  const [finalVideoUrl, setFinalVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  // Fix: Add state to track API key check to prevent UI flicker.
  const [isCheckingApiKey, setIsCheckingApiKey] = useState<boolean>(true);
  const [engine, setEngine] = useState<Engine>('gemini');
  const [voiceoverEngine, setVoiceoverEngine] = useState<VoiceoverEngine>('gemini');
  const [customVoices, setCustomVoices] = useState<CustomVoice[]>([]);
  
  useEffect(() => {
    // Fix: Use window.aistudio.hasSelectedApiKey() to check for the API key per guidelines.
    const checkApiKey = async () => {
      // @ts-ignore
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        // @ts-ignore
        setHasApiKey(await window.aistudio.hasSelectedApiKey());
      }
      setIsCheckingApiKey(false);
    }
    checkApiKey();
  }, []);
  
  const startGenerationProcess = async () => {
    setStatus('generating');

    for (let i = 0; i < clips.length; i++) {
        setLoadingMessage(`Generating clip ${i + 1} of ${clips.length} using ${engine}...`);
        
        try {
            const currentClip = clips[i];
            
            setClips(prev => prev.map(c => c.id === currentClip.id ? { ...c, isGenerating: true } : c));

            const { generatedVideoUrl, generatedAudioData } = await generateClip(currentClip, engine, voiceoverEngine);

            setClips(prev => prev.map(c => c.id === currentClip.id ? { ...c, generatedVideoUrl, generatedAudioData, isGenerating: false } : c));
        } catch (e: any) {
            console.error(e);
            const errorMessage = e.message || '';
            // Fix: Per guidelines, handle API key errors by resetting the key state, prompting the user to select again.
            if (errorMessage.includes('Requested entity was not found') || errorMessage.includes('API Key not found')) {
                setError('API Key not found or invalid. Please select your API key again.');
                setHasApiKey(false);
            } else {
                setError(`Error generating clip ${i + 1}: ${errorMessage}. Make sure the backend server is running.`);
            }
            setStatus('editing');
            setClips(prev => prev.map(c => ({...c, isGenerating: false})));
            return;
        }
    }
    setStatus('editing');
  }

  const handleGenerateAll = async () => {
    setError(null);
    startGenerationProcess();
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
  
  const renderAppContent = () => {
     // Fix: Show a loading indicator while checking for the API key.
     if (isCheckingApiKey) {
        return <LoadingIndicator message="Checking API key status..." />;
     }
     if (status === 'generating' || status === 'merging') {
        return <LoadingIndicator message={loadingMessage} />;
     }
     if (status === 'done' && finalVideoUrl) {
        return <VideoPlayer videoUrl={finalVideoUrl} onReset={handleReset} />;
     }
     
     const allClipsGenerated = clips.length > 0 && clips.every(c => c.generatedVideoUrl);
     return <Storyboard clips={clips} setClips={setClips} onGenerate={handleGenerateAll} onMerge={handleMerge} canMerge={allClipsGenerated} engine={engine} setEngine={setEngine} voiceoverEngine={voiceoverEngine} setVoiceoverEngine={setVoiceoverEngine} customVoices={customVoices} setCustomVoices={setCustomVoices} />;
  }

  return (
    <div className="min-h-screen text-white flex flex-col items-center p-4 selection:bg-purple-500 selection:text-white">
      <div className="w-full max-w-5xl mx-auto py-8">
        <header className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 animated-gradient">
            Ideagen
          </h1>
          <p className="text-gray-400 mt-3 text-lg">Your AI-powered video creation studio.</p>
        </header>

        <main className="bg-gray-900/40 backdrop-blur-md p-4 md:p-6 rounded-2xl shadow-2xl shadow-black/20 border border-gray-700/80 min-h-[400px] flex flex-col justify-center ring-1 ring-white/10">
            {hasApiKey ? (
              <>
                {error && (
                  <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 text-center">
                      <p>{error}</p>
                  </div>
                )}
                {renderAppContent()}
              </>
            ) : (
               <ApiKeySelector onKeySelected={() => setHasApiKey(true)} />
            )}
        </main>
        <footer className="text-center mt-8 text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Ideagen. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;