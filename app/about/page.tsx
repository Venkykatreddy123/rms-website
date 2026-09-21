"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import WaveformDivider from "@/components/ui/WaveformDivider";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const keyHighlights = [
  {
    num: "48",
    title: "Auditioned Bands",
    desc: "Scouted pan-India across 12 cities for Season One.",
  },
  {
    num: "04",
    title: "Tournament Stages",
    desc: "From underground jam pads to the 12,000-seat mega arena.",
  },
  {
    num: "₹25L",
    title: "Career Fund",
    desc: "₹10L cash + record deal + 5-city headline tour.",
  },
  {
    num: "100%",
    title: "Artist Ownership",
    desc: "Musicians retain 100% of their publishing and master rights.",
  },
];

const stagesJourney = [
  {
    step: "STAGE 01",
    title: "The Acoustic Vaults",
    venue: "Sonic Lab Studios, Jubilee Hills",
    format: "Closed-Door Multi-Track Stem Audition",
    desc: "48 shortlisted bands undergo rigorous 45-minute live tracking sessions. Every instrument is recorded via 24-channel analog preamps with a zero-pitch-correction policy. Evaluated by seasoned FOH mixing engineers on timing, dynamic separation, and tone calibration.",
    specs: "Marshall JCM800 & JVM410 stacks · Ampeg SVT-CL · DW Collector's drums · Shure Beta 58A array",
  },
  {
    step: "STAGE 02",
    title: "The Club Circuit",
    venue: "Heart Cup Coffee & EXT by Moonshine, Hyderabad",
    format: "Head-to-Head Club Battles",
    desc: "24 advancing bands face the ultimate live test: packed, sweat-drenched club rooms where the crowd is inches away from the pedalboards. Bands perform 30-minute high-octane sets that test crowd engagement, improvisational agility, and sonic grit.",
    specs: "d&b audiotechnik V-Series line array · 8x JBL SRX wedges · Custom industrial lighting rig",
  },
  {
    step: "STAGE 03",
    title: "The Open-Air Amphitheatre",
    venue: "Shilpakala Vedika Amphitheatre, Hitec City",
    format: "Semi-Final Festival Stage",
    desc: "12 semi-finalist acts perform before an open-air audience of 3,500+ fans. Full festival lighting rigs, multi-cam 4K concert broadcast recording, and live jury critiques. Only the top 4 bands punch their ticket to the arena finale.",
    specs: "Meyer Sound LEO system · GrandMA3 lighting console · 8-camera 4K cine broadcast",
  },
  {
    step: "STAGE 04",
    title: "The Gachibowli Live Arena",
    venue: "Gachibowli Stadium Live Arena, Hyderabad",
    format: "The Grand Championship Coronation",
    desc: "The definitive 12,000-capacity arena finale. 4 finalist bands battle for the ₹25,00,000 career launchpad. Engineered with stadium line arrays, pyrotechnics, and real-time crowd decibel meter scoring to crown India's next rock heavyweights.",
    specs: "L-Acoustics K2 stadium array (180,000W) · 48x Robe MegaPointe · Real-time dB SPL crowd telemetry",
  },
];

const launchpadPerks = [
  {
    icon: "💰",
    title: "₹10,00,000 Direct Cash Prize",
    desc: "Unrestricted prize capital to fund equipment, touring, rehearsal spaces, and band living expenses without debt or predatory contracts.",
  },
  {
    icon: "🎛️",
    title: "Full Studio Album Production",
    desc: "Track, mix, and master a 6-track EP in a world-class studio with national-award-winning audio engineers and Dolby Atmos mastering.",
  },
  {
    icon: "🚐",
    title: "5-City National Headline Tour",
    desc: "Fully funded headline tour across premier venues in Mumbai, Bengaluru, New Delhi, Pune, and Hyderabad with dedicated sound crew.",
  },
  {
    icon: "📜",
    title: "100% Artist Copyright Protection",
    desc: "RITHMOS never takes artist publishing rights or master royalties. You wrote it, you performed it, you own it forever.",
  },
  {
    icon: "🎬",
    title: "4K Cinematic Live Video Assets",
    desc: "Broadcast-quality multi-cam concert videos and behind-the-scenes documentary shorts to skyrocket your booking value.",
  },
  {
    icon: "🤝",
    title: "Industry Booking & Label Showcase",
    desc: "Direct access to festival programmers, booking agencies, endorsement deals, and national media editorial features.",
  },
];

