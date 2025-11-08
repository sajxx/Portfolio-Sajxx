const baseStyles =
  "inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
const variants = {
  primary:
    "bg-blue-500 text-white hover:bg-blue-400 focus-visible:outline-blue-300 disabled:bg-blue-500/40 disabled:text-white/70",
  secondary:
    "border border-slate-700 text-slate-200 hover:border-slate-500 hover:text-white focus-visible:outline-slate-400 disabled:border-slate-700/60 disabled:text-slate-500",
};

export default function Button({ as: Component = "a", variant = "primary", className = "", ...props }) {
  const styles = `${baseStyles} ${variants[variant]} ${className}`;
  return <Component className={styles} {...props} />;
}
