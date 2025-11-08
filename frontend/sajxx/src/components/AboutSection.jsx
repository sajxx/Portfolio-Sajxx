import Section from "@/components/Section";

export default function AboutSection({ profile }) {
  return (
    <Section
      id="about"
      eyebrow="About"
      title="Story & Focus"
      className="text-left"
    >
      <p className="text-lg text-slate-300">
        {profile?.about ??
          "Use the admin dashboard to add a compelling summary that highlights your mission, values, and specialties."}
      </p>
      {profile?.available !== undefined && (
        <p className="text-sm uppercase tracking-[0.3em] text-blue-300">
          {profile.available ? "Open to work" : "Currently engaged"}
        </p>
      )}
      {profile?.socials?.length ? (
        <div className="flex flex-wrap gap-4 pt-4">
          {profile.socials.map((social) => (
            <a
              key={`${social.label}-${social.url}`}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-blue-300 hover:text-blue-200"
            >
              {social.label}
            </a>
          ))}
        </div>
      ) : null}
    </Section>
  );
}
