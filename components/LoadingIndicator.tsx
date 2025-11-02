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

interface LoadingIndicatorProps {
    message?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message }) => {
    const [displayMessage, setDisplayMessage] = useState(message || defaultMessages[0]);

    useEffect(() => {
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
    }, [message]);

    return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-xl font-semibold text-white mb-2">Working on it...</h2>
            <p className="text-gray-400 transition-opacity duration-500">
                {displayMessage}
            </p>
        </div>
    );
};
