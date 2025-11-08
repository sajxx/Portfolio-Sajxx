'use client';

import { useEffect, useRef, useState } from "react";
import Section from "@/components/Section";
import Button from "@/components/Button";
import ShimmerCard from "@/components/skeletons/ShimmerCard";

function ProjectCard({ project, index }) {
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
      className={`group relative ${isVisible ? 'animate-scaleIn' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500"></div>
      
      <div className="relative glass rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300 h-full flex flex-col">
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-semibold text-blue-300 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            {project.category || "Project"}
          </span>
          
          {/* Project icon/number */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-slate-400 text-xs font-bold">
            {(index + 1).toString().padStart(2, '0')}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-slate-300 mb-6 leading-relaxed flex-grow">
          {project.description}
        </p>

        {/* Technologies */}
        {project.technologies?.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">Technologies:</h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs font-medium text-slate-300 hover:border-blue-500/50 hover:text-white transition-all"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-800">
          {project.liveLink && (
            <Button
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 text-sm flex-1 min-w-[120px]"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Live Demo
              </span>
            </Button>
          )}
          {project.githubLink && (
            <Button
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              className="px-5 py-2.5 text-sm flex-1 min-w-[120px]"
            >
              <span className="flex items-center justify-center gap-2">
                <i className="fab fa-github"></i>
                GitHub
              </span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection({ projects, isLoading }) {
  return (
    <Section
      id="projects"
      eyebrow="My Work"
      title="Featured Projects"
      className="space-y-10"
    >
      <p className="text-lg text-slate-400 max-w-3xl">
        A collection of projects showcasing my expertise in web development, 
        from concept to deployment. Each project represents a unique challenge 
        and learning opportunity.
      </p>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <ShimmerCard key={`project-skeleton-${index}`} className="h-96" />
          ))
        ) : projects?.length ? (
          projects.map((project, index) => (
            <ProjectCard 
              key={project._id ?? project.title} 
              project={project} 
              index={index}
            />
          ))
        ) : (
          <div className="col-span-full glass rounded-2xl p-12 text-center border border-white/10">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-400 text-lg">
              No projects yet. Head to the admin area to add your first showcase.
            </p>
          </div>
        )}
      </div>
    </Section>
  );
}
