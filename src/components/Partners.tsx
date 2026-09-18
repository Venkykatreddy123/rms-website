import type { FC } from 'react';

export const Partners: FC = () => {
  const partners = [
    { name: 'DECCAN SOUND WORKS', role: 'Custom 48-Channel Valve Consoles' },
    { name: 'VALVE & RIBBON', role: 'Microphone & Acoustic Architecture' },
    { name: 'SOUTHERN ROCK ARCHIVE', role: 'Historical Preservations' },
    { name: 'INDIAN GUITAR GUILD', role: 'Custom Tour Instruments' },
    { name: 'TELANGANA MUSIC COMMISSION', role: 'Cultural Heritage Patron' },
    { name: 'ANALOGUE CUT STUDIOS', role: 'Direct-to-Vinyl Master Pressing' },
  ];

  return (
    <section className="relative w-full bg-[#EDE8DE] py-24 border-t border-[#D8D3CA]">
      <div className="editorial-container">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between border-b border-[#D8D3CA] pb-6 mb-12">
          <div>
            <span className="text-[10px] font-sans-clean tracking-[0.3em] uppercase text-[#C91F25] font-bold block mb-1">
              Patrons of Pure Sound
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
              STAGE & AUDIO ALLIANCES
            </h3>
          </div>
          <p className="text-xs font-sans-clean text-[#65625D] mt-2 md:mt-0 uppercase tracking-widest">
            Committed to Zero Compromise Live Acoustics
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {partners.map((partner, idx) => (
            <div key={idx} className="space-y-2 group">
              <div className="w-6 h-[1px] bg-[#C91F25] group-hover:w-12 transition-all duration-300" />
              <h4 className="font-display text-xs sm:text-sm font-bold text-[#171717] tracking-wider leading-snug">
                {partner.name}
              </h4>
              <p className="text-[11px] font-sans-clean text-[#65625D]">
                {partner.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
