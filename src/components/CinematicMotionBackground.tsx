import { useEffect, useRef, useState, type FC } from 'react';

export interface ChapterInfo {
  id: string;
  number: string;
  name: string;
  type: string;
  description: string;
  clipSrc?: string;
  timeRange: [number, number]; // in seconds for the master reel
}

export const CHAPTERS: ChapterInfo[] = [
  {
    id: 'guitar',
    number: '01',
    name: 'ELECTRIC GUITAR',
    type: 'HIGH-GAIN VALVE RESONANCE',
    description: 'Continuous camera tracking along electric guitar body, pickguard & nickel frets under stage spots.',
    clipSrc: '/assets/videos/guitar.mp4',
    timeRange: [0, 8.8],
  },
  {
    id: 'horn',
    number: '02',
    name: 'FRENCH HORN & BRASS',
    type: 'ACOUSTIC CAVITY & HARMONICS',
    description: 'Macro camera gliding through polished brass bells, acoustic reflection tubes & valve passages.',
    clipSrc: '/assets/videos/french_horn.mp4',
    timeRange: [8.8, 17.6],
  },
  {
    id: 'energy',
    number: '03',
    name: 'SOUND ENERGY & TRANSDUCTION',
    type: 'KINETIC FREQUENCY WAVEFRONTS',
    description: 'Kinetic acoustic energy, magnetic coil vibration, and decibel pressure traveling through sonic transducers.',
    clipSrc: '/assets/videos/sound_energy.mp4',
    timeRange: [17.6, 27.63],
  },
];

const MASTER_REEL_SRC = '/assets/videos/rithmos_cinematic_bg.mp4';

interface Props {
  className?: string;
  isGlobal?: boolean;
}

