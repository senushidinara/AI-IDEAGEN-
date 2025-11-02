import React from 'react';

interface ApiKeySelectorProps {
  onApiKeySelected: () => void;
  error?: string | null;
}

export const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onApiKeySelected, error }) => {
  const handleSelectKey = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        onApiKeySelected();
      } catch (e) {
        console.error("API key selection was cancelled or failed.", e);
      }
    } else {
        alert('aistudio environment not found. API key must be set via environment variables.');
    }
  };

  return (
    <div className="text-center p-8">
       {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 text-center">
            <p>{error}</p>
          </div>
       )}
      <h2 className="text-3xl font-bold mb-4 text-white">Welcome to Ideagen!</h2>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        To begin creating, you need to select a Google AI Studio API key. 
        Please note that video generation is a billable feature.
      </p>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
          onClick={handleSelectKey}
          className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
        >
          Select API Key
        </button>
        <a
          href="https://ai.google.dev/gemini-api/docs/billing"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto text-center bg-gray-700/50 hover:bg-gray-700 text-gray-300 font-medium py-3 px-6 rounded-lg transition-colors border border-gray-600/50"
        >
          Learn about Billing
        </a>
      </div>
    </div>
  );
};