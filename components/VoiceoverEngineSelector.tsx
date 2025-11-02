import React from 'react';
import type { VoiceoverEngine } from '../types';

interface VoiceoverEngineSelectorProps {
  engine: VoiceoverEngine;
  setEngine: (engine: VoiceoverEngine) => void;
}

const ElevenLabsLogo = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block -mt-0.5"
    aria-hidden="true"
  >
    <path d="M8 6H10V18H8V6Z" />
    <path d="M14 9H16V18H14V9Z" />
  </svg>
);


const EngineButton: React.FC<{
    label: string;
    value: VoiceoverEngine;
    current: VoiceoverEngine;
    onClick: (value: VoiceoverEngine) => void;
}> = ({ label, value, current, onClick }) => {
    const isActive = value === current;
    return (
        <button
            onClick={() => onClick(value)}
            className={`relative flex-1 px-4 py-2 text-sm font-semibold transition-colors duration-300 focus:outline-none flex items-center justify-center gap-2 ${
                isActive ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
        >
            <span>{label}</span>
            {value === 'elevenlabs' && isActive && <ElevenLabsLogo />}
        </button>
    );
};

export const VoiceoverEngineSelector: React.FC<VoiceoverEngineSelectorProps> = ({ engine, setEngine }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
        <label className="text-sm font-medium text-gray-300">Voiceover Engine</label>
        <div className="relative flex w-full max-w-xs p-1 bg-gray-900/70 border border-gray-700 rounded-lg shadow-inner shadow-black/20">
            <div
                className={`absolute top-1 bottom-1 bg-purple-600/80 rounded-md transition-all duration-300 ease-in-out`}
                style={{
                    width: 'calc(50% - 4px)',
                    transform: engine === 'gemini' ? 'translateX(4px)' : 'translateX(calc(100% + 4px))',
                }}
            />
            <EngineButton label="Gemini" value="gemini" current={engine} onClick={setEngine} />
            <EngineButton label="ElevenLabs" value="elevenlabs" current={engine} onClick={setEngine} />
        </div>
    </div>
  );
};