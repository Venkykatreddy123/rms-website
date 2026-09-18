import { useState, useEffect, useRef, type FC } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, ArrowUpRight, Menu, X, Zap } from 'lucide-react';
import type Lenis from 'lenis';

interface NavigationProps {
  onOpenRegister: () => void;
  activeSection: string;
  isArenaMode?: boolean;
  onToggleArenaMode?: () => void;
  lenisRef?: React.RefObject<Lenis | null>;
}

export const Navigation: FC<NavigationProps> = ({
  onOpenRegister,
  isArenaMode = false,
  onToggleArenaMode,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [gainNode, setGainNode] = useState<GainNode | null>(null);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  // Debounced scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        setIsScrolled(window.scrollY > 60);
      }, 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const toggleAtmosphereAudio = () => {
    try {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.04, ctx.currentTime);
        masterGain.connect(ctx.destination);
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(110, ctx.currentTime);
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);
        osc1.connect(filter);
        filter.connect(masterGain);
        osc1.start();
        setAudioCtx(ctx);
        setGainNode(masterGain);
        setIsAudioPlaying(true);
      } else {
        if (isAudioPlaying) {
          gainNode?.gain.setTargetAtTime(0, audioCtx.currentTime, 0.2);
          setTimeout(() => { audioCtx.suspend(); setIsAudioPlaying(false); }, 200);
        } else {
          audioCtx.resume();
          gainNode?.gain.setTargetAtTime(0.04, audioCtx.currentTime, 0.2);
          setIsAudioPlaying(true);
        }
      }
    } catch { setIsAudioPlaying(!isAudioPlaying); }
  };

  const navLinks = [
    { label: 'ABOUT',       to: '/about' },
    { label: 'STAGE',       to: '/stage' },
    { label: 'BANDS',       to: '/bands' },
    { label: 'COMPETITION', to: '/competition' },
    { label: 'WATCH',       to: '/watch' },
  ];

  const activeLinkClass = 'text-[#C91F25] after:absolute after:bottom-2 after:left-0 after:w-full after:h-[2px] after:bg-[#C91F25]';
  const baseLinkClass   = 'relative py-3 px-1 text-xs font-sans-clean uppercase tracking-[0.25em] font-medium transition-colors hover:text-[#C91F25]';

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#F4F0E8]/95 backdrop-blur-md border-b border-[#D8D3CA] shadow-[0_4px_24px_rgba(0,0,0,0.04)] py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="editorial-container flex items-center justify-between">

        {/* LOGO — routes to home */}
        <Link
          to="/"
          className="flex items-center focus:outline-none"
          aria-label="Rithmos Home"
        >
          <img
            src="/assets/images/rithmos_logo.png"
            alt="RITHMOS — Where Bands Rise"
            className="h-9 md:h-11 w-auto object-contain"
            style={{ filter: 'none' }}
          />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center space-x-8" aria-label="Main navigation">
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                `${baseLinkClass} ${isActive ? activeLinkClass : 'text-[#171717]'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* ARENA MODE */}
          {onToggleArenaMode && (
            <button
              onClick={onToggleArenaMode}
              title={isArenaMode ? 'Switch to Editorial Mode' : 'Switch to Live Arena Mode'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] sm:text-[11px] font-sans-clean tracking-wider uppercase border transition-all duration-300 rounded-sm ${
                isArenaMode
                  ? 'bg-[#C91F25] text-[#F4F0E8] border-[#C91F25] shadow-[0_0_15px_rgba(201,31,37,0.5)]'
                  : 'bg-transparent text-[#65625D] border-[#D8D3CA] hover:border-[#171717] hover:text-[#171717]'
              }`}
            >
              <Zap className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isArenaMode ? 'text-[#F4F0E8] fill-current animate-pulse' : ''}`} />
              <span className="font-semibold whitespace-nowrap hidden sm:inline">
                {isArenaMode ? 'ARENA: LIVE' : 'HOUSE LIGHTS'}
              </span>
            </button>
          )}

          {/* ROOM TONE */}
          <button
            onClick={toggleAtmosphereAudio}
            title={isAudioPlaying ? 'Mute ambient stage tone' : 'Enable ambient stage tone'}
            className="flex items-center gap-1.5 text-[11px] font-sans-clean tracking-wider uppercase text-[#65625D] hover:text-[#C91F25] transition-colors px-2 py-2"
          >
            {isAudioPlaying
              ? <><Volume2 className="w-3.5 h-3.5 text-[#C91F25]" /><span className="hidden xl:inline text-[#C91F25]">Room Tone</span></>
              : <><VolumeX className="w-3.5 h-3.5 opacity-60" /><span className="hidden xl:inline">Room Tone</span></>
            }
          </button>

          {/* REGISTER */}
          <button
            onClick={onOpenRegister}
            className="flex items-center gap-1.5 px-4 sm:px-5 py-2 border border-[#C91F25] text-[#C91F25] hover:bg-[#C91F25] hover:text-[#F4F0E8] text-[11px] sm:text-xs font-sans-clean uppercase tracking-[0.2em] font-semibold transition-all duration-300 whitespace-nowrap"
          >
            <span>REGISTER</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* MOBILE HAMBURGER */}
          <button
            onClick={() => setMobileMenuOpen((p) => !p)}
            className="lg:hidden p-2 text-[#171717] hover:text-[#C91F25] transition-colors"
            aria-label="Toggle Navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F4F0E8]/98 backdrop-blur-md border-b border-[#D8D3CA] px-6 py-6">
          <nav className="flex flex-col" aria-label="Mobile navigation">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={label}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-sans-clean uppercase tracking-[0.25em] font-medium py-3.5 border-b border-[#D8D3CA]/60 transition-colors ${
                    isActive ? 'text-[#C91F25]' : 'text-[#171717] hover:text-[#C91F25]'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            <div className="pt-5 flex flex-col gap-3">
              {onToggleArenaMode && (
                <button
                  onClick={() => { onToggleArenaMode(); setMobileMenuOpen(false); }}
                  className="flex items-center justify-between text-xs uppercase tracking-wider py-3 px-3 border border-[#D8D3CA] rounded-sm"
                >
                  <span className="flex items-center gap-2">
                    <Zap className={`w-4 h-4 ${isArenaMode ? 'text-[#C91F25]' : 'text-[#65625D]'}`} />
                    Concert Arena Mode
                  </span>
                  <span className={`font-bold ${isArenaMode ? 'text-[#C91F25]' : 'text-[#65625D]'}`}>
                    {isArenaMode ? 'ACTIVE' : 'OFF'}
                  </span>
                </button>
              )}

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={toggleAtmosphereAudio}
                  className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#65625D] py-2"
                >
                  {isAudioPlaying ? <Volume2 className="w-4 h-4 text-[#C91F25]" /> : <VolumeX className="w-4 h-4" />}
                  {isAudioPlaying ? 'Stage Sound On' : 'Stage Sound Off'}
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/bands'); }}
                  className="text-xs uppercase font-bold tracking-[0.2em] text-[#C91F25] flex items-center gap-1 py-2"
                >
                  REGISTER BAND <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
