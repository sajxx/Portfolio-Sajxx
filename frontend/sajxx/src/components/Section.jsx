import { forwardRef } from "react";

const Section = forwardRef(function Section({
  title,
  eyebrow,
  children,
  className = "",
  ...props
}, ref) {
  return (
    <section ref={ref} className={`space-y-8 ${className}`} {...props}>
      {eyebrow && (
        <div className="flex items-center gap-3">
          <span className="h-px w-12 bg-gradient-to-r from-blue-500 to-purple-500"></span>
          <p className="text-sm uppercase tracking-[0.3em] text-blue-400 font-semibold">
            {eyebrow}
          </p>
        </div>
      )}
      {title && (
        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
          {title}
        </h2>
      )}
      <div className="space-y-6 text-slate-300">{children}</div>
    </section>
  );
});

export default Section;
