'use client';

import { useEffect, useState, useTransition } from "react";

import Button from "@/components/Button";
import Card from "@/components/Card";
import ProfileForm from "@/components/admin/ProfileForm";
import ProjectsManager from "@/components/admin/ProjectsManager";
import SkillsManager from "@/components/admin/SkillsManager";
import AchievementsManager from "@/components/admin/AchievementsManager";
import MessagesManager from "@/components/admin/MessagesManager";
import { api, authStore } from "@/lib/axios";

export default function AdminPage() {
  const [token, setToken] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setToken(authStore.getToken());
    const unsubscribe = authStore.subscribe(setToken);
    setHydrated(true);
    return () => {
      unsubscribe?.();
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!password) return;

    setError(null);
    startTransition(async () => {
      try {
        const { token: nextToken } = await api.adminLogin(password);
        authStore.setToken(nextToken);
        setPassword("");
      } catch (loginError) {
        setError(loginError?.response?.data?.message ?? "Unable to sign in right now.");
      }
    });
  };

  const handleLogout = () => {
    authStore.clearToken();
    setPassword("");
  };

  if (!hydrated) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4 pb-16 pt-10">
        <Card className="w-full max-w-md text-center text-sm text-slate-400">
          Loading dashboard...
        </Card>
      </main>
    );
  }

  if (!token) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4 pb-16 pt-10">
        <Card className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold text-white">Admin access</h1>
            <p className="text-sm text-slate-400">
              Enter the admin password to manage your portfolio content.
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="flex flex-col text-sm text-slate-200">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
                placeholder="••••••••"
              />
            </label>
            {error && <p className="text-sm text-rose-300">{error}</p>}
            <Button
              as="button"
              type="submit"
              disabled={!password || isPending}
              className="w-full px-6 py-3"
            >
              {isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Card>
      </main>
    );
  }

  return (
    <main className="px-4 pb-16 pt-6 md:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-white">Admin dashboard</h1>
            <p className="text-sm text-slate-400">
              Update your profile, showcase new projects, and manage content in one place.
            </p>
          </div>
          <Button as="button" variant="secondary" onClick={handleLogout} className="px-5 py-2">
            Sign out
          </Button>
        </header>

        <section className="flex flex-col gap-8">
          <ProfileForm />
          <ProjectsManager />
          <SkillsManager />
          <AchievementsManager />
          <MessagesManager />
        </section>
      </div>
    </main>
  );
}
