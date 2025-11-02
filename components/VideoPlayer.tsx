import React from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  onReset: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, onReset }) => {
  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-400">
        Your Final Video is Ready!
      </h2>
      <div className="bg-black rounded-lg overflow-hidden border border-gray-700 shadow-lg">
        <video src={videoUrl} controls autoPlay loop className="w-full h-auto max-h-[60vh]" />
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <a
          href={videoUrl}
          download={`ai-final-video-${Date.now()}.mp4`}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Download Video
        </a>
        <button
          onClick={onReset}
          className="w-full sm:w-auto bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Create New Project
        </button>
      </div>
    </div>
  );
};
