'use client';

import { useEffect, useState, useTransition } from "react";

import Card from "@/components/Card";
import Button from "@/components/Button";
import { api } from "@/lib/axios";

const defaultProfile = {
  name: "",
  role: "",
  headline: "",
  about: "",
  location: "",
  email: "",
  phone: "",
  resumeUrl: "",
  available: true,
};

export default function ProfileForm() {
  const [profile, setProfile] = useState(defaultProfile);
  const [status, setStatus] = useState(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await api.getProfile();
        if (mounted) {
          setProfile((prev) => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error("Failed to load profile", error);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    startTransition(async () => {
      try {
        await api.updateProfile(profile);
        setStatus({ type: "success", message: "Profile saved." });
      } catch (error) {
        setStatus({
          type: "error",
          message:
            error?.response?.data?.message ?? "Unable to save profile right now.",
        });
      }
    });
  };

  return (
    <Card className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Profile</h2>
          <p className="text-sm text-slate-400">
            Update hero details, contact info, and availability.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            name="available"
            checked={profile.available}
            onChange={handleChange}
            className="h-4 w-4 rounded border-slate-500 bg-slate-900"
          />
          Open to opportunities
        </label>
      </header>

      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <label className="flex flex-col text-sm text-slate-200">
          Name
          <input
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
          />
        </label>
        <label className="flex flex-col text-sm text-slate-200">
          Role
          <input
            name="role"
            value={profile.role}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
          />
        </label>
        <label className="md:col-span-2 flex flex-col text-sm text-slate-200">
          Headline
          <input
            name="headline"
            value={profile.headline}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
          />
        </label>
        <label className="md:col-span-2 flex flex-col text-sm text-slate-200">
          About
          <textarea
            name="about"
            rows={4}
            value={profile.about}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
          />
        </label>
        <label className="flex flex-col text-sm text-slate-200">
          Location
          <input
            name="location"
            value={profile.location}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
          />
        </label>
        <label className="flex flex-col text-sm text-slate-200">
          Email
          <input
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
          />
        </label>
        <label className="flex flex-col text-sm text-slate-200">
          Phone
          <input
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
          />
        </label>
        <label className="md:col-span-2 flex flex-col text-sm text-slate-200">
          Résumé URL
          <input
            name="resumeUrl"
            value={profile.resumeUrl}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
          />
        </label>
        <div className="md:col-span-2 flex items-center gap-4">
          <Button as="button" type="submit" disabled={isPending} className="px-6 py-3">
            {isPending ? "Saving..." : "Save profile"}
          </Button>
          {status && (
            <span
              className={`text-sm ${
                status.type === "success" ? "text-emerald-300" : "text-rose-300"
              }`}
            >
              {status.message}
            </span>
          )}
        </div>
      </form>
    </Card>
  );
}
