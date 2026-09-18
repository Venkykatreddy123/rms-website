import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

export const Footer: FC = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const navLinks = [
    { label: 'About & Manifesto', to: '/about' },
    { label: 'Stage Experience',  to: '/stage' },
    { label: 'The Bands',         to: '/bands' },
    { label: 'Competition',       to: '/competition' },
    { label: 'Watch Archive',     to: '/watch' },
  ];

  return (
    <footer className="relative w-full bg-[#F4F0E8] border-t border-[#D8D3CA] pt-20 pb-12">
      <div className="editorial-container">
        {/* TOP BRAND GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#D8D3CA]">
          <div className="md:col-span-5 space-y-4">
            <Link to="/">
              <img
                src="/assets/images/rithmos_logo.png"
                alt="RITHMOS — Where Bands Rise"
                className="h-14 w-auto object-contain"
                style={{ filter: 'none' }}
              />
            </Link>
            <p className="font-serif-sub italic text-base sm:text-lg text-[#65625D] max-w-sm">
              The premier editorial live-music platform and national grand prix for independent Indian bands.
            </p>
            <div className="text-xs font-sans-clean uppercase tracking-[0.25em] text-[#171717] pt-2">
              BORN IN HYDERABAD — PERFORMING EVERYWHERE
            </div>
          </div>

          <div className="md:col-span-2 space-y-3">
            <span className="text-[10px] font-sans-clean uppercase tracking-[0.25em] text-[#C91F25] font-bold block">
              Navigation
            </span>
            <ul className="space-y-2 text-xs font-sans-clean uppercase tracking-[0.2em]">
              {navLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="text-[#171717] hover:text-[#C91F25] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <span className="text-[10px] font-sans-clean uppercase tracking-[0.25em] text-[#C91F25] font-bold block">
              Circuit Cities
            </span>
            <ul className="space-y-1.5 text-xs font-sans-clean text-[#65625D]">
              <li>Hyderabad (Origin / Finale)</li>
              <li>Bangalore</li>
              <li>Mumbai</li>
              <li>New Delhi</li>
              <li>Kolkata</li>
              <li>Kochi</li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-4">
            <span className="text-[10px] font-sans-clean uppercase tracking-[0.25em] text-[#C91F25] font-bold block">
              Official Dispatch
            </span>
            <p className="text-xs font-sans-clean text-[#65625D]">
              Receive season 01 audition dates, venue tickets, and unreleased live multi-tracks.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for subscribing to the Rithmos Live Dispatch.');
              }}
              className="flex gap-2"
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-[#EDE8DE] border border-[#D8D3CA] text-xs text-[#171717] placeholder:text-[#65625D]/60 focus:outline-none focus:border-[#C91F25]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#C91F25] text-[#F4F0E8] text-xs font-sans-clean uppercase tracking-wider font-semibold hover:bg-[#8F171C] transition-colors"
              >
                JOIN
              </button>
            </form>
          </div>
        </div>

        {/* BOTTOM METADATA & BACK TO TOP */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans-clean text-[#65625D]">
          <div className="flex flex-wrap items-center gap-6">
            <span>© {new Date().getFullYear()} RITHMOS LIVE. ALL RIGHTS RESERVED.</span>
            <span>NO BACKING TRACKS PERMITTED.</span>
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 hover:text-[#C91F25] transition-colors uppercase tracking-widest font-semibold"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-4 h-4 text-[#C91F25]" />
          </button>
        </div>
      </div>
    </footer>
  );
};
