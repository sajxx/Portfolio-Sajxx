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
  socials: [],
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
          setProfile((prev) => ({
            ...prev,
            ...data,
            socials: Array.isArray(data?.socials) ? data.socials : [],
          }));
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

  const handleSocialChange = (index, field, value) => {
    setProfile((prev) => {
      const socials = Array.isArray(prev.socials) ? [...prev.socials] : [];
      const current = socials[index] ?? { label: "", url: "", icon: "" };
      socials[index] = { ...current, [field]: value };
      return { ...prev, socials };
    });
  };

  const addSocial = () => {
    setProfile((prev) => ({
      ...prev,
      socials: [...(Array.isArray(prev.socials) ? prev.socials : []), { label: "", url: "", icon: "" }],
    }));
  };

  const removeSocial = (index) => {
    setProfile((prev) => {
      const socials = Array.isArray(prev.socials) ? prev.socials.filter((_, i) => i !== index) : [];
      return { ...prev, socials };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    startTransition(async () => {
      try {
        const sanitizedSocials = (profile.socials ?? [])
          .map((social) => ({
            label: social.label?.trim() ?? "",
            url: social.url?.trim() ?? "",
            icon: social.icon?.trim() ?? "",
          }))
          .filter((social) => social.url);

        const payload = {
          ...profile,
          socials: sanitizedSocials,
        };

        const updated = await api.updateProfile(payload);
        setProfile((prev) => ({
          ...prev,
          ...updated,
          socials: Array.isArray(updated?.socials) ? updated.socials : [],
        }));
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
        <div className="md:col-span-2 space-y-4 rounded-lg border border-slate-700 bg-slate-900/60 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-200">Social links</p>
              <p className="text-xs text-slate-400">
                Provide the full URL and Font Awesome icon class, e.g. <code className="text-slate-300">fa-brands fa-linkedin-in</code>.
              </p>
            </div>
            <Button
              as="button"
              type="button"
              variant="secondary"
              onClick={addSocial}
              className="px-4 py-2"
            >
              Add social
            </Button>
          </div>
          <div className="space-y-4">
            {profile.socials?.length ? (
              profile.socials.map((social, index) => (
                <div
                  key={`social-${index}`}
                  className="space-y-3 rounded-lg border border-slate-700 bg-slate-900 p-4"
                >
                  <div className="grid gap-3 md:grid-cols-3">
                    <label className="flex flex-col text-xs text-slate-200">
                      Label
                      <input
                        value={social.label ?? ""}
                        onChange={(event) => handleSocialChange(index, "label", event.target.value)}
                        placeholder="LinkedIn"
                        className="mt-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                      />
                    </label>
                    <label className="flex flex-col text-xs text-slate-200">
                      URL
                      <input
                        type="url"
                        value={social.url ?? ""}
                        onChange={(event) => handleSocialChange(index, "url", event.target.value)}
                        placeholder="https://linkedin.com/in/username"
                        className="mt-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                      />
                    </label>
                    <label className="flex flex-col text-xs text-slate-200">
                      Icon class
                      <input
                        value={social.icon ?? ""}
                        onChange={(event) => handleSocialChange(index, "icon", event.target.value)}
                        placeholder="fa-brands fa-linkedin-in"
                        className="mt-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                      />
                    </label>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeSocial(index)}
                      className="text-xs font-medium text-slate-400 hover:text-rose-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No socials yet. Select “Add social” to include one.</p>
            )}
          </div>
        </div>
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
