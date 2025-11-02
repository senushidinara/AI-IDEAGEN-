

import React from 'react';

const KeyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-purple-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
);

// Fix: Update ApiKeySelector to use window.aistudio.openSelectKey per guidelines
export const ApiKeySelector: React.FC<{ onKeySelected: () => void }> = ({ onKeySelected }) => {
  const handleSelectKey = async () => {
    // @ts-ignore
    if (window.aistudio) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      // Per guidelines, assume key selection was successful to avoid race conditions.
      onKeySelected();
    } else {
        console.error('window.aistudio is not available.');
        alert('API Key selection is not available in this environment.');
    }
  };
  
  return (
    <div className="text-center p-4 sm:p-8 relative">
        <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 animate-pulse-slow"></div>
        <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-lg p-8 ring-1 ring-white/10 text-left">
            <div className="text-center">
                <KeyIcon />
                <h2 className="text-3xl font-bold mb-4 text-white">Welcome to Ideagen!</h2>
                <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                    To get started, please select your Google AI Studio API key. Video generation with Veo is a billable feature.
                </p>
                <button
                    onClick={handleSelectKey}
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
                >
                    Select API Key
                </button>
            </div>
             <div className="mt-8 pt-6 border-t border-gray-700/50 text-center">
                <a
                  href="https://ai.google.dev/gemini-api/docs/billing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-300 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Learn about Billing
                </a>
            </div>
        </div>
    </div>
  );
};