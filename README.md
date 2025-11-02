# 🎬 AI Video Generator ✨

Welcome to the AI Video Generator! 🚀 This powerful application transforms your browser into a mini movie studio, powered entirely by AI. You are the director! 🧑‍🎨

Craft a narrative by building a sequence of short video clips in a storyboard. Bring your ideas to life from simple text prompts, add context with images, narrate your story with AI-powered voiceovers, and seamlessly merge everything into a final, polished video. The most magical part? The final video merge happens **entirely in your browser**—no servers, no uploads, just pure client-side power!

---

<br/>

<details>
<summary><strong>🏁 Getting Started: Your First Masterpiece in 5 Steps</strong></summary>

Here's how you can go from idea to final video in minutes:

1.  **🔑 Select Your API Key:** The app will first prompt you to select your Google AI Studio API key. This is a necessary step as video generation is a billable service.

2.  **➕ Add a Clip:** Click the "Add Clip to Storyboard" button. This creates your first scene. You can add as many as you need to tell your story!

3.  **✍️ Write a Prompt & Script:**
    *   **Prompt:** In the "Prompt" box, describe what you want to see. Be creative! (e.g., _"A majestic eagle soaring through a thunderstorm, dramatic lighting."_)
    *   **(Optional) Image:** Upload an image to give the AI a starting point.
    *   **(Optional) Voiceover:** Write a script for the scene. The AI will generate a voiceover for you.

4.  **⚙️ Generate Clips:** Once your storyboard is ready, click **"Generate All Clips"**. The app will call the Gemini API to create the video and audio for each clip. You'll see previews appear as they're completed.

5.  **🎞️ Merge & Download:** After all clips are generated, the **"Merge & Finalize Video"** button will light up. Click it, and `ffmpeg.wasm` will work its magic right in your browser, stitching everything together. Once done, you can preview and download your final video!

</details>

<br/>

<details>
<summary><strong>🚀 Core Features Explained</strong></summary>

### 📝 Intuitive Storyboard UI
-   **🎬 Add & Manage Clips:** Dynamically add, remove, and configure multiple clips. Each clip is a scene in your movie.
-   **✨ Clean Workflow:** The entire process is managed in a clean, organized storyboard, making complex video creation feel simple.
-   **👁️ Focus Mode:** Easily expand or collapse each clip's form to focus on what you're editing without clutter.

### 🤖 AI Video Generation (via Gemini API)
-   **✍️ Text-to-Video:** Write a descriptive prompt and watch the AI bring it to life. The only limit is your imagination!
-   **🖼️ Image-to-Video:** Provide a starting image to give the AI clear visual direction, ensuring the generated video aligns with your vision.
-   **📐 Configurable Output:** For each clip, choose your desired aspect ratio (`16:9` widescreen or `9:16` vertical) and resolution (`720p` or `1080p`).

### 🎤 AI-Powered Voiceovers (via Gemini API)
-   **📜 Text-to-Speech:** Write a script for any clip, and a high-quality, natural-sounding AI voice will narrate it.
-   **🎭 Multiple Voices:** Select from a variety of distinct voices (male, female, different tones) to match the mood and character of your video.
-   **🎵 Seamless Integration:** The generated audio is automatically prepared and perfectly timed for merging with its video clip.

### 🎞️ Magical In-Browser Merging (via `ffmpeg.wasm`)
-   **🔒 Private & Secure:** Your generated clips are stitched together on your own machine. Nothing is sent to a server for the final merge, ensuring your content remains private.
-   **⚡ Fast & Cost-Effective:** By leveraging WebAssembly to run FFmpeg in the browser, we eliminate the need for costly server infrastructure for video processing.
-   **🧠 Smart Synchronization:** The merging process is incredibly robust. It intelligently handles clips with and without voiceovers by creating silent audio tracks where needed, guaranteeing all video and audio streams stay perfectly synchronized.

### 🔑 Secure & User-Friendly API Key Management
-   **👆 On-Demand Selection:** The application only prompts for your Google AI Studio API key when it's needed.
-   **⚠️ Graceful Error Handling:** If an API key is invalid or an API call fails, the app prompts you to select a new one without crashing, ensuring a smooth experience.
-   **🔗 Billing Transparency:** A direct link to the official billing documentation is provided, so you are always fully informed.

