import Section from "@/components/Section";
import Card from "@/components/Card";

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function AchievementsSection({ achievements }) {
  return (
    <Section
      id="achievements"
      eyebrow="Achievements"
      title="Highlights & Recognition"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {achievements?.length ? (
          achievements.map((item) => (
            <Card key={item._id ?? item.title} className="space-y-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
                <span>{item.category ?? "General"}</span>
                <span>{formatDate(item.date)}</span>
              </div>
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              {item.description && (
                <p className="text-sm text-slate-300">{item.description}</p>
              )}
              {item.issuedBy && (
                <p className="text-xs uppercase tracking-[0.2em] text-blue-300">
                  {item.issuedBy}
                </p>
              )}
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-300 hover:text-blue-200"
                >
                  View Credential
                </a>
              )}
            </Card>
          ))
        ) : (
          <Card className="col-span-full text-center text-slate-400">
            Achievements will appear here once added in the admin panel.
          </Card>
        )}
      </div>
    </Section>
  );
}
