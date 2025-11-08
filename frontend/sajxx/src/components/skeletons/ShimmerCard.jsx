export default function ShimmerCard({ className = "" }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl glass border border-white/10 ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent animate-shine" />
      <div className="h-full w-full bg-slate-800/20" />
    </div>
  );
}
