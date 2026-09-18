import { useState, type FC } from 'react';
import { WATCH_VIDEOS } from '../data/rithmosData';
import type { VideoItem } from '../types';
import { Play, X, Clock, MapPin } from 'lucide-react';

export const Watch: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeVideo, setActiveVideo] = useState<VideoItem>(WATCH_VIDEOS[0]);
  const [modalVideo, setModalVideo] = useState<VideoItem | null>(null);

  const categories = ['ALL', 'LIVE', 'BAND STORIES', 'BACKSTAGE', 'MOMENTS'];

  const filteredVideos =
    selectedCategory === 'ALL'
      ? WATCH_VIDEOS
      : WATCH_VIDEOS.filter((v) => v.category === selectedCategory);

  return (
    <section
      id="watch"
      className="relative w-full bg-[#F4F0E8] py-28 md:py-40 border-t border-[#D8D3CA]"
    >
      <div className="editorial-container">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#D8D3CA] pb-6 mb-12">
          <div>
            <span className="text-[11px] font-sans-clean tracking-[0.3em] uppercase text-[#C91F25] font-semibold block mb-2">
              06 / The Archive
            </span>
            <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-[#171717]">
              WATCH & LISTEN
            </h2>
          </div>
          <p className="font-serif-sub italic text-base text-[#65625D] mt-4 md:mt-0 max-w-md">
            Documentary captures, uncut live soundboard multi-tracks, and green room confessionals.
          </p>
        </div>

        {/* MAIN SCREEN: LARGE FEATURED PERFORMANCE */}
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-[#EDE8DE] border border-[#D8D3CA] overflow-hidden group mb-12">
          <img
            src={activeVideo.thumbnail}
            alt={activeVideo.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.015]"
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/80 via-transparent to-[#171717]/30 pointer-events-none" />

          {/* Featured details overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-[#C91F25] text-[#F4F0E8] text-[10px] uppercase font-sans-clean font-bold tracking-[0.25em]">
                  {activeVideo.category}
                </span>
                <span className="text-xs text-[#EDE8DE] font-sans-clean flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {activeVideo.duration}
                </span>
                <span className="text-xs text-[#EDE8DE] font-sans-clean flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {activeVideo.location}
                </span>
              </div>
              <h3 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-[#F4F0E8] leading-tight">
                {activeVideo.title}
              </h3>
            </div>

            {/* Play Button Trigger */}
            <button
              onClick={() => setModalVideo(activeVideo)}
              className="inline-flex items-center gap-3 px-6 py-3.5 bg-[#C91F25] text-[#F4F0E8] text-xs font-sans-clean uppercase tracking-[0.2em] font-semibold hover:bg-[#8F171C] transition-colors self-start md:self-auto"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>WATCH FULL SET</span>
            </button>
          </div>
        </div>

        {/* CATEGORY FILTERS */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 text-xs font-sans-clean uppercase tracking-[0.2em] transition-all duration-300 border ${
                selectedCategory === cat
                  ? 'bg-[#C91F25] text-[#F4F0E8] border-[#C91F25]'
                  : 'bg-transparent text-[#65625D] border-[#D8D3CA] hover:border-[#171717] hover:text-[#171717]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* SMALL CONTENT ITEMS SLIDING UPWARD BENEATH (No permanent center play button; hover shows red play indicator) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => {
                setActiveVideo(video);
                setModalVideo(video);
              }}
              className="group cursor-pointer space-y-4"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#EDE8DE] border border-[#D8D3CA]">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />

                {/* Red Play Indicator Appears on Hover Only */}
                <div className="absolute bottom-4 right-4 w-10 h-10 bg-[#C91F25] text-[#F4F0E8] flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>

                <div className="absolute top-3 left-3 px-2 py-0.5 bg-[#171717]/70 backdrop-blur-sm text-[10px] font-sans-clean text-[#F4F0E8] tracking-wider uppercase">
                  {video.duration}
                </div>
              </div>

              {/* Meta */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-sans-clean uppercase tracking-[0.2em] text-[#65625D]">
                  <span className="text-[#C91F25] font-semibold">{video.category}</span>
                  <span>{video.year}</span>
                </div>
                <h4 className="font-display text-lg font-bold text-[#171717] group-hover:text-[#C91F25] transition-colors leading-snug">
                  {video.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FULL SCREEN VIDEO MODAL */}
      {modalVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-[#171717]/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-5xl bg-[#171717] border border-[#C91F25]/40 overflow-hidden shadow-2xl">
            <button
              onClick={() => setModalVideo(null)}
              className="absolute top-4 right-4 z-20 p-2 text-[#F4F0E8] hover:text-[#C91F25] transition-colors"
              aria-label="Close video"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Video Player Canvas / Simulation */}
            <div className="relative aspect-[16/9] w-full bg-black flex items-center justify-center">
              <img
                src={modalVideo.thumbnail}
                alt={modalVideo.title}
                className="w-full h-full object-cover opacity-60 filter brightness-[1.05]"
              />

              {/* Simulated Live Broadcast UI Overlay */}
              <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1 bg-[#C91F25] text-white text-[10px] uppercase font-sans-clean font-bold tracking-widest rounded-sm">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>RITHMOS LIVE FEED</span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white/90">
                <div>
                  <h4 className="font-display text-lg md:text-2xl font-bold">{modalVideo.title}</h4>
                  <p className="text-xs font-sans-clean text-white/60">{modalVideo.location}</p>
                </div>
                <div className="text-xs font-sans-clean tracking-widest text-[#C9A45C]">
                  48kHz / 24-Bit FLAC
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
