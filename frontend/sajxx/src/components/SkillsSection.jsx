'use client';

import { useEffect, useRef, useState } from "react";
import Section from "@/components/Section";

function groupByCategory(skills) {
  return skills.reduce((acc, skill) => {
    const category = skill.category ?? "general";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});
}

function ExpertiseCard({ category, skills, index }) {
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
        isVisible ? 'animate-scaleIn' : 'opacity-0'
      }`}
      style={{ 
        animationDelay: isVisible ? `${index * 150}ms` : '0ms',
      }}
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white capitalize">
          {category}
        </h3>
      </div>

      <p className="text-slate-400 mb-6 leading-relaxed">
        {getCategoryDescription(category)}
      </p>

      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Tech Stack:</h4>
        <div className="flex flex-wrap gap-2">
          {skills
            .sort((a, b) => a.order - b.order)
            .map((skill) => (
              <div
                key={skill._id ?? skill.name}
                className="group relative"
              >
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800 transition-all">
                  {skill.icon && (
                    <i
                      className={`${skill.icon} text-lg text-blue-400`}
                      aria-hidden="true"
                    />
                  )}
                  <span className="text-sm font-medium text-slate-200 group-hover:text-white">
                    {skill.name}
                  </span>
                  {skill.proficiency && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {skill.proficiency.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default function SkillsSection({ skills }) {
  const grouped = groupByCategory(skills ?? []);
  const categories = Object.keys(grouped);

  return (
    <Section id="expertise" eyebrow="My Expertise" title="What I Do Best">
      {categories.length ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <ExpertiseCard
              key={category}
              category={category}
              skills={grouped[category]}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl p-12 text-center border border-white/10">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="text-slate-400 text-lg">
            Add skills via the admin dashboard to highlight your expertise and technical strengths.
          </p>
        </div>
      )}
    </Section>
  );
}

function getCategoryDescription(category) {
  const descriptions = {
    frontend: "Building responsive and interactive user interfaces with modern frameworks and best practices.",
    backend: "Developing robust server-side applications with scalable architecture and secure APIs.",
    database: "Designing and managing efficient database systems for optimal data storage and retrieval.",
    devops: "Automating deployment pipelines and maintaining cloud infrastructure for seamless operations.",
    tools: "Leveraging industry-standard tools and technologies to enhance development workflow.",
    general: "A diverse set of technical skills covering various aspects of software development.",
  };
  return descriptions[category.toLowerCase()] || descriptions.general;
}
