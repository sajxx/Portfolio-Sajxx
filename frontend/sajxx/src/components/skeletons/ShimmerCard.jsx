export default function ShimmerCard({ className = "" }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine" />
      <div className="h-full w-full bg-slate-800/40" />
    </div>
  );
}
