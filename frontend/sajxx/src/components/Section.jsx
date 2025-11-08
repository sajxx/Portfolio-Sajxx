export default function Section({
  title,
  eyebrow,
  children,
  className = "",
  ...props
}) {
  return (
    <section className={`space-y-4 ${className}`} {...props}>
      {eyebrow && (
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
          {eyebrow}
        </p>
      )}
      {title && (
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">
          {title}
        </h2>
      )}
      <div className="space-y-6 text-slate-300">{children}</div>
    </section>
  );
}
