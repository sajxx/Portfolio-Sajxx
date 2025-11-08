import Section from "@/components/Section";
import Card from "@/components/Card";

function groupByCategory(skills) {
  return skills.reduce((acc, skill) => {
    const category = skill.category ?? "general";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});
}

export default function SkillsSection({ skills }) {
  const grouped = groupByCategory(skills ?? []);
  const categories = Object.keys(grouped);

  return (
    <Section id="skills" eyebrow="Skills" title="Technical Toolkit">
      {categories.length ? (
        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((category) => (
            <Card key={category} className="space-y-4">
              <h3 className="text-sm uppercase tracking-[0.3em] text-slate-400">
                {category}
              </h3>
              <ul className="flex flex-wrap gap-2 text-sm text-slate-200">
                {grouped[category]
                  .sort((a, b) => a.order - b.order)
                  .map((skill) => (
                    <li
                      key={skill._id ?? skill.name}
                      className="flex items-center gap-2 rounded-full bg-slate-800/80 px-3 py-1"
                    >
                      {skill.icon ? (
                        <i
                          className={`fa ${skill.icon} fa-fw text-base text-blue-300`}
                          aria-hidden="true"
                        />
                      ) : null}
                      {skill.name}
                      {skill.proficiency
                        ? ` · ${skill.proficiency.toUpperCase()}`
                        : ""}
                    </li>
                  ))}
              </ul>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center text-slate-400">
          Add skills via the admin dashboard to highlight your strengths.
        </Card>
      )}
    </Section>
  );
}
