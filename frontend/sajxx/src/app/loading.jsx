import ShimmerCard from "@/components/skeletons/ShimmerCard";
import ShimmerList from "@/components/skeletons/ShimmerList";

export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 py-16">
      <section className="space-y-8">
        <div className="h-6 w-48 overflow-hidden rounded-full bg-gradient-to-r from-blue-500/30 via-blue-400/20 to-blue-500/30">
          <div className="h-full w-3/4 bg-blue-400/40 animate-wipe" />
        </div>
        <div className="space-y-4">
          <div className="h-12 rounded-2xl bg-slate-800/60" />
          <div className="h-12 w-4/5 rounded-2xl bg-slate-800/50" />
        </div>
        <div className="flex gap-4">
          <div className="h-12 w-36 rounded-full bg-blue-500/40" />
          <div className="h-12 w-36 rounded-full border border-slate-700/60" />
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <ShimmerCard key={`highlight-${index}`} className="h-48" />
        ))}
      </section>

      <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <ShimmerCard key={`project-${index}`} className="h-64" />
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <ShimmerCard className="h-48" />
        <ShimmerCard className="h-48" />
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <ShimmerCard key={`achievement-${index}`} className="h-40" />
        ))}
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8">
        <div className="grid gap-6 md:grid-cols-2">
          <ShimmerList count={2} />
          <ShimmerList count={2} />
          <div className="md:col-span-2">
            <div className="h-32 rounded-2xl bg-slate-800/60" />
          </div>
          <div className="h-12 w-40 rounded-full bg-blue-500/40 animate-pulse-slow" />
        </div>
      </section>
    </main>
  );
}
