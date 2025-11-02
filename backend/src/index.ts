
// Fix: Use aliased express types to resolve potential type conflicts with global DOM types.
import express, { Request as ExpressRequest, Response as ExpressResponse, Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateVideo as generateVideoFromGemini, generateSpeech } from './services/geminiService';
import { generateVideoFromCerebras } from './services/cerebrasService';


dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for base64 image uploads

app.get('/', (req: ExpressRequest, res: ExpressResponse) => {
  res.send('Ideagen Backend is running! 🚀');
});

// The main endpoint for generating a video/audio clip
app.post('/api/generate-clip', async (req: ExpressRequest, res: ExpressResponse) => {
    try {
        const { prompt, image, videoConfig, voiceoverConfig, engine } = req.body;

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

        // Generate audio (always uses Gemini for now)
        const audioData = await (voiceoverConfig.script.trim() ? generateSpeech(voiceoverConfig) : Promise.resolve(null));

        // Convert generated media to base64 to send as JSON
        const videoBase64 = Buffer.from(await videoBlob.arrayBuffer()).toString('base64');
        const audioBase64 = audioData ? Buffer.from(audioData).toString('base64') : null;

        res.status(200).json({ videoBase64, audioBase64 });

    } catch (e: any) {
        console.error('Error generating clip:', e);
        res.status(500).json({ message: e.message || 'An internal server error occurred.' });
    }
});


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
