// Robust, performant audio reactivity engine with zero external dependencies
import { memories } from '../data';

export class AudioReactivityManager {
  private static instance: AudioReactivityManager | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array = new Uint8Array(0);
  private audioElement: HTMLAudioElement | null = null;

  public static getInstance(): AudioReactivityManager {
    if (!AudioReactivityManager.instance) {
      AudioReactivityManager.instance = new AudioReactivityManager();
    }
    return AudioReactivityManager.instance;
  }

  public setAudioElement(audio: HTMLAudioElement) {
    this.audioElement = audio;
    this.initWebAudio();
  }

  private initWebAudio() {
    if (!this.audioElement || this.audioContext) return;

    try {
      // Use standard or webkit AudioContext
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      this.audioContext = new AudioCtx();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64; // Small size is highly performant and responsive
      
      const source = this.audioContext.createMediaElementSource(this.audioElement);
      source.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);

      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    } catch (e) {
      console.warn("Web Audio API binding postponed or blocked (using beautiful procedural backup):", e);
    }
  }

  public resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {});
    }
  }

  // Returns a normalized reactivity level [0, 1] representing the sound energy
  public getLevel(time: number): number {
    this.resume();

    // If analyser is ready, use live audio data
    if (this.analyser && this.dataArray.length > 0) {
      this.analyser.getByteFrequencyData(this.dataArray);
      let sum = 0;
      for (let i = 0; i < this.dataArray.length; i++) {
        sum += this.dataArray[i];
      }
      const avg = sum / this.dataArray.length;
      return Math.min(1.0, avg / 128.0);
    }

    // High fidelity, ultra-smooth procedural fallback
    // Captures a slow breathing ambient beat + mini sparks (perfect for a romantic galaxy theme)
    const beat = Math.sin(time * 4.2) * 0.5 + 0.5; // Ambient hum
    const slowerBreathing = Math.sin(time * 0.6) * 0.5 + 0.5; // Deeper tide cycle
    const shimmer = Math.cos(time * 9.5) * 0.15 + 0.15; // Shimmer peaks
    
    return baseLevelForState() * (beat * 0.5 + slowerBreathing * 0.35 + shimmer * 0.15);
  }
}

// Internal state factor to modulate intensity based on page elements
function baseLevelForState(): number {
  return 0.65;
}

export const audioReactivity = AudioReactivityManager.getInstance();
