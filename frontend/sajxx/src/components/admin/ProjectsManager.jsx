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

  const handleSubmit = (event) => {
    event.preventDefault();
    startTransition(async () => {
      try {
        if (editingId) {
          await api.updateProject(editingId, {
            ...formState,
            technologies: formState.technologies?.split?.(",") ?? [],
          });
          setStatus({ type: "success", message: "Project updated" });
        } else {
          await api.createProject({
            ...formState,
            technologies: formState.technologies?.split?.(",") ?? [],
          });
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
          />
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
              <p className="text-xs text-slate-400">{project.category}</p>
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
