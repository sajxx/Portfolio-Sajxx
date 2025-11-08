export default function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg shadow-slate-950/30 ${className}`}
    >
      {children}
    </div>
  );
}