</details>

<br/>

<details>
<summary><strong>🏗️ Architecture Deep Dive</strong></summary>

This diagram illustrates the flow of data and user interactions within the application. The architecture is designed to be a powerful client-side-first experience.

```ascii
+-------------------------------------------------------------------------+
|                                  User                                   |
|        (Adds clips, writes prompts, clicks "Generate" & "Merge")        |
+-------------------------------------------------------------------------+
       | 1. Interacts with UI                 ^ 7. Views/Downloads Final Video
       v                                      |
+-------------------------------------------------------------------------+
|                        Frontend App (React / TypeScript)                |
|                                                                         |
|  [Storyboard.tsx] <--> [App.tsx (Central State)] <--> [ClipForm.tsx]    |
|   (UI for all clips)     (Manages all clips, status)  (UI for one clip)  |
+-------------------------------------------------------------------------+
       | 2. "Generate"                        ^ 6. Receives Final Video URL
       | Triggers API calls                   | from FFmpeg Service
       |                                      |
       |--------------+-----------------------+------------------+
       |              |                       |                  |
       v              v                       v 5. "Merge"
+------------------+ +-------------------+ +----------------------------------+
| geminiService.ts | | geminiService.ts  | |      ffmpegService.ts            |
| (generateVideo)  | | (generateSpeech)  | |        (mergeClips)              |
+------------------+ +-------------------+ +----------------------------------+
       | 3. API Call  | 3. API Call           | 5a. Lazily loads ffmpeg.wasm core
       v              v                       v 5b. Reads clips from App state
+------------------+ +-------------------+ +----------------------------------+
|   Google Gemini  | |   Google Gemini   | | Browser Memory & WebAssembly (WASM)|
|      (Veo)       | |      (TTS)        | |  (All merging happens here)      |
+------------------+ +-------------------+ +----------------------------------+
       | 4. Returns   | 4. Returns            ^
       | Video Blob   | Raw Audio Data        |
       +--------------+-----------------------+
                      |
                      v 4. Stored as Blob URLs in [App.tsx (State)]
```

### Component Breakdown:
*   **`App.tsx`**: The heart of the application. It acts as the central controller, managing the overall state (like the list of clips, API key status, and current app status) and orchestrating the interactions between all other components and services.
*   **`geminiService.ts`**: This is the dedicated API layer. It handles all communication with the Google Gemini APIs for video and speech generation. It also contains utility functions for things like file-to-base64 conversion.
*   **`ffmpegService.ts`**: The client-side video powerhouse. This service dynamically loads the `ffmpeg.wasm` library on demand and contains the complex logic for stitching video and audio clips together into the final output file.
*   **`/components`**: This directory contains all the modular React components that make up the UI, such as the storyboard, the clip editor form, the loading indicator, and the final video player. This separation keeps the UI logic clean and maintainable.

</details>

<br/>

<details>
<summary><strong>💻 Tech Stack & Philosophy</strong></summary>

-   **⚛️ Frontend Framework:** [React](https://reactjs.org/)
    -   *Why?* For its component-based architecture, which is perfect for building a modular and maintainable UI like our storyboard.

-   **⌨️ Language:** [TypeScript](https://www.typescriptlang.org/)
    -   *Why?* To provide strong typing for our data structures (like `Clip` and `VideoConfig`), which catches errors early and makes the code more robust and easier to refactor.

-   **🤖 AI Models:** [Google Gemini API (Veo & TTS)](https://ai.google.dev/)
    -   *Why?* Provides state-of-the-art models for both video generation and text-to-speech, forming the creative core of the application.

-   **📽️ Video Processing:** [FFmpeg.wasm](https://ffmpegwasm.netlify.app/)
    -   *Why?* This is the key to our client-side-first philosophy. It allows us to perform complex video manipulation directly in the browser, ensuring user privacy and eliminating server costs for processing.

-   **🎨 Styling:** [Tailwind CSS](https://tailwindcss.com/)
    -   *Why?* A utility-first CSS framework that allows for rapid, consistent, and responsive UI development without leaving the HTML.

-   **📦 Module Loading:** ES Modules with Import Maps
    -   *Why?* A modern, browser-native approach to managing JavaScript modules. It avoids the need for a complex build step and allows us to load libraries directly from a CDN.

</details>
