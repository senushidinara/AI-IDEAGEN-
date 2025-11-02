// Fix: Import `Application` type to explicitly type the express app.
import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateVideo, generateSpeech } from './services/geminiService';

dotenv.config();

// Fix: Explicitly type `app` as `Application` to fix type inference issues.
const app: Application = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for base64 image uploads

app.get('/', (req: Request, res: Response) => {
  res.send('Ideagen Backend is running! 🚀');
});

// The main endpoint for generating a video/audio clip
app.post('/api/generate-clip', async (req: Request, res: Response) => {
    try {
        const { prompt, image, videoConfig, voiceoverConfig } = req.body;

        if (!prompt || !videoConfig || !voiceoverConfig) {
            return res.status(400).json({ message: 'Missing required clip data.' });
        }

        // Generate video and audio in parallel
        const [videoBlob, audioData] = await Promise.all([
            generateVideo(prompt, image, videoConfig),
            voiceoverConfig.script.trim() ? generateSpeech(voiceoverConfig) : Promise.resolve(null),
        ]);

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