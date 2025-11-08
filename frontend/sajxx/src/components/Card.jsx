export default function Card({ children, className = "" }) {
  return (
    <div
      className={`relative group rounded-2xl glass border border-white/10 p-6 shadow-xl hover:border-blue-500/30 transition-all ${className}`}
    >
      {children}
    </div>
  );
}
