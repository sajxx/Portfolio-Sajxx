export default function ShimmerList({ count = 3 }) {
  return (
    <ul className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <li
          key={index}
          className="relative h-4 overflow-hidden rounded-full bg-slate-800/60"
        >
          <div className="absolute inset-0 bg-blue-500/20 animate-pulse-slow" />
        </li>
      ))}
    </ul>
  );
}
