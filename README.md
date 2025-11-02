# 🎬✨ Ideagen Studio — Your Browser, Your Movie Studio

Welcome to **Ideagen Studio** 🚀, the AI-powered playground where your ideas become cinematic magic. With a powerful local backend and a sleek browser-based interface, you're the director, narrator, and visionary. Let’s roll! 🎥

---

### 🌟 Key Features

-   🧠 **AI-Powered Storyboarding**  
    Craft scenes from simple text prompts and images. Choose expressive AI voiceovers. The backend does the heavy lifting, and previews appear in your storyboard as they're ready.

-   🎞️ **Scene-by-Scene Generation**  
    Build your story one moment at a time. The backend renders each scene using Google Gemini’s Veo (video) and TTS (voice) models.

-   🗣️ **Voiceover Magic**  
    Narrate your story with a selection of lifelike AI voices. Choose tones that are calm, cheerful, or deep to match your vibe.

-   🧩 **Intuitive Clip Editor**  
    Add, remove, and configure clips in a clean storyboard. Expand or collapse scenes to focus your creative energy. Total control, zero clutter.

-   🛠️ **100% Client-Side Final Cut**  
    Merge all your generated clips into a polished final video using **FFmpeg.wasm**—right in your browser. No data leaves your device during the final merge. 🔒

-   🎨 **Sleek UI with Tailwind CSS**  
    A clean, fast, and beautiful interface designed for creators who care about aesthetics and speed.

---

### 🏁 Getting Started: Power Up Your Studio

Ideagen uses a Node.js backend to handle all AI generation. You'll need to set it up and provide your own API key.

#### 1. Configure the Backend

1.  **🔑 Get Your API Key**  
    Head to [Google AI Studio](https://aistudio.google.com/) to create an API key. **Note:** Video generation is a billable feature.

2.  **✍️ Create your `.env` file**  
    In the `/backend` directory, rename the `.env.example` file to `.env`.

3.  **🎬 Add Your Key**  
    Open `backend/.env` and add your key:
    ```
    API_KEY=YOUR_API_KEY_HERE
    ```

4.  **⚙️ Install Dependencies & Run**
    Navigate to the backend directory and start the server:
    ```bash
    cd backend
    npm install
    npm run dev
    ```
    The backend server will start on `http://localhost:8080`.

#### 2. Launch the Frontend

-   Serve the root `index.html` file using a simple local server (like the VS Code Live Server extension).
-   Open the page in your browser and start creating!

---

### 🗺️ Architecture Deep Dive

Ideagen's architecture is split between a powerful backend for AI processing and a lightweight frontend for a seamless user experience.

-   **`backend/`** — The Node.js/Express server that powers all AI generation.
    -   **`src/index.ts`**: Defines the API endpoint (`/api/generate-clip`) that the frontend calls.
    -   **`src/services/geminiService.ts`**: The core logic that communicates with the Google Gemini API using your API key.
-   **`frontend/`** (Root folder)
    -   **`App.tsx`**: The ❤️ of the application, orchestrating state and UI logic.
    -   **`services/apiService.ts`**: A dedicated client to communicate with your backend.
    -   **`services/ffmpegService.ts`**: The 🪄 magic engine that loads FFmpeg.wasm and stitches your clips together locally in the browser.

---

### 🧠 Tech Stack & Philosophy

| Layer              | Choice                        | Why It Wins                                       |
|--------------------|-------------------------------|---------------------------------------------------|
| 🖥️ Backend         | Node.js + Express             | For a fast, reliable, and scalable server.        |
| ⚛️ Frontend        | React                         | For a modular, expressive, and reactive UI.       |
| ⌨️ Language         | TypeScript                    | For safer, smarter, and more robust development.  |
| 🤖 AI Models        | Google Gemini (Veo & TTS)     | For state-of-the-art video & audio generation.    |
| 📽️ Video Processing | FFmpeg.wasm                   | For private, serverless merging with zero cost.   |
| 🎨 Styling          | Tailwind CSS                  | For rapid, responsive, and consistent design.     |

---

### ☁️ Scaling Up: Your Production-Ready Backend 🚀

The included backend is not just for local development; it's your launchpad for scaling up.

#### 💧 LiquidMetal Raindrop AI + Vultr for High-Performance Inference

When you need serious power, deploying the backend on a platform like **LiquidMetal Raindrop AI** using **Vultr's** high-performance cloud GPUs is the way to go.

-   **Raindrop's Role**: Raindrop 💧 is a platform that simplifies deploying and scaling your AI backend, handling the complex DevOps for you.
-   **Vultr's Role**: Vultr ☁️ provides the powerful underlying cloud infrastructure, including Cloud GPUs, for low-latency, high-throughput inference.

**To deploy, you would:**
1.  Get your API key from your Vultr account.
2.  Use the Raindrop CLI or dashboard to point to the `/backend` directory.
3.  Configure Raindrop to use Vultr as the cloud provider, providing your API key securely.
4.  Deploy! Raindrop handles provisioning the Vultr resources and deploying your app.

#### 🤖 Integrating Cerebras & 🗣️ ElevenLabs

The backend is pre-configured for easy integration with other powerful AI services.

1.  **Get API Keys**: Sign up for Cerebras and/or ElevenLabs.
2.  **Set Environment Variables**: Add your keys to `backend/.env`:
    ```
    CEREBRAS_API_KEY=YOUR_CEREBRAS_API_KEY_HERE
    ELEVENLABS_API_KEY=YOUR_ELEVENLABS_API_KEY_HERE
    ```
3.  **Activate**: The service files (`cerebrasService.ts`, `elevenLabsService.ts`) are ready. Just build your API endpoints in `index.ts` and call them from the frontend.

---

Let the browser be your stage. Let your ideas take the spotlight. 🌈🎬