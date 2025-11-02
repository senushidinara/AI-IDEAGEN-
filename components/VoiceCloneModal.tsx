import React, { useState } from 'react';
import { cloneVoice } from '../services/apiService';
import type { CustomVoice } from '../types';

// Icons for UI elements
const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);

const AudioFileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path d="M18 3a1 1 0 00-1.447-.894L4 6.447V4a1 1 0 00-2 0v12a1 1 0 002 0v-2.447l12.553 3.346A1 1 0 0018 17V3z" />
    </svg>
);

const Spinner = () => <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>;

interface VoiceCloneModalProps {
    onClose: () => void;
    onVoiceCloned: (newVoice: CustomVoice) => void;
}

export const VoiceCloneModal: React.FC<VoiceCloneModalProps> = ({ onClose, onVoiceCloned }) => {
    const [voiceName, setVoiceName] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files) {
             setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
        }
    }

    const removeFile = (fileName: string) => {
        setFiles(files.filter(file => file.name !== fileName));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!voiceName.trim()) {
            setError('Please provide a name for your voice.');
            return;
        }
        if (files.length === 0) {
            setError('Please upload at least one audio sample.');
            return;
        }
        
        setIsLoading(true);
        try {
            const newVoice = await cloneVoice(voiceName, files);
            onVoiceCloned(newVoice);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg mx-auto" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-white">Clone a New Voice</h2>
                            <button type="button" onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                        </div>
                        <p className="text-gray-400 text-sm mb-6">Upload 1-5 minutes of clean audio (without background noise) to create a clone of your voice.</p>
                        
                        {error && (
                            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded-lg mb-4 text-sm">
                                <p>{error}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="voiceName" className="block text-sm font-medium text-gray-300 mb-1.5">Voice Name</label>
                                <input
                                    type="text"
                                    id="voiceName"
                                    value={voiceName}
                                    onChange={(e) => setVoiceName(e.target.value)}
                                    placeholder="e.g., My Narration Voice"
                                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors focus:outline-none"
                                    required
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Audio Samples</label>
                                <label
                                    htmlFor="audio-upload"
                                    onDragEnter={() => setIsDragging(true)}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleDrop}
                                    className={`relative flex flex-col items-center justify-center w-full p-6 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800/50 hover:bg-gray-800 transition ${isDragging ? 'border-purple-500' : 'hover:border-gray-500'}`}
                                >
                                    <UploadIcon />
                                    <p className="mt-2 text-sm text-gray-400"><span className="font-semibold text-purple-400">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500">MP3, WAV, FLAC (Max 10MB per file)</p>
                                    <input id="audio-upload" type="file" multiple className="hidden" onChange={handleFileChange} accept="audio/*" />
                                </label>
                            </div>
                            {files.length > 0 && (
                                <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                                    <p className="text-sm font-medium text-gray-300">Selected Files:</p>
                                    {files.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between bg-gray-800 p-2 rounded-md text-sm">
                                            <div className="flex items-center gap-2 truncate">
                                                <AudioFileIcon />
                                                <span className="text-gray-300 truncate">{file.name}</span>
                                            </div>
                                            <button type="button" onClick={() => removeFile(file.name)} className="text-gray-500 hover:text-red-400 text-xs">&times;</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-gray-800/50 px-6 py-4 rounded-b-2xl flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700/60 hover:bg-gray-700 rounded-lg transition-colors">Cancel</button>
                        <button
                            type="submit"
                            disabled={isLoading || files.length === 0 || !voiceName.trim()}
                            className="px-6 py-2 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                        >
                            {isLoading ? <><Spinner /> Cloning...</> : 'Create Voice'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
