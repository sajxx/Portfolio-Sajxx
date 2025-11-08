import Button from "@/components/Button";

export default function HeroSection({ profile }) {
  return (
    <section id="hero" className="flex flex-col gap-10 lg:flex-row lg:items-center">
      <div className="flex-1 space-y-6">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
          {profile?.role ?? "Full Stack Developer"}
        </p>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">
          {profile?.name ?? "Your Name"}
        </h1>
        <p className="max-w-2xl text-lg text-slate-300">
          {profile?.headline ??
            "Crafting performant digital experiences with code and curiosity."}
        </p>
        <div className="flex flex-wrap gap-4">
          <Button href="#projects" className="px-6 py-3">
            Explore Projects
          </Button>
          {profile?.resumeUrl && (
            <Button
              as="a"
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              className="px-6 py-3"
            >
              Download Résumé
            </Button>
          )}
        </div>
      </div>
      <div className="flex w-full flex-1 flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-sm uppercase tracking-[0.35em] text-slate-400">
          Contact
        </h2>
        <ul className="space-y-2 text-slate-300">
          {profile?.email && <li>Email: {profile.email}</li>}
          {profile?.phone && <li>Phone: {profile.phone}</li>}
          {profile?.location && <li>Location: {profile.location}</li>}
        </ul>
      </div>
    </section>
  );
}
