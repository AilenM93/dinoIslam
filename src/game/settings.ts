const SOUND_KEY = "dino-island-sound";
const MOTION_KEY = "dino-island-reduced-motion";

let audioUnlocked = false;
let audioContext: AudioContext | null = null;
let ambientSource: AudioBufferSourceNode | null = null;

function getAudioContext(): AudioContext | null {
  if (!("AudioContext" in window)) return null;
  audioContext ??= new AudioContext();
  return audioContext;
}

function readBoolean(key: string, fallback: boolean): boolean {
  const value = localStorage.getItem(key);
  return value === null ? fallback : value === "true";
}

export function isSoundEnabled(): boolean {
  return readBoolean(SOUND_KEY, true);
}

export function setSoundEnabled(enabled: boolean): void {
  localStorage.setItem(SOUND_KEY, String(enabled));
  if (!enabled) {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    stopAmbient();
  }
  window.dispatchEvent(new CustomEvent("dino-sound-change", { detail: { enabled } }));
}

export function isReducedMotion(): boolean {
  return readBoolean(MOTION_KEY, window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}

export function setReducedMotion(enabled: boolean): void {
  localStorage.setItem(MOTION_KEY, String(enabled));
  document.body.classList.toggle("reduce-motion", enabled);
}

export function unlockAudio(): void {
  audioUnlocked = true;
  const context = getAudioContext();
  if (context?.state === "suspended") void context.resume();
}

export function startAmbient(): void {
  if (!audioUnlocked || !isSoundEnabled() || ambientSource) return;
  const context = getAudioContext();
  if (!context) return;

  const duration = 3;
  const buffer = context.createBuffer(1, context.sampleRate * duration, context.sampleRate);
  const samples = buffer.getChannelData(0);
  let breeze = 0;
  for (let index = 0; index < samples.length; index += 1) {
    breeze = breeze * 0.985 + (Math.random() * 2 - 1) * 0.015;
    samples[index] = breeze;
  }

  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  source.buffer = buffer;
  source.loop = true;
  filter.type = "lowpass";
  filter.frequency.value = 720;
  gain.gain.value = 0.035;
  source.connect(filter).connect(gain).connect(context.destination);
  source.start();
  ambientSource = source;
}

export function stopAmbient(): void {
  if (ambientSource) {
    try {
      ambientSource.stop();
    } catch {}
  }
  ambientSource = null;
}

export function playChirp(): void {
  if (!audioUnlocked || !isSoundEnabled()) return;
  const context = getAudioContext();
  if (!context) return;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(1180, now);
  oscillator.frequency.exponentialRampToValueAtTime(1680, now + 0.11);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.055, now + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.19);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.2);
}

export function playCrack(): void {
  if (!audioUnlocked || !isSoundEnabled()) return;
  const context = getAudioContext();
  if (!context) return;
  const length = Math.floor(context.sampleRate * 0.16);
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let index = 0; index < samples.length; index += 1) {
    const envelope = 1 - index / samples.length;
    samples[index] = (Math.random() * 2 - 1) * envelope * envelope;
  }
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  source.buffer = buffer;
  filter.type = "highpass";
  filter.frequency.value = 520;
  gain.gain.value = 0.095;
  source.connect(filter).connect(gain).connect(context.destination);
  source.start();
}

export function speak(text: string): void {
  if (!audioUnlocked || !isSoundEnabled() || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";
  utterance.rate = 0.88;
  utterance.pitch = 1.08;
  const spanishVoice = window.speechSynthesis
    .getVoices()
    .find((voice) => voice.lang.toLowerCase().startsWith("es"));
  if (spanishVoice) utterance.voice = spanishVoice;
  window.speechSynthesis.speak(utterance);
}

export function announce(text: string): void {
  const status = document.querySelector<HTMLDivElement>("#screen-reader-status");
  if (status) status.textContent = text;
}
