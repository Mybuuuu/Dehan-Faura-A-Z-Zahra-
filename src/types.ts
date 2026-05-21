export type AppState = 'intro' | 'exploring' | 'finale';
export type MediaType = 'photo' | 'video';
export type PlanetTheme = 'dream' | 'mystery' | 'matcha' | 'crystal' | 'flower' | 'vintage' | 'neon' | 'moon' | 'birthday';

export interface Memory {
  id: string;
  type: MediaType;
  theme: PlanetTheme;
  url: string;
  caption: string;
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitAngleOffset: number;
  yOffset: number;
}

