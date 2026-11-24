import { asteroid, brandLogo, creator, kathford, kathfoss, teslatech } from "../assets";
import portfolioData from "../data/portfolioData.json";

const iconMap = {
  logo: brandLogo,
  creator,
  teslatech,
  asteroid,
  kathfoss,
  kathford,
};

const withIcon = (entry) => ({
  ...entry,
  icon: iconMap[entry.iconKey] || brandLogo,
});

export const { navLinks } = portfolioData;
export const profile = portfolioData.profile;
export const engineering = portfolioData.engineering;
export const featuredProjects = portfolioData.featuredProjects.filter((p) => p.featured);
export const contactInfo = portfolioData.contact;
export const guideSteps = portfolioData.guide.steps;
export const guideLines = { greeting: portfolioData.guide.greeting, clicked: portfolioData.guide.clicked };
export const guideChat = portfolioData.guide.chat;
export const experiences = portfolioData.experiences.map(withIcon);
export const education = portfolioData.education.map((e) => ({ ...e, icon: iconMap[e.iconKey] || null }));

// Order the guide walks through; "hero" is the top of the page.
export const tourSections = guideSteps.map((step) => step.section);
