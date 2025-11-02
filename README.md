# 💡 Ideagen ✨

Welcome to Ideagen! 🚀 This powerful application transforms your browser into a mini movie studio, powered entirely by AI. You are the director! 🧑‍🎨

Craft a narrative by building a sequence of short video clips in a storyboard. Bring your ideas to life from simple text prompts, add context with images, narrate your story with AI-powered voiceovers, and seamlessly merge everything into a final, polished video. The most magical part? The final video merge happens **entirely in your browser**—no servers, no uploads, just pure client-side power! 🪄

---

<br/>

<details>
<summary><strong>🏁 Getting Started: Your First Masterpiece 🎬</strong></summary>

Getting Ideagen running is simple and secure, using a standard local development setup.

1.  **🔑 Set Up Your API Key:** Follow the instructions in the **"Running Locally"** section below to configure your Google AI Studio API key in a local `.env` file. This is a required one-time setup.

2.  **🎬 Launch the App:** Open the `index.html` file in your browser using a local web server.

3.  **➕ Add a Clip:** Click the "Add Clip to Storyboard" button. The pre-loaded "Stardust Gambit" script is a great place to start exploring.

4.  **✍️ Write a Prompt & Script:** For each clip, describe what you want to see in the "Prompt" box. You can also upload a starting image and write a voiceover script.

5.  **⚙️ Generate Clips:** Click **"Generate All Clips"**. Ideagen will call the Gemini API to create the video and audio for each clip. You'll see previews appear as they're completed.

6.  **🎞️ Merge & Download:** After all clips are generated, click **"Merge & Finalize Video"**. `ffmpeg.wasm` will work its magic right in your browser. Once done, you can preview and download your final video!

</details>

<br/>

<details>
<summary><strong>💻 Running Locally: Step-by-Step Guide 🛠️</strong></summary>

To run this project on your own machine, you'll need to set up your API key in an environment file.

