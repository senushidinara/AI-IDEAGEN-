# 💡 Ideagen ✨

Welcome to Ideagen! 🚀 This powerful application transforms your browser into a mini movie studio, powered entirely by AI. You are the director! 🧑‍🎨

Craft a narrative by building a sequence of short video clips in a storyboard. Bring your ideas to life from simple text prompts, add context with images, narrate your story with AI-powered voiceovers, and seamlessly merge everything into a final, polished video. The most magical part? The final video merge happens **entirely in your browser**—no servers, no uploads, just pure client-side power!

---

<br/>

<details>
<summary><strong>🏁 Getting Started: Your First Masterpiece in 5 Steps</strong></summary>

Here's how you can go from idea to final video in minutes:

1.  **🔑 Select Your API Key:** The app will first prompt you to select your Google AI Studio API key. This is a necessary step as video generation is a billable service. Don't worry, the app provides a direct link to learn more about billing.

2.  **➕ Add a Clip:** Click the "Add Clip to Storyboard" button. This creates your first scene. You can add as many as you need to tell your story! The included "Stardust Gambit" script is a great place to start.

3.  **✍️ Write a Prompt & Script:** For each clip, you have several creative tools:
    *   **Prompt (Required):** In the "Prompt" box, describe what you want to see. Be creative! (e.g., _"A majestic eagle soaring through a thunderstorm, dramatic lighting."_)
    *   **Image (Optional):** Upload an image to give the AI a strong starting point and more precise control over the output.
    *   **Voiceover (Optional):** Write a script for the scene. The AI will generate a high-quality voiceover for you. You can even choose from different voices to match the tone!

4.  **⚙️ Generate Clips:** Once your storyboard is ready, click **"Generate All Clips"**. Ideagen will call the Gemini API to create the video and audio for each clip. You'll see previews appear in the storyboard as they're completed, allowing you to track progress in real-time.

5.  **🎞️ Merge & Download:** After all clips are generated, the **"Merge & Finalize Video"** button will light up. Click it, and `ffmpeg.wasm` will work its magic right in your browser, stitching everything together. Once done, you can preview and download your final video!

</details>

<br/>

<details>
<summary><strong>🚀 Core Features Explained in Detail</strong></summary>

### 📝 **Intuitive Storyboard UI**
The entire creative process is managed in a clean, organized storyboard, making complex video creation feel simple.
-   **Dynamic Clip Management:** Easily add, remove, and configure multiple clips. Each clip is a self-contained scene in your movie.
-   **Focus Mode:** Expand or collapse each clip's form to focus on what you're editing without clutter. This is especially useful for large projects.
-   **Live Previews:** As each clip is generated, a video preview appears directly in its card. Watch your movie come together scene by scene!
-   **Smart Buttons:** Action buttons like "Generate" and "Merge" are intelligently enabled or disabled based on the state of your storyboard, guiding you through the creation process.

### 🎬 **Pre-loaded Feature Film Script: "Stardust Gambit"**
-   Jumpstart your creativity with the entire script for a short sci-fi film pre-loaded as a multi-clip storyboard. It's the perfect way to explore Ideagen's full capabilities right out of the box without having to write a single prompt. Just click "Generate"!

### 🤖 **AI Video Generation (via Gemini API)**
Leverage Google's state-of-the-art video models.
-   **Text-to-Video:** Write a descriptive prompt and watch the AI bring it to life. The only limit is your imagination!
-   **Image-to-Video:** Provide a starting image to give the AI clear visual direction, ensuring the generated video aligns with your specific vision.
-   **Configurable Output:** For each clip, individually choose your desired aspect ratio (`16:9` widescreen or `9:16` vertical) and resolution (`720p` or `1080p`).

### 🎤 **AI-Powered Voiceovers (via Gemini API)**
Add professional-sounding narration to any scene.
-   **High-Quality Text-to-Speech:** Write a script for any clip, and a natural-sounding AI voice will narrate it.
-   **Voice Variety:** Select from a curated list of distinct voices (male, female, with different tones like calm, cheerful, or deep) to match the mood and character of your video.

### 🎞️ **Magical In-Browser Merging (via `ffmpeg.wasm`)**
This is where Ideagen truly shines, offering a serverless video processing pipeline.
-   **100% Private & Secure:** Your generated clips are downloaded and stitched together directly on your own machine. Nothing is sent to a server for the final merge, ensuring your content remains completely private.
-   **Fast & Cost-Effective:** By leveraging WebAssembly to run the powerful FFmpeg library in the browser, we eliminate the need for costly and slow server-side video processing infrastructure.
-   **Intelligent Synchronization:** The merging engine is incredibly robust. It intelligently handles clips with and without voiceovers by creating silent audio tracks where needed, guaranteeing all video and audio streams stay perfectly synchronized in the final output.

### ✨ **Engaging & User-Friendly Experience**
-   **Secure API Key Management:** The application only prompts for your Google AI Studio API key when it's needed, with graceful error handling and clear links to billing information.
-   **Fun Loading Messages:** Stay entertained and informed with dynamic, creative loading messages while the AI works its magic. It turns waiting into part of the fun!

</details>

<br/>

<details>
<summary><strong>🏗️ Architecture Deep Dive</strong></summary>

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
*   **`App.tsx`**: The heart of the application. It acts as the central controller, managing the overall state (like the list of clips, API key status, and current app status: 'editing', 'generating', 'merging', 'done') and orchestrating the interactions between all other components and services.
*   **`geminiService.ts`**: This is the dedicated API layer. It contains all the logic for communicating with the Google Gemini APIs for video and speech generation. It also houses utility functions like file-to-base64 conversion and creating WAV file headers for the raw audio data.
*   **`ffmpegService.ts`**: The client-side video powerhouse. This service dynamically loads the `ffmpeg.wasm` library on demand and contains the complex logic for stitching video and audio clips together into the final output file, right in the user's browser.
*   **`/components`**: This directory contains all the modular React components that make up the UI, such as the `Storyboard` (which lists all clips), the `ClipForm` (the editor for a single clip), the `LoadingIndicator`, and the final `VideoPlayer`. This separation keeps the UI logic clean and maintainable.

</details>

<br/>

<details>
<summary><strong>💻 Tech Stack & Philosophy</strong></summary>

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