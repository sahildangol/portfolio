import { backend, creator, mobile, web, brandLogo, github } from "../assets";
import portfolioData from "../data/portfolioData.json";

const iconMap = {
  backend,
  creator,
  mobile,
  web,
  logo: brandLogo,
  github,
};

const withIcon = (entry) => ({
  ...entry,
  icon: iconMap[entry.iconKey] || brandLogo,
});

export const { navLinks } = portfolioData;
export const profile = portfolioData.profile;
export const heroHighlights = portfolioData.heroHighlights;
export const insightCards = portfolioData.insightCards;
export const about = portfolioData.about;
export const focusTabs = portfolioData.focusTabs;
export const featuredProjects = portfolioData.featuredProjects;
export const skillGroups = portfolioData.skillGroups;
export const contactInfo = portfolioData.contact;
export const lab = portfolioData.lab;

export const services = portfolioData.services.map(withIcon);
export const experiences = portfolioData.experiences.map(withIcon);
