import { getLandingData } from "@/lib/data/landing";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import AchievementsSection from "@/components/AchievementsSection";
import ContactSection from "@/components/ContactSection";

export default async function Home() {
  const { profile, projects, skills, achievements } = await getLandingData();

  return (
    <main className="relative">
      <HeroSection profile={profile} skills={skills} />

      <div className="mx-auto max-w-7xl px-6 space-y-32 pb-16">
        <AboutSection profile={profile} />
        <SkillsSection skills={skills} />
        <ProjectsSection projects={projects} />
        <AchievementsSection achievements={achievements} />
        <ContactSection />
      </div>
    </main>
  );
}
