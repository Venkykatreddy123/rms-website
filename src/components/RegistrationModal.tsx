import { useState, type FC, type FormEvent, useEffect } from 'react';
import { X, CheckCircle2, Send, ArrowRight, ArrowLeft } from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  bandName: string;
  genre: string;
  originCity: string;
  membersCount: string;
  demoUrl: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  biography: string;
}

const STORAGE_KEY = 'rithmos_reg_draft';

const STEPS = [
  { label: 'Band Info', description: 'Tell us about your band' },
  { label: 'Performance', description: 'Your live demo & sound' },
  { label: 'Contact', description: 'How to reach you' },
];

const defaultForm: FormData = {
  bandName: '',
  genre: 'Indie Rock / Alternative',
  originCity: '',
  membersCount: '4',
  demoUrl: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  biography: '',
};

export const RegistrationModal: FC<RegistrationModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(0);
  const [dossierID] = useState(() => Math.floor(100000 + Math.random() * 900000));

  // Load saved draft from sessionStorage
  const [formData, setFormData] = useState<FormData>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) return { ...defaultForm, ...JSON.parse(saved) };
    } catch { /* ignore */ }
    return defaultForm;
  });

  // Autosave to sessionStorage on every change
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch { /* ignore */ }
  }, [formData]);

  // Reset when modal re-opens after submit
  useEffect(() => {
    if (isOpen && submitted) {
      setSubmitted(false);
      setStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const update = (field: keyof FormData, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const canProceedStep0 = formData.bandName.trim() !== '' && formData.originCity.trim() !== '';
  const canProceedStep1 = formData.demoUrl.trim() !== '';
  const canSubmit =
    formData.contactName.trim() !== '' &&
    formData.contactEmail.trim() !== '' &&
    formData.contactPhone.trim() !== '';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitted(true);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const handleClose = () => {
    setStep(0);
    onClose();
  };

  const fieldClass =
    'w-full px-4 py-3 bg-[#EDE8DE] border border-[#D8D3CA] text-sm text-[#171717] placeholder:text-[#65625D]/60 focus:outline-none focus:border-[#C91F25] transition-colors';
  const labelClass =
    'block text-[11px] font-sans-clean uppercase tracking-[0.2em] text-[#171717] font-semibold mb-2';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#171717]/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Band Registration"
    >
      <div className="relative w-full max-w-2xl bg-[#F4F0E8] border border-[#D8D3CA] overflow-hidden shadow-2xl max-h-[92vh] flex flex-col">

        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 text-[#171717] hover:text-[#C91F25] transition-colors"
          aria-label="Close registration"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <>
            {/* ── Header ── */}
            <div className="px-8 pt-8 pb-0">
              <span className="text-[10px] font-sans-clean tracking-[0.3em] uppercase text-[#C91F25] font-bold block mb-1">
                Official Artist Call — Season 01
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#171717] tracking-tight">
                REGISTER YOUR BAND
              </h2>

              {/* Step progress dots + labels */}
              <div className="flex items-center gap-0 mt-5 mb-6">
                {STEPS.map((s, i) => {
                  const done = i < step;
                  const active = i === step;
                  return (
                    <div key={i} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                            done
                              ? 'bg-[#C91F25] text-white'
                              : active
                              ? 'bg-[#171717] text-white ring-2 ring-[#C91F25] ring-offset-2'
                              : 'bg-[#D8D3CA] text-[#65625D]'
                          }`}
                        >
                          {done ? '✓' : i + 1}
                        </div>
                        <span
                          className={`text-[9px] font-sans-clean uppercase tracking-wider mt-1 ${
                            active ? 'text-[#C91F25] font-bold' : 'text-[#65625D]'
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div
                          className={`flex-1 h-[2px] mx-2 mb-4 transition-all duration-500 ${
                            done ? 'bg-[#C91F25]' : 'bg-[#D8D3CA]'
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div className="w-full h-1 bg-[#D8D3CA] rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-[#C91F25] transition-all duration-500 ease-out"
                  style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* ── Step Content ── */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto px-8 pb-8">
              {/* STEP 0 — Band Info */}
              {step === 0 && (
                <div className="space-y-5 animate-fadeIn">
                  <p className="text-xs font-sans-clean text-[#65625D] italic mb-2">
                    {STEPS[0].description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Band Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.bandName}
                        onChange={(e) => update('bandName', e.target.value)}
                        placeholder="e.g. Aswekeepsearching"
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Primary Genre *</label>
                      <select
                        value={formData.genre}
                        onChange={(e) => update('genre', e.target.value)}
                        className={fieldClass}
                      >
                        <option>Indie Rock / Alternative</option>
                        <option>Carnatic / Hindustani Progressive Rock</option>
                        <option>Folk Fusion</option>
                        <option>Progressive Metal / Heavy Rock</option>
                        <option>Post-Rock / Instrumental</option>
                        <option>Blues / Funk / Soul</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Home City / State *</label>
                      <input
                        type="text"
                        required
                        value={formData.originCity}
                        onChange={(e) => update('originCity', e.target.value)}
                        placeholder="e.g. Hyderabad, Telangana"
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Band Members Count</label>
                      <input
                        type="number"
                        min="2"
                        max="16"
                        value={formData.membersCount}
                        onChange={(e) => update('membersCount', e.target.value)}
                        className={fieldClass}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 1 — Performance */}
              {step === 1 && (
                <div className="space-y-5 animate-fadeIn">
                  <p className="text-xs font-sans-clean text-[#65625D] italic mb-2">
                    {STEPS[1].description}
                  </p>
                  <div>
                    <label className={labelClass}>Uncut Live Performance Link *</label>
                    <input
                      type="url"
                      required
                      value={formData.demoUrl}
                      onChange={(e) => update('demoUrl', e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className={fieldClass}
                    />
                    <span className="text-[11px] font-sans-clean text-[#65625D] mt-1.5 block">
                      Must be an unedited live room capture demonstrating raw instrumental balance. YouTube, Drive, or Vimeo accepted.
                    </span>
                  </div>
                  <div>
                    <label className={labelClass}>Artist Statement & Live Instrumentation</label>
                    <textarea
                      rows={4}
                      value={formData.biography}
                      onChange={(e) => update('biography', e.target.value)}
                      placeholder="Describe your sound, instrumentation, and why you belong on the Rithmos National Stage."
                      className={fieldClass}
                    />
                  </div>
                </div>
              )}

              {/* STEP 2 — Contact */}
              {step === 2 && (
                <div className="space-y-5 animate-fadeIn">
                  <p className="text-xs font-sans-clean text-[#65625D] italic mb-2">
                    {STEPS[2].description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className={labelClass}>Representative Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.contactName}
                        onChange={(e) => update('contactName', e.target.value)}
                        placeholder="Band leader / manager"
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Contact Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.contactEmail}
                        onChange={(e) => update('contactEmail', e.target.value)}
                        placeholder="official@band.com"
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.contactPhone}
                        onChange={(e) => update('contactPhone', e.target.value)}
                        placeholder="+91 98765 43210"
                        className={fieldClass}
                      />
                    </div>
                  </div>
                  <div className="bg-[#EDE8DE] border border-[#D8D3CA] p-4 text-xs font-sans-clean text-[#65625D] space-y-1">
                    <span className="font-bold text-[#171717] uppercase tracking-wider block mb-2">Your Application Summary</span>
                    <div className="grid grid-cols-2 gap-1">
                      <span className="text-[#C91F25] font-semibold">Band:</span>
                      <span>{formData.bandName || '—'}</span>
                      <span className="text-[#C91F25] font-semibold">Genre:</span>
                      <span>{formData.genre}</span>
                      <span className="text-[#C91F25] font-semibold">City:</span>
                      <span>{formData.originCity || '—'}</span>
                      <span className="text-[#C91F25] font-semibold">Members:</span>
                      <span>{formData.membersCount}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Navigation Buttons ── */}
              <div className="flex items-center justify-between mt-8 pt-5 border-t border-[#D8D3CA]">
                <span className="text-[11px] font-sans-clean text-[#65625D]">
                  {step === 2 ? 'Zero registration fee · Closes Nov 10, 2026' : `Step ${step + 1} of ${STEPS.length}`}
                </span>
                <div className="flex items-center gap-3">
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={() => setStep((s) => s - 1)}
                      className="flex items-center gap-1.5 px-4 py-2 border border-[#D8D3CA] text-xs font-sans-clean uppercase tracking-wider text-[#65625D] hover:border-[#171717] hover:text-[#171717] transition-colors"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      Back
                    </button>
                  )}
                  {step < STEPS.length - 1 ? (
                    <button
                      type="button"
                      disabled={step === 0 ? !canProceedStep0 : !canProceedStep1}
                      onClick={() => setStep((s) => s + 1)}
                      className="flex items-center gap-1.5 px-6 py-2 bg-[#171717] text-[#F4F0E8] text-xs font-sans-clean uppercase tracking-wider font-semibold hover:bg-[#C91F25] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className="flex items-center gap-2 px-8 py-2 bg-[#C91F25] text-[#F4F0E8] text-xs font-sans-clean uppercase tracking-[0.2em] font-bold hover:bg-[#8F171C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>SUBMIT APPLICATION</span>
                    </button>
                  )}
                </div>
              </div>
            </form>
          </>
        ) : (
          /* ── Success State ── */
          <div className="text-center py-14 px-8 space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#C91F25]/10 border border-[#C91F25] text-[#C91F25] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-sans-clean uppercase tracking-[0.3em] text-[#C9A45C] font-bold block">
                Application Received — Dossier ID: #{dossierID}
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#171717]">
                WELCOME TO THE CIRCUIT,<br />
                {formData.bandName.toUpperCase() || 'ARTIST'}
              </h3>
              <p className="font-serif-sub italic text-sm text-[#65625D] max-w-sm mx-auto mt-2">
                Our editorial jury has received your live demo submission. You will receive an audition schedule notice at{' '}
                <span className="text-[#171717] not-italic font-semibold">{formData.contactEmail || 'your email'}</span>.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="px-8 py-3 bg-[#171717] text-[#F4F0E8] text-xs font-sans-clean uppercase tracking-[0.2em] font-semibold hover:bg-[#C91F25] transition-colors"
            >
              RETURN TO STAGE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
