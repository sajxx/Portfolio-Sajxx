import { getLandingData } from "@/lib/data/landing";
import Section from "@/components/Section";
import Card from "@/components/Card";
import Button from "@/components/Button";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import AchievementsSection from "@/components/AchievementsSection";
import ContactSection from "@/components/ContactSection";

export default async function Home() {
  const { profile, projects, skills, achievements } = await getLandingData();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 py-16">
      <HeroSection profile={profile} />

      <Section eyebrow="At a Glance" className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <h3 className="text-sm uppercase tracking-[0.4em] text-slate-400">
            Projects
          </h3>
          <p className="mt-3 text-3xl font-semibold text-white">
            {projects.length}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Featured work pulled from the Express API.
          </p>
        </Card>

        <Card>
          <h3 className="text-sm uppercase tracking-[0.4em] text-slate-400">
            Skills
          </h3>
          <p className="mt-3 text-3xl font-semibold text-white">
            {skills.length}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Technical stack categories coming soon.
          </p>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <h3 className="text-sm uppercase tracking-[0.4em] text-slate-400">
            Achievements
          </h3>
          <p className="mt-3 text-3xl font-semibold text-white">
            {achievements.length}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Recognitions and milestones surfaced from MongoDB.
          </p>
        </Card>
      </Section>

      <AboutSection profile={profile} />
      <ProjectsSection projects={projects} />
      <SkillsSection skills={skills} />
      <AchievementsSection achievements={achievements} />
      <ContactSection />
    </main>
  );
}
