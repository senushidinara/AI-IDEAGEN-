
import React from 'react';

const KeyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-purple-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
);

export const ApiKeySelector: React.FC = () => {
  return (
    <div className="text-center p-4 sm:p-8 relative">
        <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 animate-pulse-slow"></div>
        <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-lg p-8 ring-1 ring-white/10 text-left">
            <div className="text-center">
                <KeyIcon />
                <h2 className="text-3xl font-bold mb-4 text-white">Welcome to Ideagen!</h2>
                <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                    To get started, please configure your Google AI Studio API key as an environment variable.
                </p>
            </div>
            
            <div className="space-y-6 text-gray-300">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-900/50 text-purple-300 rounded-full flex items-center justify-center font-bold ring-1 ring-purple-700">1</div>
                    <div>
                        <h3 className="font-semibold text-white">Get your API Key</h3>
                        <p className="text-sm text-gray-400">
                            Visit <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-300">Google AI Studio</a> to create and copy your API key.
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-900/50 text-purple-300 rounded-full flex items-center justify-center font-bold ring-1 ring-purple-700">2</div>
                    <div>
                        <h3 className="font-semibold text-white">Create a `.env` file</h3>
                        <p className="text-sm text-gray-400">In the root directory of this project, create a new file and name it <code className="bg-gray-800 text-pink-400 px-1.5 py-0.5 rounded">.env</code>.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-900/50 text-purple-300 rounded-full flex items-center justify-center font-bold ring-1 ring-purple-700">3</div>
                    <div>
                        <h3 className="font-semibold text-white">Set the environment variable</h3>
                        <p className="text-sm text-gray-400">Add the following line to your <code className="bg-gray-800 text-pink-400 px-1.5 py-0.5 rounded">.env</code> file, replacing the placeholder with your actual key:</p>
                        <pre className="bg-gray-800 rounded-md p-3 mt-2 text-sm text-gray-300"><code>API_KEY=YOUR_API_KEY_HERE</code></pre>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-900/50 text-purple-300 rounded-full flex items-center justify-center font-bold ring-1 ring-purple-700">4</div>
                    <div>
                        <h3 className="font-semibold text-white">Refresh the page</h3>
                        <p className="text-sm text-gray-400">Once you've saved the file, refresh this page to start using the app.</p>
                    </div>
                </div>
            </div>
             <div className="mt-8 pt-6 border-t border-gray-700/50 text-center">
                <a
                  href="https://ai.google.dev/gemini-api/docs/billing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-300 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Learn about Billing (Video generation is a billable feature)
                </a>
            </div>
        </div>
    </div>
  );
};
