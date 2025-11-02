
import React from 'react';

interface ApiKeySelectorProps {
  onApiKeySelected: () => void;
}

export const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onApiKeySelected }) => {
  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Optimistically assume key selection was successful to update UI immediately
      onApiKeySelected();
    } else {
        alert('aistudio environment not found. API key must be set via environment variables.');
    }
  };

  return (
    <div className="text-center p-8 bg-gray-800 rounded-lg border border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-white">Welcome!</h2>
      <p className="text-gray-400 mb-6">
        To generate videos, you need to select a Google AI Studio API key. 
        Video generation is a billable feature.
      </p>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
          onClick={handleSelectKey}
          className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          Select API Key
        </button>
        <a
          href="https://ai.google.dev/gemini-api/docs/billing"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto text-center bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Learn about Billing
        </a>
      </div>
    </div>
  );
};
