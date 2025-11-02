// Fix: Use a default import for Express. The namespace import (`import * as express`)
// was causing type resolution issues. A default import allows calling `express()` to
// create the app while still using namespaced types like `express.Request` to
// avoid collisions with DOM types.
import express from 'express';
import cors from 'cors';
import { generateVideo as generateVideoFromGemini, generateSpeech } from './services/geminiService';
import { generateVideoFromCerebras } from './services/cerebrasService';
import { generateElevenLabsSpeech, addClonedVoice } from './services/elevenLabsService';


const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for base64 image uploads

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Ideagen Backend is running! 🚀');
});

// The main endpoint for generating a video/audio clip
app.post('/api/generate-clip', async (req: express.Request, res: express.Response) => {
    try {
        const { prompt, image, videoConfig, voiceoverConfig, engine, voiceoverEngine } = req.body;

        if (!prompt || !videoConfig || !voiceoverConfig) {
            return res.status(400).json({ message: 'Missing required clip data.' });
        }
        
        let videoBlob: Blob;

        if (engine === 'cerebras') {
            console.log('Routing video generation to Cerebras service.');
            videoBlob = await generateVideoFromCerebras(prompt, image, videoConfig);
        } else {
            console.log('Routing video generation to Gemini service.');
            videoBlob = await generateVideoFromGemini(prompt, image, videoConfig);
        }

        let audioData: Uint8Array | null = null;
        if (voiceoverConfig.script.trim()) {
            if (voiceoverEngine === 'elevenlabs') {
                console.log('Routing speech generation to ElevenLabs service.');
                audioData = await generateElevenLabsSpeech(voiceoverConfig.script, voiceoverConfig.voice);
            } else {
                console.log('Routing speech generation to Gemini service.');
                audioData = await generateSpeech(voiceoverConfig);
            }
        }
        
        // Convert generated media to base64 to send as JSON
        const videoBase64 = Buffer.from(await videoBlob.arrayBuffer()).toString('base64');
        const audioBase64 = audioData ? Buffer.from(audioData).toString('base64') : null;

        res.status(200).json({ videoBase64, audioBase64 });

    } catch (e: any) {
        console.error('Error generating clip:', e);
        res.status(500).json({ message: e.message || 'An internal server error occurred.' });
    }
});

// Endpoint for cloning a voice
app.post('/api/clone-voice', async (req: express.Request, res: express.Response) => {
    try {
        const { name, files } = req.body; // files is an array of { base64, mimeType }

        if (!name || !files || !Array.isArray(files) || files.length === 0) {
            return res.status(400).json({ message: 'Missing voice name or audio files.' });
        }
        
        // In a real app with multipart/form-data, you'd use multer middleware here
        // and access files via req.files.

        const newVoice = await addClonedVoice(name, files);

        res.status(201).json(newVoice); // 201 Created

    } catch (e: any) {
        console.error('Error cloning voice:', e);
        res.status(500).json({ message: e.message || 'An internal server error occurred during voice cloning.' });
    }
});


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});