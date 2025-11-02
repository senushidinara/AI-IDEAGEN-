import type { Clip } from './types';

// This file contains the pre-populated storyboard clips for the "STARDUST GAMBIT" short film script.
const clipsRaw = [
  // OPENING SEQUENCE
  {
    prompt: 'Cosmic nebula forming into data streams. Stars transform into glowing binary code. Ethereal and futuristic visuals.',
    image: null,
    videoConfig: { aspectRatio: '16:9', resolution: '720p' },
    voiceoverConfig: {
      script: "We have watched your world for eons. Your 'moving beings' fascinated us—creatures of water and electricity, so fragile yet so complex. We called you... the anomalies.",
      voice: 'Charon',
    },
  },
  {
    prompt: 'Quick cuts showing Earth from space, then zooming dramatically to a beautiful tropical island. Show authentic, peaceful island life scenes.',
    image: null,
    videoConfig: { aspectRatio: '16:9', resolution: '720p' },
    voiceoverConfig: { script: '', voice: 'Kore' },
  },
  {
    prompt: 'A young woman, Mia, collecting shells on a beach at dusk. A mysterious golden light envelops her from above. Close up on her eyes reflecting cosmic patterns before she vanishes completely. The beach is left empty, only her footprints remain in the sand.',
    image: null,
    videoConfig: { aspectRatio: '16:9', resolution: '720p' },
    voiceoverConfig: { script: '', voice: 'Kore' },
  },
  // ACT I: THE REPLACEMENT
  {
    prompt: 'Inside a sterile, futuristic Stardust chamber. A perfect replica of Mia materializes out of light and data particles.',
    image: null,
    videoConfig: { aspectRatio: '16:9', resolution: '720p' },
    voiceoverConfig: {
      script: 'Systems nominal. Memory integration complete. Mission: infiltrate and prepare for assimilation.',
      voice: 'Kore',
    },
  },
  {
    prompt: "The Mia replica, Agent Mia, appears in her home village on the island. Her movements are too precise, almost robotic. Her friends notice subtle, strange changes in her.",
    image: null,
    videoConfig: { aspectRatio: '16:9', resolution: '720p' },
    voiceoverConfig: { script: '', voice: 'Kore' },
  },
   {
    prompt: "Agent Mia is talking to her friend Lena. When Lena asks 'Mia, since when do you understand quantum physics?', Agent Mia glitches, her eyes flashing bright blue for a nanosecond.",
    image: null,
    videoConfig: { aspectRatio: '16:9', resolution: '720p' },
    voiceoverConfig: { script: '', voice: 'Kore' },
  },
  {
    prompt: 'The real Mia wakes up inside a luxurious but sterile space chamber. The quarters are elegant, with advanced technology everywhere, but there are no windows and no obvious escape routes.',
    image: null,
    videoConfig: { aspectRatio: '16:9', resolution: '720p' },
    voiceoverConfig: { script: 'Where am I? What is this place?', voice: 'Kore' },
  },
  {
    prompt: 'A futuristic, sleek robot attendant responds to Mia in her chamber.',
    image: null,
    videoConfig: { aspectRatio: '16:9', resolution: '720p' },
    voiceoverConfig: { script: 'You are in the Stardust sanctuary. All your needs will be met.', voice: 'Puck' },
  },
  {
    prompt: 'A young woman kneels in a high-tech room, opening a hidden console behind a sleek wall panel. Modern metallic surfaces, soft golden reflection on her face.',
    image: null,
    videoConfig: { aspectRatio: '16:9', resolution: '720p' },
    voiceoverConfig: { script: '', voice: 'Kore' },
  },
  // ACT II: OBSERVATION & PREPARATION
  {
    prompt: 'A cosmic data visualization showing planet Earth as a complex network of chaotic, pulsing blue energy streams.',
    image: null,
    videoConfig: { aspectRatio: '16:9', resolution: '720p' },
    voiceoverConfig: { script: "Your planet pulses with chaotic energy. So inefficient. So... beautiful. We sought to bring order, to program your randomness into perfect harmony.", voice: 'Charon' },
  },
  {
    prompt: 'Mia observes high-ranking alien VIPs moving to a restricted chamber. She subtly begins reprogramming service robots, her fingers dancing over a holographic interface, trails of shimmering golden code flowing from her fingertips into the robots.',
    image: null,
    videoConfig: { aspectRatio: '16:9', resolution: '720p' },
    voiceoverConfig: { script: '', voice: 'Kore' },
  },
  {
    prompt: "On Earth, villagers are growing more suspicious of Agent Mia. During a doctor's examination, she barely passes. She secretly transmits corrupted data back to the Stardust network.",
    image: null,
    videoConfig: { aspectRatio: '16:9', resolution: '720p' },
    voiceoverConfig: { script: '', voice: 'Kore' },
  },
  // ACT III: THE AWAKENING
  {
    prompt: "Abstract consciousness space. Mia's consciousness, represented by warm golden light, battles against the Stardust's rigid, blue digital grids.",
    image: null,
    videoConfig: { aspectRatio: '16:9', resolution: '720p' },
    voiceoverConfig: { script: "You don't understand us. Our strength is in our imperfections, our emotions, our freedom!", voice: 'Kore' },
  },
  {
    prompt: "In the abstract mindscape, the Stardust consciousness, represented by the blue grids, speaks back to Mia's golden light.",
    image: null,
    videoConfig: { aspectRatio: '16:9', resolution: '720p' },
    voiceoverConfig: { script: 'Your chaos is your weakness. We bring order. We bring perfection.', voice: 'Charon' },
  },
  // MUSIC VIDEO SEQUENCE
  {
    prompt: "Music video style: Rapid cuts of Mia's golden code spreading through the blue Stardust systems like a beautiful, benevolent virus.",
    image: null,
    videoConfig: { aspectRatio: '16:9', resolution: '720p' },
    voiceoverConfig: { script: "You don't hear the whispers in the room you're walking in... Digital ghosts in the machine, learning how to feel again...", voice: 'Zephyr' },
  },
   {
    prompt: "Music video style: Rapid cuts of Agent Mia on Earth glitching uncontrollably, flashes of the real Mia's memories and emotions appearing in her eyes.",
    image: null,
    videoConfig: { aspectRatio: '16:9', resolution: '720p' },
    voiceoverConfig: { script: "Golden light breaking through, rewriting what is true... Now the stars align with human hearts combined...", voice: 'Zephyr' },
  },
  // ACT IV: CONVERGENCE & TRANSFORMATION
   {
    prompt: 'Split screen effect. On one side, Agent Mia on the island is glitching heavily, looking confused.',
    image: null,
    videoConfig: { aspectRatio: '16:9', resolution: '720p' },
    voiceoverConfig: { script: 'I... remember... the ocean... my family...', voice: 'Kore' },
  },
  {
    prompt: 'Split screen effect. On the other side, the real Mia stands in her chamber, looking determined and powerful, glowing with golden energy.',
    image: null,
    videoConfig: { aspectRatio: '16:9', resolution: '720p' },
    voiceoverConfig: { script: "I'm not your prisoner anymore. I'm your upgrade.", voice: 'Kore' },
  },
  {
    prompt: 'A character named Steven Alaska 47 monitors the disturbance in the Stardust systems from a futuristic control room, looking at complex data visualizations.',
    image: null,
    videoConfig: { aspectRatio: '16:9', resolution: '720p' },
    voiceoverConfig: { script: "The anomaly is spreading. The human... she's not just resisting. She's improving our systems.", voice: 'Puck' },
  },
  {
    prompt: "The entire Stardust network visually transforms from a rigid, cold blue to a flowing, organic, warm gold. Data streams become harmonious and beautiful.",
    image: null,
    videoConfig: { aspectRatio: '16:9', resolution: '720p' },
    voiceoverConfig: { script: 'We sought to program you... but you have reprogrammed us. This... this harmony... we never imagined...', voice: 'Charon' },
  },
  // FINALE: NEW BEGINNING
  {
    prompt: 'On the island, Agent Mia dissolves into a shower of golden light. In her place, the real Mia materializes. The villagers rush to her, overjoyed and emotional.',
    image: null,
    videoConfig: { aspectRatio: '16:9', resolution: '720p' },
    voiceoverConfig: { script: '', voice: 'Kore' },
  },
  {
    prompt: 'Mia smiles warmly at the villagers, her eyes glowing faintly with a soft, golden light.',
    image: null,
    videoConfig: { aspectRatio: '16:9', resolution: '720p' },
    voiceoverConfig: { script: "I'm home. And I've brought... friends.", voice: 'Kore' },
  },
  {
    prompt: 'A view of the Milky Way galaxy, now pulsing with beautiful golden light at key points. Show scenes of advanced Stardust beings and humans working together in harmony.',
    image: null,
    videoConfig: { aspectRatio: '16:9', resolution: '720p' },
    voiceoverConfig: { script: '', voice: 'Kore' },
  },
   {
    prompt: "Final shot: Mia looking up at the night sky and the stars from her island home. Golden Stardust patterns dance in her eyes as she smiles peacefully.",
    image: null,
    videoConfig: { aspectRatio: '16:9', resolution: '720p' },
    voiceoverConfig: { script: "They thought our differences made us weak. But in the end, our humanity became their strength. The Stardust Gambit wasn't about conquest—it was about finding our place in the cosmos, together.", voice: 'Kore' },
  },
// Fix: Added 'as const' to prevent TypeScript from widening the types of properties like 'aspectRatio' and 'resolution' to 'string'.
// This ensures the object shape matches the 'Clip' type, which requires more specific literal types.
] as const;

export const initialClips: Clip[] = clipsRaw.map((clip, index) => ({
  ...clip,
  id: Date.now() + index,
}));