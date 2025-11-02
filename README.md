# 🎬✨ Ideagen Studio — Your Browser, Your Movie Studio! ✨🎬

Welcome to **Ideagen Studio** 🚀, the AI-powered playground where your ideas become cinematic magic. With a powerful local backend and a sleek browser-based interface, you're the director, narrator, and visionary. **Let’s roll!** 🎥

---

### 🌟 Core Features

-   🧠 **Multi-Engine Backend**: Choose your AI powerhouse! Seamlessly switch between **Google's Gemini** and **Cerebras** for video generation right from the UI. The Node.js backend intelligently routes your requests.
-   🎞️ **Scene-by-Scene Generation**: Build your story one moment at a time. The backend renders each scene, and previews appear in your storyboard as they're ready.
-   🗣️ **AI Voiceover Magic**: Narrate your story with a selection of lifelike AI voices from Google. Choose tones that are calm, cheerful, or deep to match your vibe.
-   🧩 **Intuitive Storyboard Editor**: Add, remove, and configure clips in a clean, visual storyboard. Expand or collapse scenes to focus your creative energy. Total control, zero clutter.
-   🛠️ **100% In-Browser Final Cut**: Merge all your generated clips into a polished final video using **FFmpeg.wasm**—right in your browser. No data leaves your device during the final merge. It's fast, private, and secure! 🔒
-   🎨 **Sleek & Modern UI**: A clean, fast, and beautiful interface designed with Tailwind CSS for creators who care about aesthetics and speed.

---

<details>
<summary><strong>🏁 Quick Start: Power Up Your Studio in Minutes!</strong></summary>

Ideagen's architecture relies on its Node.js backend to handle all the heavy AI lifting. To get started, you just need to configure it with your API keys.

#### 🔌 Step 1: Configure the Backend

1.  **🔑 Get Your API Keys**
    -   **Google AI Studio**: Head to [Google AI Studio](https://aistudio.google.com/) to create a key for Gemini video & TTS. **Note:** Video generation is a billable feature.
    -   **Cerebras**: Obtain an API key from Cerebras for alternative video generation.

2.  **✍️ Create your `.env` file**
    In the `/backend` directory, rename the `.env.example` file to `.env`.

3.  **🎬 Add Your Keys**
    Open `backend/.env` and add your keys. You only need the key for the service you intend to use.
    ```
    API_KEY=YOUR_GOOGLE_AI_STUDIO_API_KEY_HERE
    CEREBRAS_API_KEY=YOUR_CEREBRAS_API_KEY_HERE
    ```

4.  **⚙️ Install Dependencies & Run**
    Navigate to the backend directory in your terminal and start the server:
    ```bash
    cd backend
    npm install
    npm run dev
    ```
    The backend server is now running and listening on `http://localhost:8080`! 🔥

#### 🚀 Step 2: Launch the Frontend

-   Serve the root `index.html` file using a simple local server (like the VS Code **Live Server** extension).
-   Open the page in your browser, use the "Generation Engine" toggle to select your desired service, and start creating!

</details>

---

<details>
<summary><strong>🗺️ Peek Under the Hood: Architecture Deep Dive</strong></summary>

Ideagen is built on a robust client-server model, separating the beautiful user interface from the intensive AI processing.

-   **`backend/`** — The Node.js/Express server that powers all AI generation. 🧠
    -   **`src/index.ts`**: Defines the API endpoint (`/api/generate-clip`) that receives requests from the frontend and routes them to the correct AI service based on your selection.
    -   **`src/services/geminiService.ts`**: The core logic that communicates with the Google Gemini API.
    -   **`src/services/cerebrasService.ts`**: The logic for communicating with the Cerebras API.
-   **`frontend/`** (Root folder) — The sleek, in-browser studio experience. ✨
    -   **`App.tsx`**: The ❤️ of the application, orchestrating state (including the selected engine) and UI logic.
    -   **`services/apiService.ts`**: A dedicated client to communicate with your backend, sending the clip data and selected engine.
    -   **`services/ffmpegService.ts`**: The 🪄 magic engine that loads FFmpeg.wasm and stitches your clips together locally in the browser.

</details>

---

<details>
<summary><strong>🧠 Our Tech Stack & Philosophy</strong></summary>

| Layer              | Choice                        | Why It Wins                                       |
|--------------------|-------------------------------|---------------------------------------------------|
| 🖥️ **Backend**     | Node.js + Express             | For a fast, reliable, and scalable server.        |
| ⚛️ **Frontend**    | React                         | For a modular, expressive, and reactive UI.       |
| ⌨️ **Language**    | TypeScript                    | For safer, smarter, and more robust development.  |
| 🤖 **AI Models**   | Google Gemini, Cerebras       | For state-of-the-art, flexible video generation.  |
| 📽️ **Video Processing** | FFmpeg.wasm                   | For private, serverless merging with zero cost.   |
| 🎨 **Styling**     | Tailwind CSS                  | For rapid, responsive, and consistent design.     |

</details>

---

<details>
<summary><strong>☁️ Ready for Liftoff? Scaling to Production 🚀</strong></summary>

The included backend is not just for local development; it's your launchpad for a production-grade application.

#### 💧 LiquidMetal Raindrop AI + Vultr for High-Performance Inference

When you need serious power, deploying the backend on a platform like **LiquidMetal Raindrop AI** using **Vultr's** high-performance cloud GPUs is the way to go.

-   **Raindrop's Role** 💧: Raindrop simplifies deploying and scaling your AI backend, handling the complex DevOps for you.
-   **Vultr's Role** ☁️: Vultr provides the powerful underlying cloud infrastructure for low-latency, high-throughput inference.

**Deployment is simple:**
1.  Get your API key from your Vultr account.
2.  Use the Raindrop CLI or dashboard to point to the `/backend` directory of this project.
3.  Configure Raindrop to use Vultr as the cloud provider, providing your API key securely.
4.  Deploy! Raindrop handles provisioning the Vultr resources and deploying your app.

#### 🤖 Activating Alternative AI Engines (e.g., ElevenLabs)

Ideagen's backend is modular, allowing you to activate alternative AI providers with simple configuration changes. The service integrations are already built.

1.  **Get API Key**: Sign up for a service like ElevenLabs for premium voiceovers.
2.  **Set Environment Variable**: Add the new key to `backend/.env`:
    ```
    ELEVENLABS_API_KEY=YOUR_ELEVENLABS_API_KEY_HERE
    ```
3.  **Enable in Backend**: With the key in place, the backend can now be configured to route requests to this service. The application is designed to handle these providers seamlessly.

</details>

---

Let the browser be your stage. Let your ideas take the spotlight. 🌈🎬
