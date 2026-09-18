import { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navigation } from '../components/Navigation';
import { RegistrationModal } from '../components/RegistrationModal';

gsap.registerPlugin(ScrollTrigger);

export function RootLayout() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isArenaMode, setIsArenaMode] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);
  const location = useLocation();

  // Determine active section from pathname
  const activeSection = location.pathname === '/'
    ? 'hero'
    : location.pathname.replace('/', '');

  // Reset scroll + kill old ScrollTriggers on every route change
  useEffect(() => {
    window.scrollTo(0, 0);
    setScrollProgress(0);
    ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [location.pathname]);

  // Lenis smooth scroll — re-init on every route change
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    lenis.on('scroll', ({ progress }: { progress: number }) => {
      setScrollProgress(progress);
    });

    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(ticker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [location.pathname]);

  const handleToggleArenaMode = () => {
    setIsArenaMode((prev) => !prev);
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(isArenaMode ? 140 : 65, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch { /* fallback */ }
  };

  return (
    <div
      className={`relative min-h-screen transition-colors duration-700 selection:bg-[#C91F25] selection:text-[#F4F0E8] overflow-x-hidden font-sans-clean ${
        isArenaMode ? 'arena-mode bg-[#0A0A0A] text-[#F4F0E8]' : 'bg-[#F4F0E8] text-[#171717]'
      }`}
    >
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 z-[60] h-[2px] bg-[#C91F25] pointer-events-none transition-none"
        style={{ width: `${scrollProgress * 100}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Page scroll progress"
      />

      <Navigation
        activeSection={activeSection}
        onOpenRegister={() => setIsRegisterModalOpen(true)}
        isArenaMode={isArenaMode}
        onToggleArenaMode={handleToggleArenaMode}
        lenisRef={lenisRef}
      />

      {/* Page content rendered here */}
      <Outlet context={{ onOpenRegister: () => setIsRegisterModalOpen(true) }} />

      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
}
