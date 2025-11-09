'use client';

import { useEffect, useRef, useState } from "react";
import Section from "@/components/Section";

export default function AboutSection({ profile }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Section
      ref={sectionRef}
      id="about"
      eyebrow="About Me"
      title="My Story & Mission"
      className="text-left"
    >
      <div className={`space-y-6 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
        <div className="relative">
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed pl-6">
            {profile?.about ||
              "Use the admin dashboard to add a compelling summary that highlights your mission, values, and specialties. Share your journey, what drives you, and what makes your approach unique."}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 pt-8">
          {profile?.available !== undefined && (
            <div className="glass rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-3 h-3 rounded-full ${profile.available ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                <h3 className="text-sm uppercase tracking-wider text-slate-400">Current Status</h3>
              </div>
              <p className="text-2xl font-bold text-white">
                {profile.available ? "Open to Work" : "Currently Engaged"}
              </p>
              <p className="text-sm text-slate-400 mt-2">
                {profile.available ? "Available for new opportunities" : "Working on exciting projects. Feel free to connect!"}
              </p>
            </div>
          )}

        </div>
      </div>
    </Section>
  );
}
