import { api } from "../axios";

const emptyState = {
  profile: null,
  projects: [],
  skills: [],
  achievements: [],
};

const sampleProfile = {
  name: "Your Name",
  role: "Full Stack Developer",
  headline: "Crafting rich web experiences with performance in mind.",
  about:
    "Replace this placeholder by updating your profile from the admin dashboard.",
  location: "Remote",
  socials: [],
};

export async function getLandingData() {
  try {
    const [profile, projects, skills, achievements] = await Promise.all([
      api.getProfile(),
      api.getProjects({ featured: true }),
      api.getSkills(),
      api.getAchievements(),
    ]);

    return {
      profile: profile ?? sampleProfile,
      projects,
      skills,
      achievements,
    };
  } catch (error) {
    console.error("Failed to fetch landing data", error.message ?? error);
    return {
      ...emptyState,
      profile: sampleProfile,
    };
  }
}
