import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-[#F4F0E8]">
      <span className="text-[10px] font-sans-clean tracking-[0.3em] uppercase text-[#C91F25] font-bold block mb-4">
        404 — Page Not Found
      </span>
      <h1 className="font-display text-6xl sm:text-8xl font-bold text-[#171717] tracking-tight mb-4">
        LOST<br />BACKSTAGE
      </h1>
      <p className="font-sans-clean text-sm text-[#65625D] max-w-sm mb-8">
        Looks like you wandered off the circuit. Let's get you back on stage.
      </p>
      <Link
        to="/"
        className="px-8 py-3 bg-[#C91F25] text-[#F4F0E8] text-xs font-sans-clean uppercase tracking-[0.25em] font-bold hover:bg-[#8F171C] transition-colors"
      >
        ← BACK TO HOME
      </Link>
    </main>
  );
}
