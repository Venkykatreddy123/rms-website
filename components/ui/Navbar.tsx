"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home", subtitle: "Arena Overview & Live Countdown", tag: "LIVE", icon: "⚡" },
  { href: "/about", label: "About", subtitle: "Mission, Rules & Festival Ethos", tag: "STORY", icon: "🏛️" },
  { href: "/competition", label: "Competition", subtitle: "Knockout Bracket & Scoring", tag: "BRACKET", icon: "🏆" },
  { href: "/partners", label: "Partners", subtitle: "Sponsors & Industry Alliance", tag: "ALLIANCE", icon: "🤝" },
  { href: "/contact", label: "Contact", subtitle: "Auditions, Press & Passes", tag: "CONNECT", icon: "📬" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll smoothly when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        ref={navRef}
        className="navbar-main"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled
            ? "rgba(7, 8, 10, 0.96)"
            : "rgba(0, 0, 0, 0.4)",
          backdropFilter: scrolled ? "blur(24px)" : "blur(14px)",
          WebkitBackdropFilter: scrolled ? "blur(24px)" : "blur(14px)",
          borderBottom: scrolled
            ? "1px solid rgba(255, 255, 255, 0.12)"
            : "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: scrolled
            ? "0 4px 24px rgba(0, 0, 0, 0.5)"
            : "none",
          transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Logo — Shifted right with marginLeft and increased size */}
        <Link
          href="/"
          className="navbar-logo-link"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
            position: "relative",
            zIndex: 1001,
            marginLeft: "1.25rem",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/rithmos-logo.png"
            alt="RITHMOS — Where Bands Rise"
            className="navbar-logo-img"
            style={{
              height: "72px",
              width: "auto",
              display: "block",
              filter: scrolled
                ? "drop-shadow(0 2px 10px rgba(0,0,0,0.5))"
                : "drop-shadow(0 2px 14px rgba(0,0,0,0.6)) brightness(1.15)",
              transition: "transform 0.25s ease, filter 0.35s ease",
            }}
          />
        </Link>

        {/* Desktop Nav Links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2.2rem",
          }}
          className="hidden-mobile"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link"
                style={{
                  color: isActive
                    ? "var(--red)"
                    : "#FFFFFF",
                  fontWeight: isActive ? 800 : 700,
                  fontSize: "0.95rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  transition: "color 0.25s ease",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA & Mobile Hamburger Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", position: "relative", zIndex: 1001, marginRight: "1rem" }}>
          <Link
            href="/contact"
            className="btn-primary nav-desktop-cta"
            style={{
              fontSize: "0.82rem",
              padding: "0.55rem 1.45rem",
              borderRadius: "24px",
              boxShadow: "0 4px 14px rgba(230, 20, 56, 0.4)",
            }}
          >
            Register Your Band
          </Link>

          {/* Compact Mobile CTA Soft Pill */}
          <Link
            href="/contact"
            className="nav-mobile-cta"
            style={{
              display: "none",
              background: "linear-gradient(135deg, #E61438, #FF244B)",
              color: "#FFFFFF",
              fontFamily: "var(--font-sub)",
              fontWeight: 700,
              fontSize: "0.82rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "0.45rem 0.95rem",
              borderRadius: "20px",
              textDecoration: "none",
              boxShadow: "0 3px 10px rgba(230, 20, 56, 0.4)",
              transition: "transform 0.15s ease",
            }}
          >
            Register
          </Link>

          {/* Morphing Hamburger Button with Soft Rounded Container */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-menu-btn"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            style={{
              background: menuOpen ? "rgba(230, 20, 56, 0.15)" : "rgba(255, 255, 255, 0.08)",
              border: menuOpen ? "1px solid rgba(230, 20, 56, 0.4)" : "1px solid rgba(255, 255, 255, 0.15)",
              cursor: "pointer",
              display: "none",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "4.5px",
              width: "40px",
              height: "40px",
              padding: "8px",
              borderRadius: "12px",
              transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <span
              style={{
                display: "block",
                width: "20px",
                height: "2px",
                background: menuOpen ? "var(--red)" : "#FFFFFF",
                borderRadius: "3px",
                transformOrigin: "center",
                transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
            <span
              style={{
                display: "block",
                width: "20px",
                height: "2px",
                background: menuOpen ? "var(--red)" : "#FFFFFF",
                borderRadius: "3px",
                opacity: menuOpen ? 0 : 1,
                transform: menuOpen ? "scale(0)" : "scale(1)",
                transition: "all 0.2s ease",
              }}
            />
            <span
              style={{
                display: "block",
                width: "20px",
                height: "2px",
                background: menuOpen ? "var(--red)" : "#FFFFFF",
                borderRadius: "3px",
                transformOrigin: "center",
                transform: menuOpen ? "translateY(-6.5px) rotate(-45deg)" : "none",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </button>
        </div>
      </nav>

      {/* ─── Ultra-Sleek Soft Mobile Menu Drawer ─────────────────────────── */}
      {menuOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            animation: "fadeInBackdrop 0.25s ease-out forwards",
          }}
        >
          <div
            className="mobile-drawer-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              maxHeight: "100vh",
              overflowY: "auto",
              background: "rgba(10, 12, 18, 0.98)",
              backdropFilter: "blur(32px)",
              WebkitBackdropFilter: "blur(32px)",
              borderBottomLeftRadius: "28px",
              borderBottomRightRadius: "28px",
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.8), 0 4px 20px rgba(230, 20, 56, 0.15)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              padding: "5.5rem 1.25rem 2rem 1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              animation: "drawerSlideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
          >
            {/* Top Soft Micro-Pills / Fast Jump Highlights */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "0.45rem",
                padding: "0.2rem 0",
              }}
            >
              {[
                { label: "BRACKET", icon: "🏆", href: "/competition" },
                { label: "ABOUT", icon: "🏛️", href: "/about" },
                { label: "CONTACT", icon: "📬", href: "/contact" },
                { label: "PARTNERS", icon: "🤝", href: "/partners" },
              ].map((chip) => (
                <Link
                  key={chip.label}
                  href={chip.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0.6rem 0.25rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "14px",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span style={{ fontSize: "1.1rem", marginBottom: "0.2rem" }}>{chip.icon}</span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.62rem",
                      fontWeight: 800,
                      color: "#FFFFFF",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {chip.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Soft Divider */}
            <div
              style={{
                height: "1px",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
              }}
            />

            {/* Primary Navigation Sections (Soft Rounded Cards with Subtitles) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.45rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 0.4rem 0.3rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.68rem",
                    color: "#94A3B8",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Main Navigation
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontSize: "0.65rem",
                    fontFamily: "var(--font-mono)",
                    color: "var(--red)",
                    fontWeight: 700,
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "var(--red)",
                      animation: "redPulse 1.2s infinite alternate",
                    }}
                  />
                  HYDERABAD 2026
                </span>
              </div>

              {navLinks.map((link, idx) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.75rem 1rem",
                      borderRadius: "16px",
                      background: isActive
                        ? "rgba(230, 20, 56, 0.15)"
                        : "rgba(255, 255, 255, 0.04)",
                      border: isActive
                        ? "1px solid rgba(230, 20, 56, 0.4)"
                        : "1px solid rgba(255, 255, 255, 0.08)",
                      textDecoration: "none",
                      transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                      <span
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: isActive ? "var(--red)" : "rgba(255, 255, 255, 0.08)",
                          color: "#FFFFFF",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.75rem",
                          fontWeight: 800,
                          flexShrink: 0,
                        }}
                      >
                        0{idx + 1}
                      </span>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 800,
                            fontSize: "1.32rem",
                            color: isActive ? "var(--red)" : "#FFFFFF",
                            letterSpacing: "0.03em",
                            lineHeight: 1.15,
                            textTransform: "uppercase",
                          }}
                        >
                          {link.label}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.72rem",
                            color: "#94A3B8",
                            marginTop: "1px",
                          }}
                        >
                          {link.subtitle}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {link.tag && (
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.6rem",
                            fontWeight: 800,
                            padding: "2px 7px",
                            borderRadius: "10px",
                            background: isActive
                              ? "rgba(230, 20, 56, 0.25)"
                              : "rgba(255, 255, 255, 0.08)",
                            color: isActive ? "#FF2E55" : "#CBD5E1",
                          }}
                        >
                          {link.tag}
                        </span>
                      )}
                      <span
                        style={{
                          color: isActive ? "var(--red)" : "#64748B",
                          fontSize: "1.1rem",
                          fontWeight: 700,
                        }}
                      >
                        ›
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Soft Festival Status Card */}
            <div
              style={{
                padding: "0.9rem 1.1rem",
                borderRadius: "18px",
                background: "linear-gradient(135deg, rgba(230, 20, 56, 0.05), rgba(184, 134, 11, 0.07))",
                border: "1px solid rgba(230, 20, 56, 0.12)",
                display: "flex",
                flexDirection: "column",
                gap: "0.35rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    color: "var(--red)",
                    letterSpacing: "0.08em",
                  }}
                >
                  ⚡ PRIZE POOL ₹15,00,000
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.65rem",
                    color: "#5A5D68",
                  }}
                >
                  16 BANDS · 3 ARENAS
                </span>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.75rem",
                  color: "#4B5563",
                  margin: 0,
                  lineHeight: 1.35,
                }}
              >
                Hyderabad’s premier live rock battle. No backing tracks. Raw talent only.
              </p>
            </div>

            {/* Bottom Primary Action */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="btn-primary"
                style={{
                  textAlign: "center",
                  padding: "0.85rem 1.5rem",
                  fontSize: "0.95rem",
                  width: "100%",
                  borderRadius: "28px",
                  background: "linear-gradient(135deg, #E61438 0%, #FF244B 100%)",
                  boxShadow: "0 8px 24px rgba(230, 20, 56, 0.32)",
                  textDecoration: "none",
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                }}
              >
                Register Your Band (Free) →
              </Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .navbar-main {
          padding: 0.75rem 3.5rem;
        }
        @media (max-width: 1024px) {
          .navbar-main {
            padding: 0.75rem 2rem !important;
          }
        }
        @media (max-width: 768px) {
          .navbar-main {
            padding: 0.6rem 1.25rem !important;
          }
          .hidden-mobile { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .nav-desktop-cta { display: none !important; }
          .nav-mobile-cta { display: inline-block !important; }
          .navbar-logo-img { height: 52px !important; }
          .navbar-logo-link { margin-left: 0.25rem !important; }
        }
        @keyframes fadeInBackdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes drawerSlideDown {
          from {
            opacity: 0;
            transform: translateY(-16px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes redPulse {
          from { opacity: 0.4; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1.15); }
        }
      `}</style>
    </>
  );
}
