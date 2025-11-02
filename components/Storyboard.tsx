import React from 'react';
import type { Clip, Engine, VoiceoverEngine } from '../types';
import { ClipForm } from './ClipForm';
import { EngineSelector } from './EngineSelector';
import { VoiceoverEngineSelector } from './VoiceoverEngineSelector';

interface StoryboardProps {
  clips: Clip[];
  setClips: React.Dispatch<React.SetStateAction<Clip[]>>;
  onGenerate: () => void;
  onMerge: () => void;
  canMerge: boolean;
  engine: Engine;
  setEngine: (engine: Engine) => void;
  voiceoverEngine: VoiceoverEngine;
  setVoiceoverEngine: (engine: VoiceoverEngine) => void;
}

const FilmIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-3 flex-shrink-0 text-purple-300" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM4 4a1 1 0 00-1 1v1h14V5a1 1 0 00-1-1H4zM3 8v2h2V8H3zm4 0v2h2V8H7zm4 0v2h2V8h-2zm4 0v2h2V8h-2zM3 12v2h2v-2H3zm4 0v2h2v-2H7zm4 0v2h2v-2h-2zm4 0v2h2v-2h-2z" />
    </svg>
);


export const Storyboard: React.FC<StoryboardProps> = ({ clips, setClips, onGenerate, onMerge, canMerge, engine, setEngine, voiceoverEngine, setVoiceoverEngine }) => {

  const addClip = () => {
    const newClip: Clip = {
      id: Date.now(),
      prompt: '',
      image: null,
      videoConfig: {
        aspectRatio: '16:9',
        resolution: '720p',
      },
      voiceoverConfig: {
        script: '',
        voice: voiceoverEngine === 'gemini' ? 'Kore' : '21m00Tcm4TlvDq8ikWAM',
      },
    };
    setClips([...clips, newClip]);
  };

  const updateClip = (id: number, updatedClip: Partial<Clip>) => {
    setClips(clips.map(clip => (clip.id === id ? { ...clip, ...updatedClip } : clip)));
  };

  const removeClip = (id: number) => {
    setClips(clips.filter(clip => clip.id !== id));
  };
  
  const handleVoiceoverEngineChange = (newEngine: VoiceoverEngine) => {
    setVoiceoverEngine(newEngine);
    // When the engine changes, update all clips to use the new default voice
    // to prevent an invalid state (e.g., a Gemini voice ID with ElevenLabs engine).
    const defaultVoice = newEngine === 'gemini' ? 'Kore' : '21m00Tcm4TlvDq8ikWAM'; // Gemini 'Kore' vs ElevenLabs 'Rachel'
    setClips(prevClips => prevClips.map(clip => ({
      ...clip,
      voiceoverConfig: {
        ...clip.voiceoverConfig,
        voice: defaultVoice
      }
    })));
  };

  const canGenerate = clips.length > 0 && clips.every(c => c.prompt.trim() !== '');

  return (
    <div className="space-y-6">
        <div className="bg-purple-900/30 border border-purple-700/50 text-purple-200 px-4 py-3 rounded-lg text-sm flex items-start shadow-inner shadow-purple-900/20">
            <FilmIcon/>
            <div>
                <strong className="font-semibold block">Feature Film Loaded!</strong> The full script for "Stardust Gambit" is pre-loaded below. Generating all clips will take a significant amount of time.
            </div>
        </div>
      <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-2 -mr-2">
        {clips.map((clip, index) => (
          <ClipForm
            key={clip.id}
            clip={clip}
            index={index}
            onUpdate={(updated) => updateClip(clip.id, updated)}
            onRemove={() => removeClip(clip.id)}
            voiceoverEngine={voiceoverEngine}
          />
        ))}
      </div>
      <div className="border-t border-gray-700 pt-6 space-y-4">
        <button
          type="button"
          onClick={addClip}
          className="w-full bg-gray-700/50 hover:bg-gray-700 text-gray-300 font-medium py-3 px-6 rounded-lg transition-colors border border-gray-600/50 flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Clip to Storyboard
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <EngineSelector engine={engine} setEngine={setEngine} />
          <VoiceoverEngineSelector engine={voiceoverEngine} setEngine={handleVoiceoverEngineChange} />
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={onGenerate}
            disabled={!canGenerate}
            className="w-full sm:w-auto flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            Generate All Clips
          </button>
           <button
            onClick={onMerge}
            disabled={!canMerge}
            className="w-full sm:w-auto flex-1 bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/20 focus:outline-none focus:ring-4 focus:ring-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            Merge & Finalize Video
          </button>
        </div>
      </div>
    </div>
  );
};