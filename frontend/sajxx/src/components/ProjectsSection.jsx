'use client';

import { useEffect, useRef, useState } from "react";
import Section from "@/components/Section";
import Button from "@/components/Button";
import ShimmerCard from "@/components/skeletons/ShimmerCard";

function ProjectCard({ project, index }) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const cardRef = useRef(null);

  const hasTechnicalDetails =
    project.problem ||
    project.architecture ||
    (project.engineeringDecisions && project.engineeringDecisions.length > 0) ||
    (project.scalingConsiderations && project.scalingConsiderations.length > 0) ||
    (project.metrics && project.metrics.length > 0);

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

  // Auto-scroll through images
  useEffect(() => {
    if (!project.images || project.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [project.images]);

  const handlePrevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? project.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
  };

  const handleDotClick = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(idx);
  };

  return (
    <div
      ref={cardRef}
      className={`group relative ${isVisible ? 'animate-scaleIn' : 'opacity-0'}`}
      style={{ 
        animationDelay: isVisible ? `${index * 100}ms` : '0ms',
      }}
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500"></div>
      
      <div className="relative glass rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500/30 transition-all duration-300 h-full flex flex-col">
        {/* Image Carousel */}
        {project.images && project.images.length > 0 && (
          <div className="relative w-full h-48 bg-slate-900/50 overflow-hidden group/carousel">
            {/* Images */}
            <div className="relative w-full h-full">
              {project.images.map((image, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    idx === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${project.title} - Image ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {project.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-black/70"
                  aria-label="Previous image"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-black/70"
                  aria-label="Next image"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {project.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => handleDotClick(e, idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentImageIndex
                          ? 'bg-white w-6'
                          : 'bg-white/40 hover:bg-white/60'
                      }`}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Image Counter */}
            {project.images.length > 1 && (
              <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-xs text-white">
                {currentImageIndex + 1} / {project.images.length}
              </div>
            )}
          </div>
        )}

        <div className="p-6 flex flex-col flex-grow">
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

          {/* Technical Details Toggle */}
          {hasTechnicalDetails && (
            <div className="pt-4">
              <button
                onClick={() => setShowDetails((prev) => !prev)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass border border-white/10 text-sm font-medium text-slate-300 hover:text-white hover:border-blue-500/30 transition-all w-full justify-center"
              >
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {showDetails ? 'Hide' : 'View'} Technical Details
              </button>

              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  showDetails ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="space-y-5 border-t border-white/10 pt-4">
                  {/* Problem */}
                  {project.problem && (
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-blue-400 font-semibold mb-2">Problem</h4>
                      <p className="text-sm text-slate-300 leading-relaxed">{project.problem}</p>
                    </div>
                  )}

                  {/* Architecture */}
                  {project.architecture && (
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-blue-400 font-semibold mb-3">Architecture</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {Object.entries(project.architecture)
                          .filter(([, v]) => v)
                          .map(([key, value]) => (
                            <div key={key} className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
                              <span className="block text-xs font-semibold text-slate-400 uppercase mb-0.5">{key}</span>
                              <span className="block text-sm text-slate-200 break-words">{value}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Engineering Decisions */}
                  {project.engineeringDecisions?.length > 0 && (
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-blue-400 font-semibold mb-3">Engineering Decisions</h4>
                      <div className="space-y-3">
                        {project.engineeringDecisions.map((decision, i) => (
                          <div key={i} className="px-4 py-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                            <p className="text-sm font-semibold text-white mb-1">{decision.title}</p>
                            <p className="text-sm text-slate-400 leading-relaxed">{decision.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Scaling Considerations */}
                  {project.scalingConsiderations?.length > 0 && (
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-blue-400 font-semibold mb-3">Scaling Considerations</h4>
                      <ul className="space-y-2">
                        {project.scalingConsiderations.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Metrics */}
                  {project.metrics?.length > 0 && (
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-blue-400 font-semibold mb-3">Metrics</h4>
                      <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-3">
                        {project.metrics.map((metric, i) => (
                          <div key={i} className="text-center px-2 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 overflow-hidden">
                            <p className="text-base sm:text-lg font-bold gradient-text truncate">{metric.value}</p>
                            <p className="text-xs text-slate-400 mt-1 truncate">{metric.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection({ projects, isLoading }) {
  if (!isLoading && !projects?.length) return null;

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
        ) : (
          projects.map((project, index) => (
            <ProjectCard 
              key={project._id ?? project.title} 
              project={project} 
              index={index}
            />
          ))
        )}
      </div>
    </Section>
  );
}
