'use client';

import { useEffect, useMemo, useState, useTransition } from "react";

import Card from "@/components/Card";
import Button from "@/components/Button";
import { api } from "@/lib/axios";

const blankProject = {
  title: "",
  description: "",
  githubLink: "",
  liveLink: "",
  category: "web",
  featured: false,
  technologies: "",
  images: "",
  problem: "",
  architectureFrontend: "",
  architectureBackend: "",
  architectureAuthentication: "",
  architectureDatabase: "",
  architectureDeployment: "",
  engineeringDecisions: "",
  scalingConsiderations: "",
  metrics: "",
};

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [formState, setFormState] = useState(blankProject);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState(null);
  const [isPending, startTransition] = useTransition();

  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => a.order - b.order || a.createdAt.localeCompare(b.createdAt)),
    [projects]
  );

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects", error);
    }
  };

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setFormState(blankProject);
    setEditingId(null);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const buildPayload = () => {
    const payload = {
      title: formState.title,
      description: formState.description,
      githubLink: formState.githubLink,
      liveLink: formState.liveLink,
      category: formState.category,
      featured: formState.featured,
      technologies: formState.technologies?.split?.(",") ?? [],
      images: formState.images?.split?.(",").map(url => url.trim()).filter(Boolean) ?? [],
      problem: formState.problem || undefined,
      scalingConsiderations: formState.scalingConsiderations
        ? formState.scalingConsiderations.split("\n").map(s => s.trim()).filter(Boolean)
        : [],
    };

    // Build architecture object (only include non-empty values)
    const arch = {};
    if (formState.architectureFrontend) arch.frontend = formState.architectureFrontend;
    if (formState.architectureBackend) arch.backend = formState.architectureBackend;
    if (formState.architectureAuthentication) arch.authentication = formState.architectureAuthentication;
    if (formState.architectureDatabase) arch.database = formState.architectureDatabase;
    if (formState.architectureDeployment) arch.deployment = formState.architectureDeployment;
    if (Object.keys(arch).length) payload.architecture = arch;

    // Parse engineering decisions (each line: "Title | Description")
    if (formState.engineeringDecisions) {
      payload.engineeringDecisions = formState.engineeringDecisions
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => {
          const [title, ...rest] = line.split("|");
          return { title: title.trim(), description: rest.join("|").trim() };
        });
    }

    // Parse metrics (each line: "Label | Value")
    if (formState.metrics) {
      payload.metrics = formState.metrics
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => {
          const [label, ...rest] = line.split("|");
          return { label: label.trim(), value: rest.join("|").trim() };
        });
    }

    return payload;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    startTransition(async () => {
      try {
        const payload = buildPayload();
        if (editingId) {
          await api.updateProject(editingId, payload);
          setStatus({ type: "success", message: "Project updated" });
        } else {
          await api.createProject(payload);
          setStatus({ type: "success", message: "Project created" });
        }
        resetForm();
        await loadProjects();
      } catch (error) {
        setStatus({
          type: "error",
          message: error?.response?.data?.message ?? "Unable to save project",
        });
      }
    });
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setFormState({
      title: project.title ?? "",
      description: project.description ?? "",
      githubLink: project.githubLink ?? "",
      liveLink: project.liveLink ?? "",
      category: project.category ?? "web",
      featured: Boolean(project.featured),
      technologies: (project.technologies ?? []).join(", "),
      images: (project.images ?? []).join(", "),
      problem: project.problem ?? "",
      architectureFrontend: project.architecture?.frontend ?? "",
      architectureBackend: project.architecture?.backend ?? "",
      architectureAuthentication: project.architecture?.authentication ?? "",
      architectureDatabase: project.architecture?.database ?? "",
      architectureDeployment: project.architecture?.deployment ?? "",
      engineeringDecisions: (project.engineeringDecisions ?? [])
        .map(d => `${d.title} | ${d.description}`)
        .join("\n"),
      scalingConsiderations: (project.scalingConsiderations ?? []).join("\n"),
      metrics: (project.metrics ?? [])
        .map(m => `${m.label} | ${m.value}`)
        .join("\n"),
    });
  };

  const handleDelete = (id) => {
    startTransition(async () => {
      try {
        await api.deleteProject(id);
        setProjects((prev) => prev.filter((project) => project._id !== id));
      } catch (error) {
        setStatus({
          type: "error",
          message: error?.response?.data?.message ?? "Unable to delete project",
        });
      }
    });
  };

  return (
    <Card className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Projects</h2>
          <p className="text-sm text-slate-400">
            Create, edit, or remove portfolio projects.
          </p>
        </div>
        {status && (
          <span
            className={`text-sm ${
              status.type === "success" ? "text-emerald-300" : "text-rose-300"
            }`}
          >
            {status.message}
          </span>
        )}
      </header>

      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <label className="flex flex-col text-sm text-slate-200">
          Title
          <input
            name="title"
            required
            value={formState.title}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
          />
        </label>
        <label className="flex flex-col text-sm text-slate-200">
          Category
          <select
            name="category"
            value={formState.category}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
          >
            <option value="web">Web</option>
            <option value="mobile">Mobile</option>
            <option value="desktop">Desktop</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label className="md:col-span-2 flex flex-col text-sm text-slate-200">
          Short description
          <textarea
            name="description"
            rows={3}
            value={formState.description}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
          />
        </label>
        <label className="md:col-span-2 flex flex-col text-sm text-slate-200">
          Technologies (comma separated)
          <input
            name="technologies"
            value={formState.technologies ?? ""}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
            placeholder="React, Node.js, MongoDB"
          />
        </label>
        <label className="md:col-span-2 flex flex-col text-sm text-slate-200">
          Image URLs (comma separated)
          <textarea
            name="images"
            rows={3}
            value={formState.images ?? ""}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          />
          <span className="text-xs text-slate-500 mt-1">
            Enter multiple image URLs separated by commas. Images will auto-scroll in the project card.
          </span>
        </label>
        <label className="flex flex-col text-sm text-slate-200">
          GitHub URL
          <input
            name="githubLink"
            value={formState.githubLink}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
          />
        </label>
        <label className="flex flex-col text-sm text-slate-200">
          Live URL
          <input
            name="liveLink"
            value={formState.liveLink}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-200">
          <input
            type="checkbox"
            name="featured"
            checked={formState.featured}
            onChange={handleChange}
            className="h-4 w-4 rounded border-slate-500 bg-slate-900"
          />
          Featured
        </label>

        {/* ─── Engineering Fields ─── */}
        <div className="md:col-span-2 border-t border-slate-800 pt-4 mt-2">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">Technical Details (optional)</p>
        </div>

        <label className="md:col-span-2 flex flex-col text-sm text-slate-200">
          Problem Statement
          <textarea
            name="problem"
            rows={2}
            value={formState.problem}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
            placeholder="What problem does this project solve?"
          />
        </label>

        <label className="flex flex-col text-sm text-slate-200">
          Architecture – Frontend
          <input
            name="architectureFrontend"
            value={formState.architectureFrontend}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
            placeholder="e.g. Next.js + Tailwind"
          />
        </label>
        <label className="flex flex-col text-sm text-slate-200">
          Architecture – Backend
          <input
            name="architectureBackend"
            value={formState.architectureBackend}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
            placeholder="e.g. Express + Node.js"
          />
        </label>
        <label className="flex flex-col text-sm text-slate-200">
          Architecture – Auth
          <input
            name="architectureAuthentication"
            value={formState.architectureAuthentication}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
            placeholder="e.g. JWT + bcrypt"
          />
        </label>
        <label className="flex flex-col text-sm text-slate-200">
          Architecture – Database
          <input
            name="architectureDatabase"
            value={formState.architectureDatabase}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
            placeholder="e.g. MongoDB Atlas"
          />
        </label>
        <label className="md:col-span-2 flex flex-col text-sm text-slate-200">
          Architecture – Deployment
          <input
            name="architectureDeployment"
            value={formState.architectureDeployment}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
            placeholder="e.g. Docker + Render"
          />
        </label>

        <label className="md:col-span-2 flex flex-col text-sm text-slate-200">
          Engineering Decisions (one per line: Title | Description)
          <textarea
            name="engineeringDecisions"
            rows={3}
            value={formState.engineeringDecisions}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white font-mono text-xs"
            placeholder={"Chose SSR over SPA | Faster initial load for SEO\nUsed Redis caching | Reduced DB queries by 80%"}
          />
          <span className="text-xs text-slate-500 mt-1">Format: Title | Description — one decision per line</span>
        </label>

        <label className="md:col-span-2 flex flex-col text-sm text-slate-200">
          Scaling Considerations (one per line)
          <textarea
            name="scalingConsiderations"
            rows={3}
            value={formState.scalingConsiderations}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white font-mono text-xs"
            placeholder={"Horizontal scaling via containerized microservices\nDatabase sharding for multi-tenant support"}
          />
        </label>

        <label className="md:col-span-2 flex flex-col text-sm text-slate-200">
          Metrics (one per line: Label | Value)
          <textarea
            name="metrics"
            rows={3}
            value={formState.metrics}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white font-mono text-xs"
            placeholder={"Lighthouse Score | 98\nAPI Response Time | <200ms"}
          />
          <span className="text-xs text-slate-500 mt-1">Format: Label | Value — one metric per line</span>
        </label>

        <div className="flex items-center gap-3">
          <Button as="button" type="submit" disabled={isPending} className="px-6 py-3">
            {isPending ? "Saving..." : editingId ? "Update" : "Create"}
          </Button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-slate-400 hover:text-slate-200"
            >
              Cancel editing
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {sortedProjects.map((project) => (
          <div
            key={project._id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3"
          >
            <div>
              <p className="text-sm font-semibold text-white">{project.title}</p>
              <p className="text-xs text-slate-400">
                {project.category}
                {project.images?.length > 0 && (
                  <span className="ml-2 text-blue-400">
                    • {project.images.length} image{project.images.length !== 1 ? 's' : ''}
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-2 text-sm">
              <button
                className="rounded-full border border-slate-700 px-3 py-1 text-slate-200 hover:border-blue-400 hover:text-blue-200"
                type="button"
                onClick={() => handleEdit(project)}
              >
                Edit
              </button>
              <button
                className="rounded-full border border-rose-600 px-3 py-1 text-rose-200 hover:bg-rose-600/20"
                type="button"
                onClick={() => handleDelete(project._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {!sortedProjects.length && (
          <p className="text-sm text-slate-400">No projects yet. Add your first project above.</p>
        )}
      </div>
    </Card>
  );
}
