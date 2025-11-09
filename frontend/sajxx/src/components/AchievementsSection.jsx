'use client';

import { useEffect, useRef, useState } from "react";
import Section from "@/components/Section";

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function AchievementCard({ achievement, index }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
      style={{ 
        animationDelay: isVisible ? `${index * 100}ms` : '0ms',
      }}
    >
      {/* Timeline connector */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-purple-500 to-transparent md:hidden"></div>
      
      <div className="relative glass rounded-2xl p-6 ml-6 md:ml-0 border border-white/10 hover:border-blue-500/30 transition-all duration-300 card-hover">
        {/* Timeline dot */}
        <div className="absolute -left-9 top-6 w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-4 border-slate-950 md:hidden group-hover:scale-125 transition-transform"></div>
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-semibold text-purple-300 uppercase tracking-wider">
              {achievement.category || "Achievement"}
            </span>
          </div>
          
          {formatDate(achievement.date) && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(achievement.date)}
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
          {achievement.title}
        </h3>

        {/* Description */}
        {achievement.description && (
          <p className="text-slate-300 leading-relaxed mb-4">
            {achievement.description}
          </p>
        )}

        {/* Issued By */}
        {achievement.issuedBy && (
          <div className="flex items-center gap-2 mb-4 text-sm">
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="font-medium text-blue-300">{achievement.issuedBy}</span>
          </div>
        )}

        {/* Link */}
        {achievement.link && (
          <a
            href={achievement.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass border border-blue-500/30 text-sm font-medium text-blue-300 hover:text-white hover:bg-blue-500/10 transition-all group/link"
          >
            View Credential
            <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

export default function AchievementsSection({ achievements }) {
  return (
    <Section
      id="achievements"
      eyebrow="Recognition"
      title="Achievements & Milestones"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {achievements?.length ? (
          achievements.map((item, index) => (
            <AchievementCard
              key={item._id ?? item.title}
              achievement={item}
              index={index}
            />
          ))
        ) : (
          <div className="col-span-full glass rounded-2xl p-12 text-center border border-white/10">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <p className="text-slate-400 text-lg">
              🏆 The trophy shelf is being polished... Big achievements are brewing! Stay tuned! ✨
            </p>
          </div>
        )}
      </div>
    </Section>
  );
}
