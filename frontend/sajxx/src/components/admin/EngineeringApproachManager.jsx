'use client';

import { useEffect, useMemo, useState, useTransition } from "react";

import Card from "@/components/Card";
import Button from "@/components/Button";
import { api } from "@/lib/axios";

const blankApproach = {
  title: "",
  points: "",
};

export default function EngineeringApproachManager() {
  const [approaches, setApproaches] = useState([]);
  const [formState, setFormState] = useState(blankApproach);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState(null);
  const [isPending, startTransition] = useTransition();

  const sorted = useMemo(
    () => [...approaches].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [approaches]
  );

  const load = async () => {
    try {
      const data = await api.getEngineeringApproaches();
      setApproaches(data);
    } catch (error) {
      console.error("Failed to load engineering approaches", error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setFormState(blankApproach);
    setEditingId(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const buildPayload = () => {
    const payload = { title: formState.title };

    if (formState.points) {
      payload.points = formState.points
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [heading, ...rest] = line.split("|");
          return { heading: heading.trim(), description: rest.join("|").trim() };
        });
    }

    return payload;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formState.title) return;

    startTransition(async () => {
      try {
        const payload = buildPayload();
        if (editingId) {
          await api.updateEngineeringApproach(editingId, payload);
          setStatus({ type: "success", message: "Updated" });
        } else {
          await api.createEngineeringApproach(payload);
          setStatus({ type: "success", message: "Created" });
        }
        resetForm();
        await load();
      } catch (error) {
        setStatus({
          type: "error",
          message: error?.response?.data?.message ?? "Unable to save",
        });
      }
    });
  };

  const handleEdit = (doc) => {
    setEditingId(doc._id);
    setFormState({
      title: doc.title ?? "",
      points: (doc.points ?? [])
        .map((p) => `${p.heading} | ${p.description}`)
        .join("\n"),
    });
  };

  const handleDelete = (id) => {
    startTransition(async () => {
      try {
        await api.deleteEngineeringApproach(id);
        setApproaches((prev) => prev.filter((d) => d._id !== id));
      } catch (error) {
        setStatus({
          type: "error",
          message: error?.response?.data?.message ?? "Unable to delete",
        });
      }
    });
  };

  return (
    <Card className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Engineering Approach</h2>
          <p className="text-sm text-slate-400">
            Describe how you approach engineering problems &mdash; shown after the Projects section.
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
        <label className="md:col-span-2 flex flex-col text-sm text-slate-200">
          Title
          <input
            required
            name="title"
            value={formState.title}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
            placeholder="e.g. API-First Design"
          />
        </label>

        <label className="md:col-span-2 flex flex-col text-sm text-slate-200">
          Points (one per line: Heading | Description)
          <textarea
            name="points"
            rows={5}
            value={formState.points}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white font-mono text-xs"
            placeholder={"Define contracts first | OpenAPI specs are written before any implementation\nVersion everything | All endpoints carry a version prefix for safe rollouts"}
          />
          <span className="text-xs text-slate-500 mt-1">Format: Heading | Description &mdash; one point per line</span>
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
        {sorted.map((doc) => (
          <div
            key={doc._id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3"
          >
            <div>
              <p className="text-sm font-semibold text-white">{doc.title}</p>
              <p className="text-xs text-slate-400">
                {doc.points?.length ?? 0} point{(doc.points?.length ?? 0) !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex gap-2 text-sm">
              <button
                className="rounded-full border border-slate-700 px-3 py-1 text-slate-200 hover:border-blue-400 hover:text-blue-200"
                type="button"
                onClick={() => handleEdit(doc)}
              >
                Edit
              </button>
              <button
                className="rounded-full border border-rose-600 px-3 py-1 text-rose-200 hover:bg-rose-600/20"
                type="button"
                onClick={() => handleDelete(doc._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {!sorted.length && (
          <p className="text-sm text-slate-400">
            No engineering approach entries yet. Add your first one above.
          </p>
        )}
      </div>
    </Card>
  );
}
