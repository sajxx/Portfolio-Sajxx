import { api } from "@/lib/axios";

const fallbackSocials = [
  { icon: "fa-brands fa-github", label: "GitHub", href: "https://github.com" },
  { icon: "fa-brands fa-linkedin", label: "LinkedIn", href: "https://linkedin.com" },
  { icon: "fa-brands fa-x-twitter", label: "Twitter", href: "https://x.com" },
];

const normalizeHref = (value) => {
  if (!value) return "";
  const trimmed = value.trim();
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const formatSocials = (socials) => {
  if (!Array.isArray(socials)) return [];
  return socials
    .map((social, index) => {
      const href = normalizeHref(social?.url);
      if (!href) return null;
      const label = social?.label?.trim() || `Social ${index + 1}`;
      const icon = social?.icon?.trim() || "fa-solid fa-link";
      return { href, label, icon };
    })
    .filter(Boolean);
};

export default async function Footer() {
  let socials = [];

  try {
    const profile = await api.getProfile();
    socials = formatSocials(profile?.socials);
  } catch (error) {
    console.error("Failed  to load profile socials", error);
  }

  if (!socials.length) {
    socials = fallbackSocials;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 glass mt-32">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-16">
        {/* Top section */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold gradient-text">SAJXX</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Building beautiful digital experiences with modern web technologies. 
              Let's create something amazing together.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'About', 'Projects', 'Contact'].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase()}`}
                    className="text-slate-400 hover:text-white transition-colors text-sm inline-flex items-center gap-2 group"
                  >
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */} 
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Connect</h4>
            <div className="flex gap-3">
              {socials.map((social, index) => {
                const isExternal = /^https?:/i.test(social.href);
                const anchorProps = isExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {};

                return (
                  <a
                    key={`${social.label}-${index}`}
                    href={social.href}
                    aria-label={social.label}
                    {...anchorProps}
                    className="flex h-10 w-10 items-center justify-center rounded-lg glass border border-white/10 text-slate-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all"
                  >
                    <i className={social.icon} aria-hidden="true"></i>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Get In Touch</h4>
            <a 
              href="#contact" 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send Message
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>

        {/* Bottom section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <p>
            &copy; {currentYear} <span className="text-white font-semibold">Sajxx</span>. All rights reserved.
          </p>
          <p className="flex items-center gap-2">
            Crafted with 
            <svg className="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            using Next.js & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
