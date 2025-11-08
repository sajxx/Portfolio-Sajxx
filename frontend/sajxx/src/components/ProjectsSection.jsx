import Section from "@/components/Section";
import Card from "@/components/Card";
import Button from "@/components/Button";
import ShimmerCard from "@/components/skeletons/ShimmerCard";

function ProjectCard({ project }) {
  return (
    <Card className="flex flex-col gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-blue-300">
          {project.category}
        </p>
        <h3 className="mt-2 text-2xl font-semibold text-white">
          {project.title}
        </h3>
      </div>
      <p className="text-sm text-slate-300">{project.description}</p>
      {project.technologies?.length ? (
        <ul className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
          {project.technologies.map((tech) => (
            <li key={tech} className="rounded-full bg-slate-800/80 px-3 py-1">
              {tech}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-auto flex flex-wrap gap-3 pt-2 text-sm">
        {project.githubLink && (
          <Button
            href={project.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            className="px-4 py-2"
          >
            GitHub
          </Button>
        )}
        {project.liveLink && (
          <Button
            href={project.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2"
          >
            Live Demo
          </Button>
        )}
      </div>
    </Card>
  );
}

export default function ProjectsSection({ projects, isLoading }) {
  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Featured Work"
      className="space-y-10"
    >
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <ShimmerCard key={`project-skeleton-${index}`} className="h-56" />
          ))
        ) : projects?.length ? (
          projects.map((project) => (
            <ProjectCard key={project._id ?? project.title} project={project} />
          ))
        ) : (
          <Card className="col-span-full text-center text-slate-400">
            No projects yet. Head to the admin area to add your first showcase.
          </Card>
        )}
      </div>
    </Section>
  );
}
