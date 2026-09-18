import { useEffect, useRef, useState, type FC } from 'react';
import { Film, Sparkles, Volume2, VolumeX, Eye, Layers } from 'lucide-react';

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
  showTelemetryOverlay?: boolean;
}

export const CinematicMotionBackground: FC<Props> = ({
  className = '',
  showTelemetryOverlay = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Parallax physics state
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseCurrent = useRef({ x: 0, y: 0 });
  const scrollOffset = useRef(0);
  const videoTransformRef = useRef<HTMLDivElement>(null);

  // Playback & chapter state
  const [selectedFeed, setSelectedFeed] = useState<'master' | 'guitar' | 'horn' | 'energy'>('master');
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(27.63);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Aesthetic overlay controls
  const [showFilmGrid, setShowFilmGrid] = useState(true);
  const [showLightLeaks, setShowLightLeaks] = useState(true);
  const [showHUD, setShowHUD] = useState(true);

  // Determine which video source to load
  const activeVideoSrc =
    selectedFeed === 'master'
      ? MASTER_REEL_SRC
      : CHAPTERS.find((c) => c.id === selectedFeed)?.clipSrc || MASTER_REEL_SRC;

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
        // Subtle translation: up to ±22px horizontal, ±14px vertical
        const moveX = mouseCurrent.current.x * -22;
        const moveY = mouseCurrent.current.y * -14 + scrollOffset.current * -0.15;
        // Subtle tilt
        const rotX = mouseCurrent.current.y * 1.2;
        const rotY = mouseCurrent.current.x * -1.5;

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
  }, []);

  /* ── 2. Timecode & Chapter Auto-Tracking ── */
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const t = video.currentTime;
    setCurrentTime(t);
    if (video.duration && !isNaN(video.duration)) {
      setDuration(video.duration);
    }

    if (selectedFeed === 'master') {
      // Check which chapter time range we are currently in
      const idx = CHAPTERS.findIndex(
        (c) => t >= c.timeRange[0] && t < c.timeRange[1]
      );
      if (idx !== -1 && idx !== activeChapterIndex) {
        setActiveChapterIndex(idx);
      }
    }
  };

  // Format SMPTE Timecode: 00:00:SS:FF
  const formatTimecode = (sec: number) => {
    const totalFrames = Math.floor(sec * 24);
    const frames = (totalFrames % 24).toString().padStart(2, '0');
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    const m = Math.floor((sec / 60) % 60).toString().padStart(2, '0');
    return `00:${m}:${s}:${frames}`;
  };

  const handleSelectChapter = (id: 'master' | 'guitar' | 'horn' | 'energy') => {
    setSelectedFeed(id);
    if (id !== 'master') {
      const idx = CHAPTERS.findIndex((c) => c.id === id);
      if (idx !== -1) setActiveChapterIndex(idx);
    }
  };

  const currentChapter = CHAPTERS[activeChapterIndex] || CHAPTERS[0];

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-0 overflow-hidden pointer-events-none select-none ${className}`}
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
          key={activeVideoSrc}
          src={activeVideoSrc}
          autoPlay
          muted={isMuted}
          loop
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          onTimeUpdate={handleTimeUpdate}
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

      {/* 3. Bottom Fade into Content Section */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#F4F0E8] via-[#F4F0E8]/75 to-transparent" />

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

      {/* ── LAYER 4: INTERACTIVE TELEMETRY HUD & CHAPTER SWITCHER ── */}
      {showTelemetryOverlay && showHUD && (
        <div className="absolute top-24 sm:top-28 right-4 sm:right-8 md:right-12 z-20 pointer-events-auto flex flex-col items-end gap-3 max-w-[320px] sm:max-w-[380px]">
          {/* Main Cinematic Telemetry Card */}
          <div className="w-full bg-[#171717]/85 backdrop-blur-md text-[#F4F0E8] border border-white/15 p-3.5 sm:p-4 rounded shadow-2xl space-y-3">
            {/* Top Bar: Live Status & Timecode */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#C91F25] animate-ping" />
                <span className="inline-block w-2 h-2 rounded-full bg-[#C91F25] -ml-4" />
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] font-semibold text-[#F4F0E8]">
                  CINEMATIC MOTION REEL
                </span>
              </div>
              <div className="text-[10px] font-mono tracking-widest text-[#C9A45C]">
                {formatTimecode(currentTime)}
              </div>
            </div>

            {/* Current Active Instrument Readout */}
            <div>
              <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-widest text-[#65625D]">
                <span>CHAPTER {currentChapter.number} // 03</span>
                <span className="text-[#C91F25] font-semibold">{currentChapter.type}</span>
              </div>
              <h4 className="text-sm sm:text-base font-display font-bold tracking-tight text-white mt-0.5">
                {currentChapter.name}
              </h4>
              <p className="text-[10px] sm:text-[11px] font-sans-clean text-[#D8D3CA] leading-snug mt-1 line-clamp-2">
                {currentChapter.description}
              </p>
            </div>

            {/* Playback Scrub/Progress Bar */}
            <div className="space-y-1">
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-gradient-to-r from-[#C91F25] to-[#C9A45C] transition-all duration-200"
                  style={{ width: `${(currentTime / (duration || 27.63)) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[8px] font-mono text-white/40">
                <span>00:00</span>
                <span>{selectedFeed === 'master' ? 'SEAMLESS LOOP (28S)' : 'INSTRUMENT FEED'}</span>
                <span>{formatTimecode(duration || 27.63)}</span>
              </div>
            </div>

            {/* Chapter Selectors / Feeds */}
            <div className="pt-1">
              <div className="text-[8px] font-mono uppercase tracking-widest text-white/50 mb-1.5">
                SELECT CLOUD REEL / INSTRUMENT:
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSelectChapter('master')}
                  className={`px-2 py-1.5 text-[9px] font-mono uppercase tracking-wider rounded text-left transition-all cursor-pointer flex items-center justify-between ${
                    selectedFeed === 'master'
                      ? 'bg-[#C91F25] text-white font-bold shadow-sm'
                      : 'bg-white/5 hover:bg-white/15 text-white/70'
                  }`}
                >
                  <span>MASTER REEL</span>
                  <span className="text-[8px] opacity-75">ALL</span>
                </button>

                {CHAPTERS.map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => handleSelectChapter(ch.id as any)}
                    className={`px-2 py-1.5 text-[9px] font-mono uppercase tracking-wider rounded text-left transition-all cursor-pointer flex items-center justify-between ${
                      selectedFeed === ch.id ||
                      (selectedFeed === 'master' && currentChapter.id === ch.id)
                        ? 'bg-[#C91F25]/30 border border-[#C91F25] text-white font-semibold'
                        : 'bg-white/5 hover:bg-white/15 text-white/70'
                    }`}
                  >
                    <span className="truncate">{ch.name.split(' ')[0]}</span>
                    <span className="text-[8px] opacity-75">{ch.number}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Controls Toolbar: Grid, Leaks, Sound */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[9px] font-mono">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowFilmGrid((p) => !p)}
                  className={`px-2 py-1 rounded flex items-center gap-1 transition-colors cursor-pointer ${
                    showFilmGrid
                      ? 'bg-white/15 text-white'
                      : 'bg-transparent text-white/40 hover:text-white/70'
                  }`}
                  title="Toggle 35mm Film Grid"
                >
                  <Film className="w-3 h-3" />
                  <span>GRID</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowLightLeaks((p) => !p)}
                  className={`px-2 py-1 rounded flex items-center gap-1 transition-colors cursor-pointer ${
                    showLightLeaks
                      ? 'bg-white/15 text-[#C9A45C]'
                      : 'bg-transparent text-white/40 hover:text-white/70'
                  }`}
                  title="Toggle Cinematic Light Leaks"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>LEAKS</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsMuted((p) => !p)}
                  className="p-1 rounded bg-white/5 hover:bg-white/15 text-white/70 transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#C91F25]" />}
                </button>

                <button
                  type="button"
                  onClick={() => setShowHUD(false)}
                  className="p-1 rounded bg-white/5 hover:bg-white/15 text-white/40 hover:text-white/80 transition-colors cursor-pointer"
                  title="Minimize HUD"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Re-open HUD trigger if closed */}
      {showTelemetryOverlay && !showHUD && (
        <button
          type="button"
          onClick={() => setShowHUD(true)}
          className="absolute top-24 sm:top-28 right-4 z-20 pointer-events-auto bg-[#171717]/80 hover:bg-[#C91F25] text-white p-2 rounded border border-white/20 transition-all cursor-pointer flex items-center gap-1.5 text-[9px] font-mono shadow-lg"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>REEL HUD</span>
        </button>
      )}
    </div>
  );
};