1.  **Get a Google AI Studio API Key:**
    *   Navigate to [Google AI Studio](https://aistudio.google.com/).
    *   Click on **"Get API key"** and create a new key.
    *   **Important:** Video generation is a billable feature. You may need to enable billing on your Google Cloud project. You can find more info here: [Google AI Billing Information](https://ai.google.dev/gemini-api/docs/billing).

2.  **Create a `.env` File:**
    *   In the root directory of this project, create a new file named `.env`.

3.  **Add Your API Key to the `.env` File:**
    *   Open the `.env` file and add the following line, replacing `YOUR_API_KEY_HERE` with the key you just created:
    ```
    API_KEY=YOUR_API_KEY_HERE
    ```

4.  **Serve the Application:**
    *   This project is a pure client-side application and doesn't require a build step. You just need to serve the `index.html` file from a local web server.
    *   If you have Python installed, you can easily start a server by running this command in your terminal from the project's root directory:
        ```bash
        python -m http.server
        ```
    *   Alternatively, you can use a tool like the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension for VS Code.

5.  **Open in Browser:**
    *   Once your server is running, open your web browser and navigate to the local address (e.g., `http://localhost:8000`). The application should now load and detect your API key.

</details>

<br/>

<details>
<summary><strong>🚀 Core Features Explained in Detail ✨</strong></summary>

### 📝 **Intuitive Storyboard UI**
The entire creative process is managed in a clean, organized storyboard, making complex video creation feel simple. 🖼️
-   **Dynamic Clip Management:** Easily add, remove, and configure multiple clips. Each clip is a self-contained scene in your movie. ➕➖
-   **Focus Mode:** Expand or collapse each clip's form to focus on what you're editing without clutter. This is especially useful for large projects. 🧘
-   **Live Previews:** As each clip is generated, a video preview appears directly in its card. Watch your movie come together scene by scene! 🍿
-   **Smart Buttons:** Action buttons like "Generate" and "Merge" are intelligently enabled or disabled based on the state of your storyboard, guiding you through the creation process. 👍

### 🎬 **Pre-loaded Feature Film Script: "Stardust Gambit"**
-   Jumpstart your creativity with the entire script for a short sci-fi film pre-loaded as a multi-clip storyboard. 🌌 It's the perfect way to explore Ideagen's full capabilities right out of the box without having to write a single prompt. Just click "Generate"!

### 🤖 **AI Video Generation (via Gemini API)**
Leverage Google's state-of-the-art video models.
-   **Text-to-Video:** Write a descriptive prompt and watch the AI bring it to life. The only limit is your imagination! ✍️➡️🎥
-   **Image-to-Video:** Provide a starting image to give the AI clear visual direction, ensuring the generated video aligns with your specific vision. 🖼️➡️🎥
-   **Configurable Output:** For each clip, individually choose your desired aspect ratio (`16:9` widescreen or `9:16` vertical) and resolution (`720p` or `1080p`). 📐

### 🎤 **AI-Powered Voiceovers (via Gemini API)**
Add professional-sounding narration to any scene.
-   **High-Quality Text-to-Speech:** Write a script for any clip, and a natural-sounding AI voice will narrate it. 🗣️
-   **Voice Variety:** Select from a curated list of distinct voices (male, female, with different tones like calm, cheerful, or deep) to match the mood and character of your video. 🎭

### 🎞️ **Magical In-Browser Merging (via `ffmpeg.wasm`)**
This is where Ideagen truly shines, offering a serverless video processing pipeline.
-   **100% Private & Secure:** Your generated clips are downloaded and stitched together directly on your own machine. Nothing is sent to a server for the final merge, ensuring your content remains completely private. 🔐
-   **Fast & Cost-Effective:** By leveraging WebAssembly to run the powerful FFmpeg library in the browser, we eliminate the need for costly and slow server-side video processing infrastructure. 💸
-   **Intelligent Synchronization:** The merging engine is incredibly robust. It intelligently handles clips with and without voiceovers by creating silent audio tracks where needed, guaranteeing all video and audio streams stay perfectly synchronized in the final output. 🎶

### ✨ **Engaging & User-Friendly Experience**
-   **Secure API Key Management:** The application prompts for your Google AI Studio API key via a local `.env` file, a standard and secure practice for web development. 🔑
-   **Fun Loading Messages:** Stay entertained and informed with dynamic, creative loading messages while the AI works its magic. It turns waiting into part of the fun! 🥳

</details>

<br/>

<details>
<summary><strong>🏗️ Architecture Deep Dive 🗺️</strong></summary>

This diagram illustrates the flow of data and user interactions. The architecture is designed to be a powerful client-side-first experience, minimizing server reliance.

```ascii
+-------------------------------------------------------------------------+
|                                🧑‍💻 User 🎬                               |
|      (Adds clips, writes prompts, clicks "Generate" & "Merge")          |
+-------------------------------------------------------------------------+
       | 1. Interacts with UI 🖱️               ^ 7. Views/Downloads Video 💾
       v                                      |
+-------------------------------------------------------------------------+
|                     ⚛️ Frontend App (React / TypeScript)                 |
|                                                                         |
| [Storyboard.tsx] <--> [App.tsx (Central State)] <--> [ClipForm.tsx]     |
|  (Renders list)      (Manages clips, status)     (Form for one clip)    |
+-------------------------------------------------------------------------+
       | 2. "Generate" 🚀                     ^ 6. Receives Final URL 🔗
       | Triggers API calls                   | from FFmpeg Service
       |                                      |
       |--------------+-----------------------+------------------+
       |              |                       |                  |
       v              v                       v 5. "Merge" 🎞️
+------------------+ +-------------------+ +----------------------------------+
| geminiService.ts | | geminiService.ts  | |      ffmpegService.ts            |
| (generateVideo)  | | (generateSpeech)  | |        (mergeClips)              |
+------------------+ +-------------------+ +----------------------------------+
       | 3. API Call 🌐 | 3. API Call 🌐        | 5a. Lazily loads ffmpeg.wasm core
       v              v                       v 5b. Reads clip data from App state
+------------------+ +-------------------+ +----------------------------------+
|  🤖 Google Cloud  | |  🤖 Google Cloud   | | 📦 Browser Memory & WASM Engine  |
|  (Gemini - Veo)  | |  (Gemini - TTS)   | |  (All merging happens here!)     |
+------------------+ +-------------------+ +----------------------------------+
       | 4. Returns   | 4. Returns            ^
       | Video Data   | Raw Audio Data        |
       +--------------+-----------------------+
                      |
                      v 4. Stored as Blob URLs in [App.tsx (State)] 🧠
```

### Component Breakdown:
*   **`App.tsx`**: The ❤️ of the application. It acts as the central controller, managing the overall state (like the list of clips, API key status, and current app status: 'editing', 'generating', 'merging', 'done') and orchestrating the interactions between all other components and services.
*   **`geminiService.ts`**: The dedicated 📡 API layer. It contains all the logic for communicating with the Google Gemini APIs for video and speech generation. It also houses utility functions like file-to-base64 conversion and creating WAV file headers for the raw audio data.
*   **`ffmpegService.ts`**: The client-side video 🪄 powerhouse. This service dynamically loads the `ffmpeg.wasm` library on demand and contains the complex logic for stitching video and audio clips together into the final output file, right in the user's browser.
*   **`/components`**: This directory contains all the modular React components that make up the UI, such as the `Storyboard` (which lists all clips), the `ClipForm` (the editor for a single clip), the `LoadingIndicator`, and the final `VideoPlayer`. This separation keeps the UI logic clean and maintainable.

</details>

<br/>

<details>
<summary><strong>💻 Tech Stack & Philosophy 🧠</strong></summary>

-   **⚛️ Frontend Framework:** [React](https://reactjs.org/)
    -   *Why?* For its component-based architecture, which is perfect for building a modular and maintainable UI like our storyboard. State management with hooks (`useState`, `useEffect`) allows for predictable and reactive updates.

-   **⌨️ Language:** [TypeScript](https://www.typescriptlang.org/)
    -   *Why?* To provide strong typing for our data structures (like `Clip` and `VideoConfig`), which catches errors early, improves developer experience with autocompletion, and makes the code more robust and easier to refactor.

-   **🤖 AI Models:** [Google Gemini API (Veo & TTS)](https://ai.google.dev/)
    -   *Why?* Provides state-of-the-art models for both video generation from text and images, and high-quality, natural-sounding text-to-speech, forming the creative core of the application.

-   **📽️ Video Processing:** [FFmpeg.wasm](https://ffmpegwasm.netlify.app/)
    -   *Why?* This is the key to our client-side-first philosophy. Compiling the legendary FFmpeg C library to WebAssembly allows us to perform complex video manipulation directly in the browser, ensuring user privacy and eliminating the need for expensive, dedicated server infrastructure.

-   **🎨 Styling:** [Tailwind CSS](https://tailwindcss.com/)
    -   *Why?* A utility-first CSS framework that allows for rapid, consistent, and responsive UI development without leaving the HTML. It's highly customizable and helps keep the component files self-contained.

-   **📦 Module Loading:** ES Modules with Import Maps
    -   *Why?* A modern, browser-native approach to managing JavaScript modules. It avoids the need for a complex build step (like Webpack or Vite) for this project and allows us to load libraries like React and `@google/genai` directly from a CDN.

</details>

<br/>

<details>
<summary><strong>☁️ Scaling Up: Optional Backend Setup 🚀</strong></summary>

While Ideagen is designed to run entirely in your browser 💻, you might want to scale up with a dedicated backend for more powerful processing, job queuing, or integrating other AI services. Here's a conceptual guide on how you could leverage platforms like LiquidMetal Raindrop, Vultr, Cerebras, and ElevenLabs.

A placeholder Node.js/Express backend has been added to the `/backend` directory to get you started!

### 💧 Using LiquidMetal Raindrop with Vultr for Backend

LiquidMetal AI's Raindrop platform is designed to provide Claude-native infrastructure to developers, especially for AI applications, and often leverages cloud providers like Vultr for scalable, high-performance computing resources. Raindrop simplifies backend deployment and management, especially for AI/ML inference workloads.

#### How it Works 🤔

*   **Raindrop's Role**: Raindrop acts as an easy-to-use platform to deploy and scale your AI applications, handling the complex DevOps overhead for you. It's the abstraction layer for your AI application's backend.
*   **Vultr's Role**: Vultr provides the underlying cloud infrastructure, including high-performance resources like Cloud Compute instances and Cloud GPUs (like AMD Instinct MI325X GPUs) in global data centers for low-latency inference.

#### Conceptual Setup Steps ⚙️

1.  **Get Vultr API Key**: First, you'll need a Vultr API Key from your Vultr account dashboard. This key allows the Raindrop platform to provision and manage resources (VMs, GPUs, storage) on your behalf.
2.  **Use Raindrop Tools**: Use the Raindrop platform's CLI or dashboard to define your AI application's requirements (e.g., model, size, scaling rules).
3.  **Configure Deployment Target**: Within the Raindrop interface, select Vultr as your cloud provider.
4.  **Provide API Key Securely**: Securely configure your Vultr API key within the Raindrop environment (often as an environment variable or secret).
5.  **Provision & Deploy**: Raindrop uses the Vultr API to provision the necessary compute resources and deploy your application code and AI model onto the new Vultr infrastructure.

### 🤖 Integrating with Cerebras

For specialized, large-scale AI computation, you might integrate with Cerebras. The placeholder backend includes a service file to get you started.

1.  **Get Cerebras API Key**: Sign up for Cerebras and get an API key.
2.  **Set Environment Variable**: Add your key to the `backend/.env` file:
    ```
    CEREBRAS_API_KEY=YOUR_CEREBRAS_API_KEY_HERE
    ```
3.  **Implement Service Logic**: In `backend/src/services/cerebrasService.ts`, implement the logic to call the Cerebras API for your specific needs.
4.  **Create API Endpoint**: Create a new endpoint in `backend/src/index.ts` to expose this functionality to your frontend.

### 🗣️ Integrating ElevenLabs for Voiceovers

As an alternative to Gemini's TTS, you can use [ElevenLabs](https://elevenlabs.io/) for hyper-realistic AI voices.

1.  **Get ElevenLabs API Key**: Sign up for an ElevenLabs account and get your API key.
2.  **Set Environment Variable**: Add your key to the `backend/.env` file:
    ```
    ELEVENLABS_API_KEY=YOUR_ELEVENLABS_API_KEY_HERE
    ```
3.  **Implement Service Logic**: The placeholder file `backend/src/services/elevenLabsService.ts` contains a template for calling the ElevenLabs API. You can modify this to select different voices and settings.
4.  **Update Frontend**: Modify the `generateSpeech` calls in the frontend to call your new backend endpoint instead of the Gemini API directly.

</details>