export const CinematicMotionBackground: FC<Props> = ({
  className = '',
  isGlobal = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Parallax physics state
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseCurrent = useRef({ x: 0, y: 0 });
  const scrollOffset = useRef(0);
  const videoTransformRef = useRef<HTMLDivElement>(null);

  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const showFilmGrid = true;
  const showLightLeaks = true;

  /* ── 1. Parallax Motion Engine (Mouse Lerp + Scroll Offset) ── */
  useEffect(() => {
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to [-1, 1]
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mouseTarget.current = { x: nx, y: ny };
    };

    const handleScroll = () => {
      scrollOffset.current = window.scrollY || window.pageYOffset;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    const updateParallax = () => {
      mouseCurrent.current.x = lerp(mouseCurrent.current.x, mouseTarget.current.x, 0.04);
      mouseCurrent.current.y = lerp(mouseCurrent.current.y, mouseTarget.current.y, 0.04);

      if (videoTransformRef.current) {
        // Subtle translation: up to ±20px horizontal
        const moveX = mouseCurrent.current.x * -20;
        // Bounded scroll translation for global or local
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const scrollFraction = Math.min(1, Math.max(0, scrollOffset.current / maxScroll));
        const scrollDrift = isGlobal ? (scrollFraction - 0.5) * -40 : scrollOffset.current * -0.15;
        const moveY = mouseCurrent.current.y * -12 + scrollDrift;

        // Subtle tilt
        const rotX = mouseCurrent.current.y * 1.0;
        const rotY = mouseCurrent.current.x * -1.2;

        videoTransformRef.current.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.08)`;
      }

      animId = requestAnimationFrame(updateParallax);
    };

    animId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animId);
    };
  }, [isGlobal]);

  return (
    <div
      ref={containerRef}
      className={`${
        isGlobal ? 'fixed' : 'absolute'
      } inset-0 z-0 overflow-hidden pointer-events-none select-none ${className}`}
      style={{ perspective: '1200px' }}
      aria-hidden="true"
    >
      {/* ── LAYER 0: CINEMATIC VIDEO WITH SMOOTH PARALLAX ── */}
      <div
        ref={videoTransformRef}
        className="absolute inset-[-6%] w-[112%] h-[112%] will-change-transform transition-opacity duration-1000"
        style={{
          opacity: isVideoLoaded ? 1 : 0.85,
          transformOrigin: 'center center',
        }}
      >
        <video
          ref={videoRef}
          src={MASTER_REEL_SRC}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.08] saturate-[1.12]"
        />
      </div>

      {/* ── LAYER 1: CINEMATIC DEPTH & COLOR GRADING SCRIMS ── */}
      {/* 1. Deep Film Vignette */}
      <div
        className="absolute inset-0 bg-radial from-transparent via-black/25 to-black/75"
        style={{ mixBlendMode: 'multiply' }}
      />

      {/* 2. Rithmos Editorial Cream Left Gradient for Typography Readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#F4F0E8]/95 via-[#F4F0E8]/70 to-[#F4F0E8]/15 w-full md:w-[75%] lg:w-[65%]" />

      {/* 3. Bottom Fade into Content Section (only for local Hero mode) */}
      {!isGlobal && (
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#F4F0E8] via-[#F4F0E8]/75 to-transparent" />
      )}

      {/* 4. Top Header Shadow Scrim */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/40 via-black/15 to-transparent" />

      {/* ── LAYER 2: ORGANIC DYNAMIC LIGHT LEAKS ── */}
      {showLightLeaks && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-700">
          {/* Light Leak A: Top-Left Halogen & Amber Glow */}
          <div
            className="absolute -top-[20%] -left-[15%] w-[85vw] h-[85vh] rounded-full blur-[110px] animate-light-leak-a pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(201,31,37,0.32) 0%, rgba(217,119,6,0.22) 40%, rgba(201,164,92,0.12) 70%, transparent 85%)',
              mixBlendMode: 'screen',
            }}
          />

          {/* Light Leak B: Bottom-Right Crimson & Golden Flare */}
          <div
            className="absolute -bottom-[25%] -right-[15%] w-[75vw] h-[75vh] rounded-full blur-[120px] animate-light-leak-b pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(201,31,37,0.38) 0%, rgba(143,23,28,0.25) 45%, rgba(245,158,11,0.15) 75%, transparent 90%)',
              mixBlendMode: 'color-dodge',
            }}
          />

          {/* Anamorphic Horizontal Streak Accent */}
          <div
            className="absolute top-[38%] left-0 right-0 h-[2px] opacity-25"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(201,31,37,0.8) 35%, rgba(245,158,11,0.9) 50%, rgba(201,31,37,0.8) 65%, transparent 100%)',
              filter: 'blur(1px)',
              mixBlendMode: 'screen',
            }}
          />
        </div>
      )}

      {/* ── LAYER 3: 35MM TECHNICAL FILM GRID & RETICLE OVERLAYS ── */}
      {showFilmGrid && (
        <div className="absolute inset-0 pointer-events-none transition-opacity duration-700">
          {/* Cinemascope 2.39:1 / 16:9 Framing Guidelines */}
          <div className="absolute inset-[30px] sm:inset-[48px] md:inset-[64px] border border-white/10 rounded-sm">
            {/* Rule-of-Thirds Grid Accent Lines */}
            <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-white/[0.04] border-t border-dashed border-white/[0.07]" />
            <div className="absolute top-2/3 left-0 right-0 h-[1px] bg-white/[0.04] border-t border-dashed border-white/[0.07]" />
            <div className="absolute left-1/3 top-0 bottom-0 w-[1px] bg-white/[0.04] border-l border-dashed border-white/[0.07]" />
            <div className="absolute left-2/3 top-0 bottom-0 w-[1px] bg-white/[0.04] border-l border-dashed border-white/[0.07]" />

            {/* Precision Corner Reticle Crosshairs: Top-Left */}
            <div className="absolute -top-[1px] -left-[1px] w-6 h-6 border-t-2 border-l-2 border-[#C91F25]/70" />
            <span className="absolute top-1.5 left-2 text-[8px] font-mono tracking-widest text-[#C91F25]/70 uppercase">
              TL // 01
            </span>

            {/* Top-Right */}
            <div className="absolute -top-[1px] -right-[1px] w-6 h-6 border-t-2 border-r-2 border-[#C91F25]/70" />
            <span className="absolute top-1.5 right-2 text-[8px] font-mono tracking-widest text-white/50 uppercase">
              TR // 02
            </span>

            {/* Bottom-Left */}
            <div className="absolute -bottom-[1px] -left-[1px] w-6 h-6 border-b-2 border-l-2 border-[#C91F25]/70" />
            <span className="absolute bottom-1.5 left-2 text-[8px] font-mono tracking-widest text-white/50 uppercase">
              BL // 03
            </span>

            {/* Bottom-Right */}
            <div className="absolute -bottom-[1px] -right-[1px] w-6 h-6 border-b-2 border-r-2 border-[#C91F25]/70" />
            <span className="absolute bottom-1.5 right-2 text-[8px] font-mono tracking-widest text-[#C91F25]/70 uppercase">
              BR // 04
            </span>

            {/* Center Framing Target Reticle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border border-white/20 rounded-full animate-reticle-pulse flex items-center justify-center pointer-events-none">
              <div className="w-1.5 h-1.5 bg-[#C91F25] rounded-full" />
              <div className="absolute w-4 h-[1px] bg-white/40" />
              <div className="absolute h-4 w-[1px] bg-white/40" />
            </div>

            {/* Micro Aspect Ratio Indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3 text-[9px] font-mono uppercase tracking-[0.25em] text-white/40 bg-black/40 px-3 py-1 rounded backdrop-blur-xs border border-white/10">
              <span className="text-[#C91F25] font-semibold">REC [●]</span>
              <span>35MM ANAMORPHIC</span>
              <span className="hidden sm:inline">2.39:1 SAFE AREA</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
