import { Memory, PlanetTheme } from './types';

const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

const videoCaptions = [
  "some people feel like home. u feel like a universe.",
  "the world feels softer with u in it.",
  "if the stars could talk, they would probably talk about u."
];

const photoCaptions = [
  "maybe the stars look prettier because u exist.",
  "semesta kecil ini isinya tentang kamu.",
  "i hope u always find reasons to stay happy.",
  "you deserve soft things in life.",
  "aku harap dunia selalu baik sama kamu.",
  "even galaxies would lose against your smile.",
  "please stay alive for more matcha days.",
  "you make ordinary moments feel beautiful.",
  "you were never hard to love.",
  "jangan lupa bahagia ya teteh."
];

const themes: PlanetTheme[] = ['dream', 'mystery', 'matcha', 'crystal', 'flower', 'vintage', 'neon', 'moon'];

export const memories: Memory[] = [
  ...Array.from({ length: 10 }).map((_, i) => ({
    id: `photo-${i + 1}`,
    type: 'photo' as const,
    theme: i === 9 ? ('birthday' as const) : themes[i % themes.length],
    url: `/images/dehan${i + 1}.jpg`,
    caption: i === 9 
      ? "happy birthday, Dehan Faura Az Zahra. u deserve every beautiful thing coming. Semoga semesta menjagamu dalam kehangatan selalu." 
      : photoCaptions[i],
    size: i === 9 ? 3.4 : randomRange(1.8, 3.0),
    orbitRadius: i === 9 ? 23 : randomRange(10, 25),
    orbitSpeed: i === 9 ? 0.05 : randomRange(0.04, 0.12) * (Math.random() > 0.5 ? 1 : -1),
    orbitAngleOffset: i === 9 ? 0.5 : randomRange(0, Math.PI * 2),
    yOffset: i === 9 ? 0 : randomRange(-6, 6),
  })),
  ...Array.from({ length: 3 }).map((_, i) => ({
    id: `video-${i + 1}`,
    type: 'video' as const,
    theme: themes[(i + 4) % themes.length],
    url: `/video/faura${i + 1}.mp4`,
    caption: videoCaptions[i],
    size: randomRange(3.5, 4.5),
    orbitRadius: randomRange(28, 40),
    orbitSpeed: randomRange(0.02, 0.05) * (Math.random() > 0.5 ? 1 : -1),
    orbitAngleOffset: randomRange(0, Math.PI * 2),
    yOffset: randomRange(-10, 10),
  }))
];
