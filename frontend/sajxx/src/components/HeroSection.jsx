'use client';

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import Image from "next/image";

export default function HeroSection({ profile }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-24 pb-16">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 w-full">
        <div className={`flex flex-col items-center text-center space-y-12 ${mounted ? 'animate-fadeInUp' : 'opacity-0'}`}>
          
          {/* Profile Image */}
          <div className="relative group">
            {/* Animated glow rings */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-30 blur-2xl group-hover:opacity-50 transition-opacity duration-500 animate-pulse"></div>
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-50 blur-xl animate-spin-slow"></div>
            
            {/* Image container */}
            <div className="relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
              <Image
                src={profile?.profileImage || "/Portfolio-Sajxx-Profile.png"}
                alt={profile?.name || "Sajin"}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Status indicator */}
            {profile?.available !== undefined && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/20 backdrop-blur-xl">
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${profile.available ? 'bg-green-400' : 'bg-yellow-400'} opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${profile.available ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                </span>
                <span className="text-sm font-medium text-white">
                  {profile.available ? "Available for work" : "Currently busy"}
                </span>
              </div>
            )}
          </div>

          {/* Name and Role */}
          <div className="space-y-4 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-blue-500/30 mb-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              <span className="text-sm uppercase tracking-wider text-blue-300 font-semibold">
                {profile?.role || "Full Stack Developer"}
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
              <span className="gradient-text animate-gradient">
                {profile?.name || "Your Name"}
              </span>
            </h1>

            <p className="text-xl md:text-2xl lg:text-3xl text-slate-300 leading-relaxed max-w-3xl mx-auto font-light">
              {profile?.headline || "Crafting beautiful digital experiences with modern web technologies."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button 
              href="#projects" 
              className="px-8 py-4 text-lg group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                View My Work
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Button>

            <Button
              href="#contact"
              variant="secondary"
              className="px-8 py-4 text-lg group"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Get In Touch
              </span>
            </Button>

            {profile?.resumeUrl && (
              <Button
                as="a"
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                className="px-8 py-4 text-lg group"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Resume
                </span>
              </Button>
            )}
          </div>

          {/* Social Links */}
          {profile?.socials?.length > 0 && (
            <div className="flex items-center gap-4 pt-4">
              <span className="text-sm text-slate-400">Connect with me:</span>
              <div className="flex gap-3">
                {profile.socials.map((social, index) => (
                  <a
                    key={`${social.label}-${social.url}`}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-12 items-center justify-center rounded-full glass border border-white/10 text-slate-300 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 hover:scale-110 transition-all duration-300"
                    title={social.label}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <i className={getSocialIcon(social.label)} aria-hidden="true"></i>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 max-w-4xl mx-auto w-full">
            <div className="glass rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all group">
              <div className="text-4xl font-bold gradient-text mb-2">5+</div>
              <div className="text-sm text-slate-400">Years Experience</div>
            </div>
            <div className="glass rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all group">
              <div className="text-4xl font-bold gradient-text mb-2">50+</div>
              <div className="text-sm text-slate-400">Projects Completed</div>
            </div>
            <div className="glass rounded-2xl p-6 border border-white/10 hover:border-pink-500/30 transition-all group">
              <div className="text-4xl font-bold gradient-text mb-2">30+</div>
              <div className="text-sm text-slate-400">Happy Clients</div>
            </div>
            <div className="glass rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all group">
              <div className="text-4xl font-bold gradient-text mb-2">15+</div>
              <div className="text-sm text-slate-400">Awards Won</div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}

function getSocialIcon(label) {
  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes('github')) return 'fab fa-github';
  if (lowerLabel.includes('linkedin')) return 'fab fa-linkedin';
  if (lowerLabel.includes('twitter') || lowerLabel.includes('x')) return 'fab fa-twitter';
  if (lowerLabel.includes('instagram')) return 'fab fa-instagram';
  if (lowerLabel.includes('facebook')) return 'fab fa-facebook';
  return 'fas fa-link';
}
