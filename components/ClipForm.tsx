/// <reference lib="dom" />

import React, { useState } from 'react';
import type { Clip, ImageFile, VideoConfig, VoiceoverConfig, VoiceoverEngine } from '../types';
import { fileToBase64 } from '../services/geminiService';

interface ClipFormProps {
    clip: Clip;
    index: number;
    onUpdate: (updatedClip: Partial<Clip>) => void;
    onRemove: () => void;
    voiceoverEngine: VoiceoverEngine;
}

const geminiVoices = [
    { id: 'Kore', name: 'Kore (Female, Calm)' },
    { id: 'Puck', name: 'Puck (Male, Cheerful)' },
    { id: 'Charon', name: 'Charon (Male, Deep)' },
    { id: 'Fenrir', name: 'Fenrir (Female, Energetic)' },
    { id: 'Zephyr', name: 'Zephyr (Female, Warm)' },
];

const elevenLabsVoices = [
    { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (Calm)' },
    { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi (Narrative)' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella (Warm)' },
    { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni (Well-Paced)' },
    { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli (Expressive)' },
    { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh (Deep)' },
];

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const inputBaseClasses = "w-full bg-gray-900/50 border border-gray-700 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors focus:outline-none";

export const ClipForm: React.FC<ClipFormProps> = ({ clip, index, onUpdate, onRemove, voiceoverEngine }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(clip.image ? `data:${clip.image.mimeType};base64,${clip.image.base64}` : null);
    const [isExpanded, setIsExpanded] = useState(index < 2); // Keep first two clips open by default
    const voices = voiceoverEngine === 'elevenlabs' ? elevenLabsVoices : geminiVoices;

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // Fix: Use `e.currentTarget` which is correctly typed as HTMLInputElement.
        const file = e.currentTarget.files?.[0];
        if (file) {
            const { base64, mimeType } = await fileToBase64(file);
            const imageFile = { base64, mimeType };
            onUpdate({ image: imageFile });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        onUpdate({ image: null });
        setImagePreview(null);
        const fileInput = document.getElementById(`image-upload-${clip.id}`) as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        // Fix: Use `e.currentTarget` which is correctly typed as HTMLTextAreaElement.
        onUpdate({ prompt: e.currentTarget.value });
    };
    
    const handleVideoConfigChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // Fix: Use `e.currentTarget` which is correctly typed as HTMLSelectElement.
        onUpdate({ videoConfig: {...clip.videoConfig, [e.currentTarget.name]: e.currentTarget.value} as VideoConfig });
    }
    
    const handleVoiceoverChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
        // Fix: Use `e.currentTarget` which is correctly typed.
        onUpdate({ voiceoverConfig: {...clip.voiceoverConfig, [e.currentTarget.name]: e.currentTarget.value} as VoiceoverConfig });
    }

    return (
        <div className="bg-gray-900/50 border border-gray-700/80 rounded-lg shadow-md shadow-black/20">
            <div className="flex justify-between items-center cursor-pointer p-4" onClick={() => setIsExpanded(!isExpanded)}>
                <h3 className="font-bold text-lg text-purple-300">Clip #{index + 1}</h3>
                <div className="flex items-center gap-4">
                    <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(); }} className="text-gray-500 hover:text-red-400 transition-colors">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                        </svg>
                    </button>
                     <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform text-gray-400 ${isExpanded ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>

            {isExpanded && (
                <div className="border-t border-gray-700/80 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {/* Left Column: Prompt and Image */}
                        <div className="space-y-4">
                            <div>
                                <label htmlFor={`prompt-${clip.id}`} className="block text-sm font-medium text-gray-300 mb-1.5">Prompt</label>
                                <textarea id={`prompt-${clip.id}`} value={clip.prompt} onChange={handlePromptChange} placeholder="e.g., A cat driving a sports car" rows={3} className={inputBaseClasses} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Image (Optional)</label>
                                {imagePreview ? (
                                    <div className="relative group aspect-video">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-lg border border-gray-600 bg-black"/>
                                        <button type="button" onClick={removeImage} className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80" aria-label="Remove image">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                        </button>
                                    </div>
                                ) : (
                                    <label htmlFor={`image-upload-${clip.id}`} className="relative flex flex-col items-center justify-center w-full h-full border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-900/50 hover:bg-gray-800/50 transition aspect-video group hover:border-purple-500">
                                        <div className="flex flex-col items-center justify-center text-gray-500 text-center p-2 group-hover:text-purple-300 transition-colors">
                                            <UploadIcon />
                                            <p className="text-xs font-semibold">Click to upload an image</p>
                                        </div>
                                        <input id={`image-upload-${clip.id}`} type="file" className="hidden" onChange={handleImageChange} accept="image/png, image/jpeg, image/webp" />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Settings and Voiceover */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor={`aspectRatio-${clip.id}`} className="block text-sm font-medium text-gray-300 mb-1.5">Ratio</label>
                                    <select id={`aspectRatio-${clip.id}`} name="aspectRatio" value={clip.videoConfig.aspectRatio} onChange={handleVideoConfigChange} className={inputBaseClasses}>
                                        <option value="16:9">16:9 Landscape</option>
                                        <option value="9:16">9:16 Portrait</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor={`resolution-${clip.id}`} className="block text-sm font-medium text-gray-300 mb-1.5">Resolution</label>
                                    <select id={`resolution-${clip.id}`} name="resolution" value={clip.videoConfig.resolution} onChange={handleVideoConfigChange} className={inputBaseClasses}>
                                        <option value="720p">720p</option>
                                        <option value="1080p">1080p</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label htmlFor={`voiceoverScript-${clip.id}`} className="block text-sm font-medium text-gray-300 mb-1.5">Voiceover (Optional)</label>
                                <textarea id={`voiceoverScript-${clip.id}`} name="script" value={clip.voiceoverConfig.script} onChange={handleVoiceoverChange} placeholder="Voiceover script..." rows={3} className={inputBaseClasses}/>
                            </div>
                            <div>
                                <label htmlFor={`voice-${clip.id}`} className="block text-sm font-medium text-gray-300 mb-1.5">Voice</label>
                                <select id={`voice-${clip.id}`} name="voice" value={clip.voiceoverConfig.voice} onChange={handleVoiceoverChange} className={inputBaseClasses}>
                                    {voices.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                </select>
                            </div>
                        </div>
                        {/* Preview Area */}
                        {(clip.generatedVideoUrl || clip.isGenerating) && (
                            <div className="md:col-span-2 mt-4 p-1 bg-black rounded-lg border border-gray-700">
                            {clip.isGenerating && (
                                    <div className="aspect-video flex flex-col items-center justify-center text-center p-4">
                                        <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mb-3"></div>
                                        <p className="text-sm text-gray-400">Generating video...</p>
                                    </div>
                            )}
                            {clip.generatedVideoUrl && !clip.isGenerating && (
                                    <video src={clip.generatedVideoUrl} controls muted loop className="w-full h-auto rounded"></video>
                            )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};