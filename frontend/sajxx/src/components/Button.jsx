const baseStyles =
  "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed";

const variants = {
  primary:
    "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:shadow-lg hover:shadow-blue-500/30 focus-visible:outline-blue-400 disabled:opacity-50 disabled:hover:shadow-none",
  secondary:
    "glass border border-white/10 text-slate-200 hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-white focus-visible:outline-slate-400 disabled:opacity-50 disabled:hover:border-white/10",
};

export default function Button({ as: Component = "a", variant = "primary", className = "", ...props }) {
  const styles = `${baseStyles} ${variants[variant]} ${className}`;
  return <Component className={styles} {...props} />;
}
