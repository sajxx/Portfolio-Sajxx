'use client';

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";

const allSections = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "expertise", label: "Expertise" },
  { id: "projects", label: "Projects" },
  { id: "engineering", label: "Engineering" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
];

export default function Header() {
  const [visibleSections, setVisibleSections] = useState(allSections);
  const [activeSection, setActiveSection] = useState("hero");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isClickScrolling = useRef(false);
  const scrollTimeout = useRef(null);

  // Detect which sections actually exist in the DOM
  const detectSections = useCallback(() => {
    const present = allSections.filter(({ id }) => document.getElementById(id));
    setVisibleSections((prev) => {
      if (prev.length === present.length && prev.every((s, i) => s.id === present[i]?.id)) {
        return prev; // no change
      }
      return present;
    });
  }, []);

  useEffect(() => {
    // Initial detection after hydration
    detectSections();

    // Re-detect on DOM mutations (sections may mount/unmount asynchronously)
    const observer = new MutationObserver(detectSections);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [detectSections]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Only update active section if we're not in the middle of a click-scroll
        if (isClickScrolling.current) return;

        // Find the entry with the highest intersection ratio
        let maxEntry = null;
        let maxRatio = 0;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            maxEntry = entry;
          }
        });

        if (maxEntry) {
          setActiveSection(maxEntry.target.id);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    visibleSections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [visibleSections]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const closeOnResize = () => setIsMenuOpen(false);
    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, [isMenuOpen]);

  const handleNavClick = (sectionId) => {
    setIsMenuOpen(false);
    setActiveSection(sectionId);
    
    // Disable observer updates during click-scroll
    isClickScrolling.current = true;
    
    // Clear any existing timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    
    // Re-enable observer after scroll animation completes (typically ~1s for smooth scroll)
    scrollTimeout.current = setTimeout(() => {
      isClickScrolling.current = false;
    }, 1200);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'glass border-b border-white/10 shadow-lg py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6">
        <Link 
          href="#hero" 
          className="group relative text-lg font-bold tracking-wider text-white"
        >
          <span className="relative z-10">SAJIN SANTHOSH</span>
          <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></span>
        </Link>
        
        <button
          type="button"
          className="relative flex h-11 w-11 items-center justify-center rounded-xl glass text-white hover:bg-white/10 transition-all lg:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-1.5">
            <span className={`block h-0.5 w-5 bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block h-0.5 w-5 bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block h-0.5 w-5 bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>

        <div
          className={`absolute top-full left-0 right-0 mt-2 mx-4 lg:relative lg:top-auto lg:left-auto lg:right-auto lg:mx-0 lg:mt-0 ${
            isMenuOpen
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0 lg:max-h-full lg:opacity-100"
          } overflow-hidden transition-all duration-300`}
        >
          <ul className="glass rounded-2xl p-4 shadow-2xl lg:flex lg:items-center lg:gap-2 lg:rounded-full lg:bg-transparent lg:p-0 lg:shadow-none">
            {visibleSections.map((section, index) => {
              const isActive = activeSection === section.id;
              return (
                <li key={section.id} style={{ animationDelay: `${index * 50}ms` }}>
                  <Link
                    href={`#${section.id}`}
                    className={`block relative px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "text-white"
                        : "text-slate-300 hover:text-white"
                    }`}
                    onClick={() => handleNavClick(section.id)}
                  >
                    {isActive && (
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></span>
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>}
                      {section.label}
                    </span>
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
