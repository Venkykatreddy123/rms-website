import { useState, useEffect, useRef, type FC } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BANDS_DATA } from '../data/rithmosData';
import type { Band } from '../types';
import { X, Play, Music2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const Bands: FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [selectedBand, setSelectedBand] = useState<Band | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const trigger = triggerRef.current;
    const gallery = galleryRef.current;

    if (!section || !trigger || !gallery) return;

    // Calculate total horizontal scroll width
    const totalWidth = gallery.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      // Horizontal editorial scroll pinned to vertical scroll
      gsap.to(gallery, {
        x: () => -totalWidth - 120,
        ease: 'none',
        scrollTrigger: {
          trigger: trigger,
          start: 'top top',
          end: () => `+=${totalWidth * 1.2}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Individual band viewport entrance animations
      const bandElements = gallery.querySelectorAll('.band-item');
      bandElements.forEach((el) => {
        const img = el.querySelector('.band-img');
        const num = el.querySelector('.band-num');
        const title = el.querySelector('.band-title');

        if (img && num && title) {
          gsap.fromTo(
            img,
            { scale: 1.08 },
            {
              scale: 1,
              ease: 'power1.out',
              scrollTrigger: {
                trigger: el,
                containerAnimation: undefined,
                start: 'left 85%',
                end: 'left 40%',
                scrub: true,
              },
            }
          );

          gsap.fromTo(
            num,
            { opacity: 0.2 },
            {
              opacity: 1,
              scrollTrigger: {
                trigger: el,
                start: 'left 80%',
                end: 'left 50%',
                scrub: true,
              },
            }
          );

          gsap.fromTo(
            title,
            { opacity: 0, y: 15 },
            {
              opacity: 1,
              y: 0,
              scrollTrigger: {
                trigger: el,
                start: 'left 75%',
                end: 'left 45%',
                scrub: true,
              },
            }
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="bands"
      ref={sectionRef}
      className="relative w-full bg-[#F4F0E8] overflow-hidden border-t border-[#D8D3CA]"
    >
      {/* SECTION HEADER */}
      <div className="editorial-container pt-24 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#D8D3CA] pb-6">
          <div>
            <span className="text-[11px] font-sans-clean tracking-[0.3em] uppercase text-[#C91F25] font-semibold block mb-2">
              03 / The Artists
            </span>
            <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-[#171717]">
              THE BANDS
            </h2>
          </div>
          <p className="font-serif-sub italic text-base text-[#65625D] mt-4 md:mt-0 max-w-md">
            No manufactured tracks. Raw human expression, original composition, and stages commanded nationwide.
          </p>
        </div>
      </div>

      {/* PINNED HORIZONTAL GALLERY CONTAINER */}
      <div ref={triggerRef} className="relative w-full h-[85vh] flex items-center overflow-hidden">
        <div
          ref={galleryRef}
          className="flex items-center gap-16 md:gap-28 pl-8 md:pl-24 pr-48 will-change-transform"
        >
          {BANDS_DATA.map((band, index) => {
            // Staggered vertical positioning as per prompt layout
            const verticalOffsets = ['translate-y-0', 'translate-y-12', '-translate-y-8', 'translate-y-16', 'translate-y-4'];
            const offsetClass = verticalOffsets[index % verticalOffsets.length];

            return (
              <div
                key={band.id}
                onClick={() => setSelectedBand(band)}
                className={`band-item group flex-shrink-0 cursor-pointer transition-transform duration-300 ${offsetClass}`}
                style={{ width: 'clamp(320px, 34vw, 520px)' }}
              >
                {/* 01 / NUMBER */}
                <div className="flex items-baseline justify-between mb-4">
                  <span className="band-num font-display text-3xl sm:text-4xl font-bold text-[#C91F25] tracking-tight transition-opacity duration-300">
                    {band.number}
                  </span>
                  <span className="text-[11px] font-sans-clean uppercase tracking-[0.25em] text-[#65625D]">
                    {band.origin}
                  </span>
                </div>

                {/* BAND IMAGE CONTAINER (Strictly no card borders, no dropshadows) */}
                <div className="relative aspect-[4/5] sm:aspect-[16/11] overflow-hidden bg-[#EDE8DE] border-b border-[#D8D3CA]">
                  <img
                    src={band.image}
                    alt={band.name}
                    className="band-img w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.035] filter brightness-[1.01]"
                  />
                  {/* Subtle red line accent on hover */}
                  <div className="absolute bottom-0 left-0 h-[3px] bg-[#C91F25] w-0 group-hover:w-full transition-all duration-500 ease-out" />
                </div>

                {/* BAND NAME & GENRE */}
                <div className="mt-6 space-y-2">
                  <h3 className="band-title font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#171717] tracking-tight transition-transform duration-300 group-hover:translate-x-2">
                    {band.name}
                  </h3>
                  <div className="flex items-center gap-4 text-xs font-sans-clean uppercase tracking-[0.2em] text-[#65625D]">
                    <span>{band.genre}</span>
                    <span className="w-1 h-1 rounded-full bg-[#D8D3CA]" />
                    <span className="text-[#C91F25] group-hover:underline">VIEW DOSSIER →</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* EDITORIAL ARTIST DOSSIER MODAL */}
      {selectedBand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-[#171717]/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-[#F4F0E8] border border-[#D8D3CA] p-8 md:p-12 overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedBand(null)}
              className="absolute top-6 right-6 p-2 text-[#171717] hover:text-[#C91F25] transition-colors"
              aria-label="Close dossier"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-5">
                <div className="aspect-[4/5] bg-[#EDE8DE] overflow-hidden border border-[#D8D3CA]">
                  <img
                    src={selectedBand.image}
                    alt={selectedBand.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-4 p-4 bg-[#EDE8DE] border border-[#D8D3CA] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-sans-clean uppercase tracking-wider text-[#C91F25]">
                    <Music2 className="w-3.5 h-3.5" />
                    <span>Featured Track</span>
                  </div>
                  <div className="text-sm font-display font-bold text-[#171717]">
                    {selectedBand.trackTitle}
                  </div>
                </div>
              </div>

              <div className="md:col-span-7 space-y-6">
                <div>
                  <span className="font-display text-2xl text-[#C91F25] font-bold">
                    {selectedBand.number}
                  </span>
                  <h3 className="font-display text-3xl sm:text-4xl font-bold text-[#171717] mt-1">
                    {selectedBand.name}
                  </h3>
                  <div className="text-xs font-sans-clean uppercase tracking-[0.25em] text-[#65625D] mt-1">
                    {selectedBand.genre} — {selectedBand.origin}
                  </div>
                </div>

                <div className="border-l-2 border-[#C91F25] pl-4 py-1">
                  <p className="font-serif-sub italic text-lg text-[#171717] leading-relaxed">
                    "{selectedBand.quote}"
                  </p>
                </div>

                <div>
                  <h4 className="text-[11px] font-sans-clean uppercase tracking-[0.25em] text-[#65625D] mb-2 font-semibold">
                    Band Lineup
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedBand.members.map((member, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-[#EDE8DE] text-xs font-sans-clean tracking-wider text-[#171717] border border-[#D8D3CA]"
                      >
                        {member}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#D8D3CA] flex items-center justify-between">
                  <button
                    onClick={() => {
                      alert(`Playing live performance excerpt for ${selectedBand.name}`);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-[#C91F25] text-[#F4F0E8] text-xs font-sans-clean uppercase tracking-[0.2em] font-semibold hover:bg-[#8F171C] transition-colors"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>LISTEN LIVE SESSION</span>
                  </button>
                  <span className="text-xs font-sans-clean text-[#65625D]">
                    Official Rithmos Archive
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
