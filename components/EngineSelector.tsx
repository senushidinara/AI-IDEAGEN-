import React from 'react';
import type { Engine } from '../types';

interface EngineSelectorProps {
  engine: Engine;
  setEngine: (engine: Engine) => void;
}

const EngineButton: React.FC<{
    label: string;
    value: Engine;
    current: Engine;
    onClick: (value: Engine) => void;
}> = ({ label, value, current, onClick }) => {
    const isActive = value === current;
    return (
        <button
            onClick={() => onClick(value)}
            className={`relative flex-1 px-4 py-2 text-sm font-semibold transition-colors duration-300 focus:outline-none ${
                isActive ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
        >
            {label}
        </button>
    );
};

export const EngineSelector: React.FC<EngineSelectorProps> = ({ engine, setEngine }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
        <label className="text-sm font-medium text-gray-300">Generation Engine</label>
        <div className="relative flex w-full max-w-xs p-1 bg-gray-900/70 border border-gray-700 rounded-lg shadow-inner shadow-black/20">
            <div
                className={`absolute top-1 bottom-1 bg-purple-600/80 rounded-md transition-all duration-300 ease-in-out`}
                style={{
                    width: 'calc(50% - 4px)',
                    transform: engine === 'gemini' ? 'translateX(4px)' : 'translateX(calc(100% + 4px))',
                }}
            />
            <EngineButton label="Gemini" value="gemini" current={engine} onClick={setEngine} />
            <EngineButton label="Cerebras" value="cerebras" current={engine} onClick={setEngine} />
        </div>
    </div>
  );
};