
import React, { useState, useEffect } from 'react';

const defaultMessages = [
  "Warming up the AI director...",
  "Gathering digital props and costumes...",
  "Choreographing digital actors...",
  "Setting up the virtual cameras...",
  "Rendering frames...",
  "Applying special effects...",
  "This can take a few minutes, please be patient.",
];

interface GeneratingClipInfo {
    index: number;
    total: number;
    prompt: string;
    script: string;
}

interface LoadingIndicatorProps {
    message: string;
    clipInfo?: GeneratingClipInfo | null;
}

const PromptIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
    </svg>
);

const ScriptIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0a5 5 0 01-5 5A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
    </svg>
);


export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message, clipInfo }) => {
    const [displayMessage, setDisplayMessage] = useState(message || defaultMessages[0]);

    useEffect(() => {
        if (!clipInfo) {
            if (message) {
                 setDisplayMessage(message);
            } else {
                const interval = setInterval(() => {
                    setDisplayMessage(prev => {
                        const currentIndex = defaultMessages.indexOf(prev);
                        const nextIndex = (currentIndex + 1) % defaultMessages.length;
                        return defaultMessages[nextIndex];
                    });
                }, 3000);
                return () => clearInterval(interval);
            }
        }
    }, [message, clipInfo]);

    return (
        <div className="flex flex-col items-center justify-center p-8 text-center w-full">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-xl font-semibold text-white mb-2">Working on it...</h2>
            
            {clipInfo ? (
                <div className="w-full max-w-2xl mt-4">
                    <p className="text-gray-300 font-semibold text-lg mb-4">
                        Generating Clip {clipInfo.index} of {clipInfo.total}
                    </p>
                    <div className="bg-gray-900/60 border border-gray-700/80 rounded-lg p-4 text-left space-y-3 shadow-lg shadow-black/20">
                        <div className="flex items-start gap-3">
                            <PromptIcon />
                            <div>
                                <h4 className="font-semibold text-gray-200">Prompt:</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">{clipInfo.prompt}</p>
                            </div>
                        </div>
                        {clipInfo.script && (
                             <div className="flex items-start gap-3 border-t border-gray-700 pt-3 mt-3">
                                <ScriptIcon />
                                <div>
                                    <h4 className="font-semibold text-gray-200">Voiceover:</h4>
                                    <p className="text-gray-400 text-sm italic">"{clipInfo.script}"</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                 <p className="text-gray-400 transition-opacity duration-500">
                    {displayMessage}
                </p>
            )}
        </div>
    );
};
