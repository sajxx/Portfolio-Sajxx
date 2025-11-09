'use client';

import { useEffect, useMemo, useState, useTransition } from "react";

import Card from "@/components/Card";
import Button from "@/components/Button";
import { api } from "@/lib/axios";

const blankSkill = {
  name: "",
  proficiency: "advanced",
  category: "general",
  iconUrl: "",
  description: "",
};

export default function SkillsManager() {
  const [skills, setSkills] = useState([]);
  const [formState, setFormState] = useState(blankSkill);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState(null);
  const [isPending, startTransition] = useTransition();

  const loadSkills = async () => {
    try {
      const data = await api.getSkills();
      setSkills(data);
    } catch (error) {
      console.error("Failed to load skills", error);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const sortedSkills = useMemo(() => [...skills].sort((a, b) => a.order - b.order), [skills]);

  const resetForm = () => {
    setFormState(blankSkill);
    setEditingId(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formState.name) return;

    startTransition(async () => {
      try {
        if (editingId) {
          await api.updateSkill(editingId, formState);
          setStatus({ type: "success", message: "Skill updated" });
        } else {
          await api.createSkill(formState);
          setStatus({ type: "success", message: "Skill created" });
        }
        resetForm();
        await loadSkills();
      } catch (error) {
        setStatus({
          type: "error",
          message: error?.response?.data?.message ?? "Unable to save skill",
        });
      }
    });
  };

  const handleEdit = (skill) => {
    setEditingId(skill._id);
    setFormState((prev) => ({
      name: skill.name ?? "",
      proficiency: skill.proficiency ?? "advanced",
      category: skill.category ?? "general",
      iconUrl: skill.iconUrl ?? "",
      description: skill.description ?? "",
    }));
  };

  const handleDelete = (id) => {
    startTransition(async () => {
      try {
  await api.deleteSkill(id);
  setSkills((prev) => prev.filter((skill) => skill._id !== id));
      } catch (error) {
        setStatus({
          type: "error",
          message: error?.response?.data?.message ?? "Unable to delete skill",
        });
      }
    });
  };

  return (
    <Card className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Skills</h2>
          <p className="text-sm text-slate-400">Keep your skills up to date for the public profile.</p>
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
          Name
          <input
            required
            name="name"
            value={formState.name}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
          />
        </label>
        <label className="flex flex-col text-sm text-slate-200">
          Proficiency
          <select
            name="proficiency"
            value={formState.proficiency}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </label>
        <label className="flex flex-col text-sm text-slate-200">
          Category
          <input
            name="category"
            value={formState.category}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
          />
        </label>
        <label className="flex flex-col text-sm text-slate-200">
          Icon URL (optional)
          <input
            name="iconUrl"
            value={formState.iconUrl}
            onChange={handleChange}
            placeholder="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/..."
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
          />
        </label>
        <label className="md:col-span-2 flex flex-col text-sm text-slate-200">
          Description (optional)
          <textarea
            name="description"
            rows={3}
            value={formState.description}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
          />
        </label>
        <div className="md:col-span-2 flex items-center gap-3">
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
        {sortedSkills.map((skill) => (
          <div
            key={skill._id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3"
          >
            <div>
              <p className="text-sm font-semibold text-white">{skill.name}</p>
              <p className="text-xs text-slate-400">
                {skill.category} · {skill.proficiency}
              </p>
            </div>
            <div className="flex gap-2 text-sm">
              <button
                className="rounded-full border border-slate-700 px-3 py-1 text-slate-200 hover:border-blue-400 hover:text-blue-200"
                type="button"
                onClick={() => handleEdit(skill)}
              >
                Edit
              </button>
              <button
                className="rounded-full border border-rose-600 px-3 py-1 text-rose-200 hover:bg-rose-600/20"
                type="button"
                onClick={() => handleDelete(skill._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {!sortedSkills.length && (
          <p className="text-sm text-slate-400">No skills yet. Add your first skill above.</p>
        )}
      </div>
    </Card>
  );
}
