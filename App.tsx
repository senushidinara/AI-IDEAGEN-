
import React, { useState, useEffect } from 'react';
import { Storyboard } from './components/Storyboard';
import { LoadingIndicator } from './components/LoadingIndicator';
import { VideoPlayer } from './components/VideoPlayer';
import { generateClip } from './services/apiService';
import { initialClips } from './initialClips';
import type { Clip } from './types';
import { ApiKeySelector } from './components/ApiKeySelector';

type AppStatus = 'editing' | 'generating' | 'merging' | 'done';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>('editing');
  const [clips, setClips] = useState<Clip[]>(initialClips);
  const [finalVideoUrl, setFinalVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  
  useEffect(() => {
    // This check now primarily serves as a visual guide for the user to set up their .env file.
    // The actual API key usage is handled by the backend server.
    setHasApiKey(!!process.env.API_KEY);
  }, []);
  
  const startGenerationProcess = async () => {
    setStatus('generating');

    for (let i = 0; i < clips.length; i++) {
        setLoadingMessage(`Generating clip ${i + 1} of ${clips.length}...`);
        
        try {
            const currentClip = clips[i];
            
            setClips(prev => prev.map(c => c.id === currentClip.id ? { ...c, isGenerating: true } : c));

            const { generatedVideoUrl, generatedAudioData } = await generateClip(currentClip);

            setClips(prev => prev.map(c => c.id === currentClip.id ? { ...c, generatedVideoUrl, generatedAudioData, isGenerating: false } : c));
        } catch (e: any) {
            console.error(e);
            setError(`Error generating clip ${i + 1}: ${e.message}. Make sure the backend server is running and the API key is correct.`);
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
     if (status === 'generating' || status === 'merging') {
        return <LoadingIndicator message={loadingMessage} />;
     }
     if (status === 'done' && finalVideoUrl) {
        return <VideoPlayer videoUrl={finalVideoUrl} onReset={handleReset} />;
     }
     
     const allClipsGenerated = clips.length > 0 && clips.every(c => c.generatedVideoUrl);
     return <Storyboard clips={clips} setClips={setClips} onGenerate={handleGenerateAll} onMerge={handleMerge} canMerge={allClipsGenerated}/>;
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
               <ApiKeySelector />
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