const scoringRubric = [
  {
    weight: "30%",
    title: "Musicianship & Tightness",
    detail: "Rhythm section locking, tempo stability, harmonic separation, vocal pitch accuracy, and complex transition execution.",
  },
  {
    weight: "25%",
    title: "Originality & Songcraft",
    detail: "Melodic hooks, arrangement dynamics, lyrical distinctiveness, and memorable thematic identity in original compositions.",
  },
  {
    weight: "25%",
    title: "Stage Presence & Live Energy",
    detail: "Command of the stage, natural charisma, emotional connection with the room, and visual cohesion as a unified band.",
  },
  {
    weight: "20%",
    title: "Crowd Response & Decibel Meter",
    detail: "Real-time acoustic SPL decibel measurement of audience roar, singalongs, and genuine live crowd reception.",
  },
];

const values = [
  {
    icon: "⚡",
    title: "100% Live · Zero Artificiality",
    desc: "No lip-syncing, no pre-rendered vocal backings, and no synthetic trickery. RITHMOS celebrates the raw, dangerous electricity of real musicians playing real instruments in real time.",
  },
  {
    icon: "🎸",
    title: "Touring-Grade Backline Provided",
    desc: "Every band plays through stadium-grade tube amplifiers, handcrafted drum kits, and calibrated vocal microphones so musical talent, not equipment budget, decides the winner.",
  },
  {
    icon: "🏛️",
    title: "Hyderabad's Sonic Heritage",
    desc: "From the legendary Deccan rock explosion of the 90s to today's vibrant multilingual indie scene, RITHMOS builds a permanent cathedral for the city's musical soul.",
  },
  {
    icon: "🌟",
    title: "Artist-Centric Ecosystem",
    desc: "Free registration for all bands, fair jury scoring, professional hospitality, and zero exploitative lock-in clauses. We exist solely to elevate artists.",
  },
];

