'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

const sections = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
];

export default function Header() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const observed = new Set();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -55% 0px",
        threshold: [0.1, 0.5, 1],
      }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el && !observed.has(id)) {
        observer.observe(el);
        observed.add(id);
      }
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const closeOnResize = () => setIsMenuOpen(false);
    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 backdrop-blur border-b border-slate-800/60 bg-slate-950/70">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="#hero" className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-200">
          Sajxx
        </Link>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 text-slate-200 hover:border-slate-500 hover:text-white lg:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <span className="sr-only">Menu</span>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
        <div
          className={`${
            isMenuOpen
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0 lg:max-h-full lg:opacity-100"
          } overflow-hidden rounded-2xl border border-slate-700/40 bg-slate-900/80 shadow-lg transition-all duration-300 lg:flex lg:items-center lg:border-none lg:bg-transparent lg:opacity-100 lg:shadow-none`}
        >
          <ul className="flex w-full flex-col gap-2 px-4 py-4 text-sm text-slate-300 lg:flex-row lg:items-center lg:gap-6 lg:px-0 lg:py-0">
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <li key={section.id}>
                  <Link
                    href={`#${section.id}`}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 transition-colors ${
                      isActive
                        ? "bg-blue-500/30 text-white"
                        : "hover:text-white"
                    }`}
                    onClick={() => {
                      setIsMenuOpen(false);
                      setActiveSection(section.id);
                    }}
                  >
                    <span className="h-2 w-2 rounded-full bg-blue-400 opacity-80" hidden={!isActive} />
                    {section.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
}
