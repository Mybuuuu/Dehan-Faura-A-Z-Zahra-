import { motion, AnimatePresence } from 'motion/react';
import { AppState, Memory } from '../types';
import { FloatingLetter } from './LetterSystem';

interface OverlayProps {
  appState: AppState;
  focusedMemory: Memory | null;
  onCloseMemory: () => void;
  onEnterFinale: () => void;
  unlockedAffirmation: string | null;
  onCloseAffirmation: () => void;
  openedLetter: FloatingLetter | null;
  onCloseLetter: () => void;
}

export function Overlay({ 
  appState, 
  focusedMemory, 
  onCloseMemory, 
  onEnterFinale,
  unlockedAffirmation,
  onCloseAffirmation,
  openedLetter,
  onCloseLetter
}: OverlayProps) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10 font-sans">
      <AnimatePresence>
        {appState === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 1.5 }}
            className="flex flex-col items-center gap-4 mt-64"
          >
            <h1 className="text-5xl md:text-6xl font-light tracking-[0.3em] text-white opacity-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] fade-in">
              DEHAN'S UNIVERSE
            </h1>
            <p className="text-red-400/80 text-sm tracking-[0.4em] uppercase font-medium animate-pulse">
              touch the planet to begin exploring
            </p>
          </motion.div>
        )}

        {appState === 'exploring' && !focusedMemory && !unlockedAffirmation && !openedLetter && (
            <motion.div
                key="explore-hint"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, delay: 2 }}
                className="absolute bottom-12 flex flex-col items-center gap-4"
            >
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping" />
                  <p className="text-white/60 text-[10px] tracking-[0.2em] uppercase bg-white/5 px-6 py-2 rounded-full backdrop-blur-[10px] border border-white/10 select-none">
                      tap a planet, connect stars, or click envelopes
                  </p>
                </div>
                <button 
                  onClick={onEnterFinale}
                  className="pointer-events-auto mt-4 text-white/60 hover:text-white hover:border-pink-300/30 transition-colors duration-500 tracking-[0.2em] uppercase text-[10px] bg-white/5 hover:bg-rose-950/25 px-6 py-2 rounded-full backdrop-blur-[10px] border border-white/10"
                >
                  Enter Finale
                </button>
            </motion.div>
        )}

        {focusedMemory && (
          <motion.div
            key="memory-overlay"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="pointer-events-auto absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-12 z-50"
            onClick={onCloseMemory}
          >
            <div className="max-w-4xl w-full flex flex-col items-center gap-8" onClick={e => e.stopPropagation()}>
              {focusedMemory.type === 'photo' ? (
                <div className="relative rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(225,29,72,0.3)] ring-1 ring-white/20">
                  <img src={focusedMemory.url} alt="Memory" loading="lazy" className="max-h-[60vh] w-auto object-contain" />
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(139,92,246,0.4)] ring-1 ring-white/30 w-full max-w-3xl aspect-video bg-black">
                  <video src={focusedMemory.url} controls autoPlay playsInline preload="metadata" className="w-full h-full object-contain" />
                </div>
              )}
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="text-white/90 text-xl md:text-3xl font-serif text-center italic font-light max-w-2xl mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
              >
                "{focusedMemory.caption}"
              </motion.p>
              
              <button 
                onClick={onCloseMemory}
                className="pointer-events-auto text-white/60 hover:text-white transition-colors uppercase tracking-[0.2em] text-[10px] bg-white/5 px-6 py-2 rounded-full backdrop-blur-[10px] border border-white/10"
              >
                Keep Floating
              </button>
            </div>
          </motion.div>
        )}

        {/* Render Constellation Complete/Unlocks */}
        {unlockedAffirmation && (
          <motion.div
            key="constellation-modal"
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            transition={{ duration: 0.7 }}
            className="pointer-events-auto absolute inset-0 bg-black/85 backdrop-blur-xl flex flex-col items-center justify-center p-6 z-50"
            onClick={onCloseAffirmation}
          >
            <div 
              className="max-w-xl w-full bg-gradient-to-b from-rose-950/20 via-neutral-950/80 to-purple-950/20 px-8 py-12 rounded-3xl border border-rose-300/15 shadow-[0_0_60px_rgba(244,63,94,0.15)] flex flex-col items-center text-center gap-8 relative overflow-hidden" 
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-rose-500/10 rounded-full filter blur-3xl -translate-x-12 -translate-y-12 animate-pulse" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full filter blur-3xl translate-x-12 translate-y-12 animate-pulse" />

              <div className="flex flex-col gap-2">
                <span className="text-[10px] tracking-[0.4em] text-pink-300/70 font-mono uppercase">
                  constellation activated
                </span>
                <h3 className="text-2xl font-light tracking-wide text-rose-100 font-serif italic font-medium">
                  starry message unlocked
                </h3>
              </div>

              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-300 to-rose-400 drop-shadow-[0_0_10px_#fb7185] animate-ping" />

              <p className="text-xl md:text-2xl text-neutral-200 font-light font-serif leading-relaxed italic max-w-md drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] leading-relaxed">
                "{unlockedAffirmation}"
              </p>

              <button 
                onClick={onCloseAffirmation}
                className="pointer-events-auto mt-4 text-rose-200/85 hover:text-white transition-all duration-500 uppercase tracking-[0.3em] text-[10px] bg-white/5 hover:bg-rose-500/10 px-8 py-3 rounded-full backdrop-blur border border-rose-300/10 hover:border-rose-400/30"
              >
                keep floating
              </button>
            </div>
          </motion.div>
        )}

        {/* Render Floating Letter Unlocks */}
        {openedLetter && (
          <motion.div
            key="letter-modal"
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="pointer-events-auto absolute inset-0 bg-black/85 backdrop-blur-xl flex flex-col items-center justify-center p-6 z-50"
            onClick={onCloseLetter}
          >
            <div 
              className={`max-w-md w-full bg-gradient-to-tr ${openedLetter.color} px-8 py-10 rounded-3xl border shadow-[0_0_80px_rgba(244,63,94,0.18)] flex flex-col items-center text-center gap-8 relative overflow-hidden backdrop-blur-2xl`}
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-400/10 rounded-full filter blur-2xl animate-pulse" />
              
              <div className="flex flex-col gap-1">
                <span className="text-[9px] tracking-[0.4em] text-white/50 uppercase font-mono">
                  holographic letter
                </span>
                <h3 className="text-xl text-white font-light tracking-wide font-serif italic">
                  {openedLetter.title}
                </h3>
              </div>

              <div className="w-10 h-[1px] bg-white/10" />

              <p className="text-lg md:text-xl text-white/90 font-light font-serif leading-relaxed italic lowercase text-center max-w-[340px] px-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] leading-relaxed">
                "{openedLetter.content}"
              </p>

              <div className="w-10 h-[1px] bg-white/10" />

              <button 
                onClick={onCloseLetter}
                className="pointer-events-auto text-white/70 hover:text-white transition-all duration-500 uppercase tracking-[0.25em] text-[9px] bg-white/5 hover:bg-white/15 px-8 py-3 rounded-full border border-white/10"
              >
                let it float back
              </button>
            </div>
          </motion.div>
        )}

        {appState === 'finale' && (
          <div className="absolute inset-0 flex items-center justify-center bg-transparent z-20 pointer-events-none select-none">
            {/* Slide 1 - Fades in at 2s, fades out at 7s */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: [0, 1, 1, 0], y: [15, 0, 0, -10] }}
              transition={{ times: [0, 0.15, 0.85, 1], duration: 6, delay: 2, ease: "easeInOut" }}
              className="absolute flex items-center justify-center px-6 text-center"
            >
              <h2 className="text-2xl md:text-4xl text-rose-100 font-serif italic font-light leading-relaxed drop-shadow-[0_0_20px_rgba(251,113,133,0.5)]">
                every memory,<br />
                every laugh,<br />
                every moment...<br />
                <span className="text-pink-300 font-normal tracking-wide drop-shadow-[0_0_12px_#fb7185]">became its own universe.</span>
              </h2>
            </motion.div>

            {/* Slide 2 - Fades in at 8.5s, fades out at 13.5s */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: [0, 1, 1, 0], y: [15, 0, 0, -10] }}
              transition={{ times: [0, 0.15, 0.85, 1], duration: 6, delay: 8.5, ease: "easeInOut" }}
              className="absolute flex items-center justify-center px-6 text-center"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl text-rose-100 font-serif italic font-light leading-relaxed drop-shadow-[0_0_20px_rgba(251,113,133,0.5)]">
                and somehow,<br />
                <span className="text-pink-300 font-normal tracking-wide drop-shadow-[0_0_12px_#fb7185]">all of them still lead back to you.</span>
              </h2>
            </motion.div>

            {/* Slide 3 - Climax slide! Happy Birthday Dehan Faura Az Zahra. Fades in at 15s and stays. */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2.5, delay: 15, ease: "easeOut" }}
              className="absolute flex flex-col items-center justify-center px-6 text-center gap-6"
            >
              <motion.p
                initial={{ opacity: 0, letterSpacing: '0.1em' }}
                animate={{ opacity: 1, letterSpacing: '0.4em' }}
                transition={{ duration: 2.0, delay: 15.5 }}
                className="text-[11px] text-pink-300/80 uppercase font-medium drop-shadow-[0_0_10px_#fb7185]"
              >
                for our brightest star
              </motion.p>
              
              <h3 className="text-4xl md:text-7xl font-sans tracking-wide text-transparent bg-clip-text bg-gradient-to-br from-pink-100 via-rose-300 to-amber-200 drop-shadow-[0_0_50px_rgba(244,63,94,0.65)] leading-tight select-none font-light">
                happy birthday,<br />
                <span className="font-serif italic font-semibold text-rose-200 drop-shadow-[0_0_20px_#f43f5e]">Dehan Faura Az Zahra</span>
              </h3>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 17.5 }}
                className="text-xs text-rose-200/50 font-serif italic max-w-sm mt-3"
              >
                "semesta kecil ini akan selalu menceritakan kebaikanmu."
              </motion.p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