export default function AboutPage() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const valueCards = document.querySelectorAll(".value-card");
      if (valueCards.length > 0) {
        gsap.fromTo(
          valueCards,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: { trigger: ".values-section", start: "top 75%" },
          }
        );
      }

      const perkCards = document.querySelectorAll(".perk-card");
      if (perkCards.length > 0) {
        gsap.fromTo(
          perkCards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: { trigger: ".launchpad-section", start: "top 75%" },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ─── PAGE HERO ─────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          paddingTop: "120px",
          paddingBottom: "5rem",
          overflow: "hidden",
          background: "var(--bg)",
        }}
      >
        {/* Background guitar image with subtle gradient */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Image
            src="/images/guitar.jpg"
            alt=""
            fill
            priority
            style={{ objectFit: "cover", opacity: 0.22, filter: "saturate(0.7) brightness(0.9)" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, var(--bg) 0%, transparent 45%, var(--bg) 95%)",
            }}
          />
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: "1160px",
            margin: "0 auto",
            padding: "0 2rem",
            textAlign: "center",
          }}
        >
          {/* Top Label */}
          <p
            className="label-caps"
            style={{
              marginBottom: "1.25rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            ⸺ About RITHMOS ⸺
          </p>

          {/* Main Headline */}
          <h1
            className="display-hero"
            style={{
              fontSize: "clamp(2.2rem, 5.2vw, 4.2rem)",
              color: "var(--bone)",
              lineHeight: 0.96,
              marginBottom: "1.25rem",
            }}
          >
            We Give Bands a<br />
            <span style={{ color: "var(--red)" }}>Stage They Deserve</span>
          </h1>

          {/* Subtitle / Core Mission Statement */}
          <p
            className="body-copy"
            style={{
              maxWidth: "760px",
              margin: "0 auto 2.25rem",
              fontSize: "1.05rem",
              lineHeight: 1.7,
              color: "#CBD5E1",
            }}
          >
            RITHMOS is India&apos;s premier stadium-scale live rock championship and artist development ecosystem.
            Born in Hyderabad to champion real musicianship: 48 handpicked bands, 4 tournament stages, touring-grade
            backlines, zero backing tracks, and a ₹25,00,000 career fund with 100% artist copyright retention.
          </p>

          {/* CTAs */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              marginBottom: "3rem",
              flexWrap: "wrap",
            }}
          >
            <Link href="/contact" className="btn-primary" style={{ padding: "0.85rem 2.2rem", fontSize: "0.95rem" }}>
              Register Your Band (Free) →
            </Link>
            <Link href="/competition" className="btn-outline" style={{ padding: "0.85rem 2.2rem", fontSize: "0.95rem" }}>
              View Knockout Bracket
            </Link>
          </div>

          {/* Key Executive Pillars: 4 Snapshot Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1.25rem",
              maxWidth: "1100px",
              margin: "0 auto",
              textAlign: "left",
            }}
            className="metrics-grid"
          >
            {[
              {
                tag: "FORMAT // 01",
                title: "48 Hand-Picked Bands",
                desc: "Pan-India talent scouted across 12 cities competing through 4 tournament stages.",
                metric: "48 BANDS",
                accent: "var(--red)",
              },
              {
                tag: "STAGES // 02",
                title: "4 Iconic Arenas",
                desc: "From intimate soundboard rehearsal vaults to the 12,000-seat Gachibowli Stadium.",
                metric: "12K SEATS",
                accent: "var(--red)",
              },
              {
                tag: "FUND // 03",
                title: "₹25L Career Fund",
                desc: "₹10L direct cash prize + 6-track EP studio deal + 5-city national headline tour.",
                metric: "₹25,00,000",
                accent: "var(--gold)",
              },
              {
                tag: "RIGHTS // 04",
                title: "100% Artist Ownership",
                desc: "Artists retain 100% of their publishing rights, master recordings, and creative independence.",
                metric: "100% RIGHTS",
                accent: "var(--red)",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className="card-stage"
                style={{
                  padding: "1.6rem 1.35rem",
                  background: "#12141C",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderTop: `3px solid ${card.accent}`,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontWeight: 800,
                      fontSize: "0.68rem",
                      color: card.accent,
                      letterSpacing: "0.1em",
                      display: "block",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {card.tag}
                  </span>
                  <h4
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      color: "#FFFFFF",
                      textTransform: "uppercase",
                      letterSpacing: "0.03em",
                      margin: "0 0 0.5rem 0",
                    }}
                  >
                    {card.title}
                  </h4>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.82rem",
                      color: "#CBD5E1",
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {card.desc}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: "1.2rem",
                    paddingTop: "0.75rem",
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      color: card.accent,
                    }}
                  >
                    {card.metric}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveformDivider />

      {/* ─── THE MANIFESTO / ORIGIN ───────────────────────────────────────── */}
      <section
        className="timeline-section"
        style={{
          padding: "6rem 2.5rem",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.75rem" }}>
          <span className="hud-badge red">THE MOVEMENT</span>
          <span className="mono-telemetry">WHY RITHMOS EXISTS</span>
        </div>

        <h2
          className="display-section"
          style={{ fontSize: "clamp(1.75rem, 3.2vw, 2.6rem)", color: "var(--bone)", marginBottom: "3rem" }}
        >
          Live Music is Under Attack. <span style={{ color: "var(--red)" }}>We Built the Fortress.</span>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "4rem",
            alignItems: "center",
          }}
          className="about-split-grid"
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1.15rem",
                color: "#FFFFFF",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                marginBottom: "1.2rem",
                lineHeight: 1.45,
              }}
            >
              In an era dominated by algorithmic streaming playlists, pre-programmed backtracks, and solo vocal competitions, the ancient, sacred craft of the live band has been sidelined.
            </p>

            <p className="body-copy" style={{ marginBottom: "1.2rem", color: "#CBD5E1" }}>
              Nothing in recorded sound matches the kinetic velocity of a drummer locking into a bassline, a guitar amplifier roaring through tube overdrive, and a vocalist commanding a stadium of thousands. Hyderabad has always possessed the hunger, the talent, and the legendary underground culture.
            </p>

            <p className="body-copy" style={{ marginBottom: "1.2rem", color: "#CBD5E1" }}>
              What bands lacked was an authentic, stadium-scale property that respected their musicianship. RITHMOS bridges the gap between the rehearsal jam room and national headline touring, providing bands with world-class touring backlines, uncompromising audio production, and a life-changing career fund.
            </p>

            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
              <Link href="/competition" className="btn-primary">
                Explore The Competition →
              </Link>
              <Link href="/contact" className="btn-outline">
                Register Your Band (Free)
              </Link>
            </div>
          </div>

          <div
            className="card-stage"
            style={{
              padding: "2.2rem",
              background: "#12141C",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "1.25rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "#FFFFFF",
                marginBottom: "1.2rem",
                borderBottom: "2px solid var(--red)",
                paddingBottom: "0.5rem",
              }}
            >
              The 4 Pillars of RITHMOS
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              {[
                { title: "Zero Backing Tracks", desc: "100% live instruments. Every note, beat, and vocal harmony is generated on stage." },
                { title: "Artist-First Copyright", desc: "Artists retain 100% of their publishing rights, master recordings, and creative independence." },
                { title: "Stadium Audio Backline", desc: "World-class touring gear (Marshall, Ampeg, DW, Shure) provided at every stage." },
                { title: "Merit-Driven Judging", desc: "Transparent jury scoring combined with live audience decibel meter telemetry." },
              ].map((pillar, i) => (
                <div key={i} style={{ display: "flex", gap: "0.85rem", alignItems: "flex-start" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontWeight: 800,
                      fontSize: "0.8rem",
                      color: "var(--red)",
                      marginTop: "2px",
                    }}
                  >
                    0{i + 1}
                  </span>
                  <div>
                    <h5 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.95rem", color: "#FFFFFF", margin: 0, textTransform: "uppercase" }}>
                      {pillar.title}
                    </h5>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "#CBD5E1", margin: "2px 0 0 0", lineHeight: 1.45 }}>
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <WaveformDivider />

      {/* ─── THE 4-STAGE TOURNAMENT ARCHITECTURE ──────────────────────────── */}
      <section
        style={{
          padding: "6rem 2.5rem",
          background: "var(--bg)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span className="hud-badge red">TOURNAMENT ARCHITECTURE</span>
            <h2
              className="display-section"
              style={{
                fontSize: "clamp(1.75rem, 3.2vw, 2.6rem)",
                color: "var(--bone)",
                marginTop: "0.5rem",
              }}
            >
              The 4 Stages of <span style={{ color: "var(--red)" }}>Ascension</span>
            </h2>
            <p className="body-copy" style={{ maxWidth: "600px", margin: "0.75rem auto 0", color: "#CBD5E1" }}>
              How 48 raw contenders are evaluated, challenged, and distilled into one definitive champion.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "2rem",
            }}
            className="stages-grid"
          >
            {stagesJourney.map((stg, i) => (
              <div
                key={i}
                className="card-stage"
                style={{
                  padding: "2.2rem",
                  background: "#12141C",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderTop: `4px solid ${i === 3 ? "var(--gold)" : "var(--red)"}`,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontWeight: 800,
                        fontSize: "0.75rem",
                        color: i === 3 ? "var(--gold)" : "var(--red)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {stg.step}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.7rem",
                        color: "#CBD5E1",
                        background: "rgba(255,255,255,0.06)",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "4px",
                      }}
                    >
                      {stg.format}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      fontSize: "1.45rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.03em",
                      color: "#FFFFFF",
                      margin: "0 0 0.35rem 0",
                    }}
                  >
                    {stg.title}
                  </h3>

                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.8rem",
                      color: "var(--red)",
                      fontWeight: 600,
                      marginBottom: "1rem",
                    }}
                  >
                    📍 {stg.venue}
                  </p>

                  <p
                    className="body-copy"
                    style={{
                      fontSize: "0.92rem",
                      color: "#CBD5E1",
                      lineHeight: 1.6,
                      marginBottom: "1.5rem",
                    }}
                  >
                    {stg.desc}
                  </p>
                </div>

                <div
                  style={{
                    background: "#161922",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "6px",
                    padding: "0.85rem 1rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      color: "var(--red)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      display: "block",
                      marginBottom: "0.3rem",
                    }}
                  >
                    Stage Backline Spec //
                  </span>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.8rem",
                      color: "#CBD5E1",
                      margin: 0,
                      lineHeight: 1.45,
                    }}
                  >
                    {stg.specs}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ₹25,00,000 CAREER LAUNCHPAD BREAKDOWN ────────────────────────── */}
      <section
        className="launchpad-section"
        style={{
          padding: "6rem 2.5rem",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span className="hud-badge gold">CAREER DEVELOPMENT FUND</span>
          <h2
            className="display-section"
            style={{
              fontSize: "clamp(1.75rem, 3.2vw, 2.6rem)",
              color: "var(--bone)",
              marginTop: "0.5rem",
            }}
          >
            The ₹25,00,000 <span style={{ color: "var(--gold)" }}>Launchpad Breakdown</span>
          </h2>
          <p className="body-copy" style={{ maxWidth: "620px", margin: "0.75rem auto 0", color: "#CBD5E1" }}>
            A comprehensive artist acceleration package designed to transform talented live musicians into self-sustaining, nationally touring headliners.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.5rem",
          }}
          className="perks-grid"
        >
          {launchpadPerks.map((perk, idx) => (
            <div
              key={idx}
              className="card-stage perk-card"
              style={{
                padding: "2rem",
                background: "#12141C",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "10px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{perk.icon}</div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "1.2rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                  color: "#FFFFFF",
                  marginBottom: "0.6rem",
                }}
              >
                {perk.title}
              </h3>
              <p className="body-copy" style={{ fontSize: "0.88rem", color: "#CBD5E1", lineHeight: 1.6, margin: 0 }}>
                {perk.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <WaveformDivider />

      {/* ─── EVALUATION RUBRIC & SCORING ─────────────────────────────────── */}
      <section
        style={{
          padding: "6rem 2.5rem",
          background: "var(--bg)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span className="hud-badge red">TRANSPARENT ADJUDICATION</span>
            <h2
              className="display-section"
              style={{
                fontSize: "clamp(1.75rem, 3.2vw, 2.6rem)",
                color: "var(--bone)",
                marginTop: "0.5rem",
              }}
            >
              How Bands Are <span style={{ color: "var(--red)" }}>Scored</span>
            </h2>
            <p className="body-copy" style={{ maxWidth: "600px", margin: "0.75rem auto 0", color: "#CBD5E1" }}>
              Every performance is evaluated against a weighted four-pillar rubric by industry veterans and real-time acoustic decibel telemetry.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1.5rem",
            }}
            className="rubric-grid"
          >
            {scoringRubric.map((item, idx) => (
              <div
                key={idx}
                className="card-stage"
                style={{
                  padding: "2rem 1.5rem",
                  background: "#12141C",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "8px",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: 900,
                    fontSize: "2.2rem",
                    color: "var(--red)",
                    display: "block",
                    marginBottom: "0.5rem",
                    lineHeight: 1,
                  }}
                >
                  {item.weight}
                </span>
                <h4
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: "1.1rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: "#FFFFFF",
                    marginBottom: "0.6rem",
                  }}
                >
                  {item.title}
                </h4>
                <p className="body-copy" style={{ fontSize: "0.85rem", color: "#CBD5E1", lineHeight: 1.55, margin: 0 }}>
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VALUES & ETHOS ──────────────────────────────────────────────── */}
      <section
        className="values-section"
        style={{
          padding: "6rem 2.5rem",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span className="hud-badge red">CORE PRINCIPLES</span>
          <h2
            className="display-section"
            style={{
              fontSize: "clamp(1.75rem, 3.2vw, 2.6rem)",
              color: "var(--bone)",
              marginTop: "0.5rem",
            }}
          >
            Our Unshakable <span style={{ color: "var(--red)" }}>Commitments</span>
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "2rem",
          }}
          className="values-grid"
        >
          {values.map((v) => (
            <div
              key={v.title}
              className="card-stage value-card"
              style={{
                padding: "2.5rem",
                background: "#12141C",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "10px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
              }}
            >
              <p style={{ fontSize: "1.8rem", marginBottom: "0.85rem" }}>{v.icon}</p>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "1.3rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                  color: "#FFFFFF",
                  marginBottom: "0.75rem",
                }}
              >
                {v.title}
              </h3>
              <p className="body-copy" style={{ fontSize: "0.92rem", color: "#CBD5E1", lineHeight: 1.6, margin: 0 }}>
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HYDERABAD HERITAGE SECTION ──────────────────────────────────── */}
      <section
        className="hyderabad-section"
        style={{
          position: "relative",
          minHeight: "50vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Image
          src="/images/hyderabad.jpg"
          alt="Hyderabad Skyline"
          fill
          style={{ objectFit: "cover", opacity: 0.32, filter: "saturate(0.7) contrast(1.1)" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(7,8,10,0.96) 45%, rgba(7,8,10,0.65) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "4rem 2.5rem",
            maxWidth: "1280px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          <span className="hud-badge red">SONIC HERITAGE</span>
          <h2
            className="display-hero"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)", color: "var(--bone)", maxWidth: "640px", marginTop: "0.75rem" }}
          >
            Born in <span style={{ color: "var(--red)" }}>Hyderabad</span>
          </h2>
          <p className="body-copy" style={{ maxWidth: "520px", marginTop: "1rem", fontSize: "1rem", color: "#CBD5E1" }}>
            Hyderabad has always been the underground heartbeat of Indian rock. From legendary college fests to packed clubs in Jubilee Hills, the passion is unmatched. RITHMOS gives this city the permanent stadium festival it has deserved for generations.
          </p>
        </div>
      </section>

      <WaveformDivider />

      {/* ─── FINAL CTA ───────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "6rem 2.5rem",
          textAlign: "center",
          background: "var(--surface)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <span className="hud-badge red">REGISTRATIONS ACTIVE</span>
        <h2
          className="display-section"
          style={{
            fontSize: "clamp(1.85rem, 4vw, 3rem)",
            color: "var(--bone)",
            marginTop: "0.75rem",
            marginBottom: "1.5rem",
          }}
        >
          Your Band&apos;s Story Starts <span style={{ color: "var(--red)" }}>Here</span>
        </h2>
        <p className="body-copy" style={{ maxWidth: "540px", margin: "0 auto 2.5rem", color: "#CBD5E1" }}>
          Slots are strictly limited to 48 bands for Season One. No registration fees. Submit your audio samples and claim your stage.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/contact" className="btn-primary">Register Your Band (Free) →</Link>
          <Link href="/competition" className="btn-outline">View Tournament Bracket</Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 1024px) {
          .metrics-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .perks-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .rubric-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .about-split-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .stages-grid { grid-template-columns: 1fr !important; }
          .values-grid { grid-template-columns: 1fr !important; }
          .perks-grid { grid-template-columns: 1fr !important; }
          .rubric-grid { grid-template-columns: 1fr !important; }
          .metrics-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
