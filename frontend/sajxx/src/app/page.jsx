import { getLandingData } from "@/lib/data/landing";

export default async function Home() {
  const { profile, projects, skills, achievements } = await getLandingData();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16">
      <section className="space-y-4 text-left">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
          Portfolio Overview
        </p>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">
          {profile?.headline ?? "Building your personal brand"}
        </h1>
        <p className="max-w-2xl text-lg text-slate-300">
          {profile?.about ??
            "Populate your portfolio by adding profile details, featured projects, and skills through the admin interface."}
        </p>
      </section>

      <section className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-sm uppercase tracking-[0.4em] text-slate-400">
            Projects
          </h2>
          <p className="mt-3 text-3xl font-semibold text-white">
            {projects.length}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Featured work pulled from the Express API.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-sm uppercase tracking-[0.4em] text-slate-400">
            Skills
          </h2>
          <p className="mt-3 text-3xl font-semibold text-white">
            {skills.length}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Technical stack categories coming soon.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:col-span-2 lg:col-span-1">
          <h2 className="text-sm uppercase tracking-[0.4em] text-slate-400">
            Achievements
          </h2>
          <p className="mt-3 text-3xl font-semibold text-white">
            {achievements.length}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Recognitions and milestones surfaced from MongoDB.
          </p>
        </div>
      </section>
    </main>
  );
}
