'use client';

import { useEffect, useRef, useState } from "react";
import Section from "@/components/Section";

function ApproachCard({ approach, index }) {
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
      className={`glass rounded-2xl p-8 border border-white/10 hover:border-blue-500/30 transition-all duration-300 card-hover ${
        isVisible ? 'animate-fadeInUp' : 'opacity-0'
      }`}
      style={{ animationDelay: isVisible ? `${index * 150}ms` : '0ms' }}
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
          {index + 1}
        </div>
        <h3 className="text-2xl font-bold text-white">
          {approach.title}
        </h3>
      </div>

      {approach.points?.length > 0 && (
        <div className="space-y-4">
          {approach.points.map((point, i) => (
            <div key={i} className="pl-4 border-l-2 border-blue-500/30">
              <p className="text-sm font-semibold text-white mb-1">{point.heading}</p>
              <p className="text-sm text-slate-400 leading-relaxed">{point.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EngineeringApproachSection({ approaches }) {
  if (!approaches?.length) return null;

  return (
    <Section id="engineering" eyebrow="How I Build" title="Engineering Approach">
      <div className="grid gap-8 md:grid-cols-2">
        {approaches.map((approach, index) => (
          <ApproachCard
            key={approach._id ?? approach.title}
            approach={approach}
            index={index}
          />
        ))}
      </div>
    </Section>
  );
}
