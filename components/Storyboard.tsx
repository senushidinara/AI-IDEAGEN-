import React from 'react';
import type { Clip } from '../types';
import { ClipForm } from './ClipForm';

interface StoryboardProps {
  clips: Clip[];
  setClips: React.Dispatch<React.SetStateAction<Clip[]>>;
  onGenerate: () => void;
  onMerge: () => void;
  canMerge: boolean;
}

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);

export const Storyboard: React.FC<StoryboardProps> = ({ clips, setClips, onGenerate, onMerge, canMerge }) => {

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
        voice: 'Kore',
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

  const canGenerate = clips.length > 0 && clips.every(c => c.prompt.trim() !== '');

  return (
    <div className="space-y-6">
        <div className="bg-blue-900/30 border border-blue-500 text-blue-200 px-4 py-3 rounded-lg text-sm flex items-start">
            <InfoIcon/>
            <div>
                <strong className="font-semibold">How it works:</strong> Add one or more clips to the storyboard. Generate them individually, then merge them into a single video.
            </div>
        </div>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {clips.map((clip, index) => (
          <ClipForm
            key={clip.id}
            clip={clip}
            index={index}
            onUpdate={(updated) => updateClip(clip.id, updated)}
            onRemove={() => removeClip(clip.id)}
          />
        ))}
      </div>
      <div className="border-t border-gray-700 pt-6 space-y-4">
        <button
          type="button"
          onClick={addClip}
          className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Clip to Storyboard
        </button>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={onGenerate}
            disabled={!canGenerate}
            className="w-full sm:w-auto flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate All Clips
          </button>
           <button
            onClick={onMerge}
            disabled={!canMerge}
            className="w-full sm:w-auto flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Merge & Finalize Video
          </button>
        </div>
      </div>
    </div>
  );
};
