export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800/60 bg-slate-950/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <p className="uppercase tracking-[0.3em] text-slate-500">
          Sajxx Portfolio
        </p>
        <p className="text-xs text-slate-500">
          &copy; {currentYear} Sajxx. Crafted with Next.js, Tailwind CSS, and Express.
        </p>
      </div>
    </footer>
  );
}
