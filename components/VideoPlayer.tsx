import React from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  onReset: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, onReset }) => {
  return (
    <div className="space-y-6 text-center">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
        Your Masterpiece is Ready!
      </h2>
      <div className="bg-black rounded-lg overflow-hidden border border-gray-700 shadow-lg shadow-black/30">
        <video src={videoUrl} controls autoPlay loop className="w-full h-auto max-h-[60vh]" />
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <a
          href={videoUrl}
          download={`ideagen-video-${Date.now()}.mp4`}
          className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/20 focus:outline-none focus:ring-4 focus:ring-green-500/50"
        >
          Download Video
        </a>
        <button
          onClick={onReset}
          className="w-full sm:w-auto bg-gray-700/50 hover:bg-gray-700 text-gray-300 font-medium py-3 px-6 rounded-lg transition-colors border border-gray-600/50"
        >
          Create New Project
        </button>
      </div>
    </div>
  );
};