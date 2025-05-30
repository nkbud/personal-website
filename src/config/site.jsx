import { Code, Briefcase, Beaker, Palette, BookOpen, Settings, Brain } from 'lucide-react';

export const siteConfig = {
  title: "Nicholas Budzban — AI Educator",
  hero: {
    headline: "Researching simple and general solutions enabled by new technology",
    subheadline: "What can exist, shall exist",
    mainAction: {
      label: "Explore Projects",
      href: "/projects"
    },
    secondaryAction: {
      label: "Contact Me",
      href: "/contact"
    }
  },
  socialLinks: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://twitter.com/yourusername",
  }
};

export const sectionsConfig = [
  {
    slug: "projects",
    heading: "Projects",
    icon: Briefcase,
    description: "Innovative solutions and applications I've developed.",
  },
  {
    slug: "services",
    heading: "Services",
    icon: Settings,
    description: "Professional services I offer to help you achieve your goals.",
  },
  {
    slug: "research",
    heading: "Research",
    icon: Beaker,
    description: "Explorations into new ideas and technologies.",
  },
  {
    slug: "hobbies",
    heading: "Hobbies",
    icon: Palette,
    description: "Creative pursuits and personal interests.",
  },
  {
    slug: "tutorials",
    heading: "Tutorials",
    icon: BookOpen,
    description: "Step-by-step guides and how-to articles.",
  },
  {
    slug: "technology",
    heading: "Tech",
    icon: Code,
    description: "Deep dives into specific technologies and concepts.",
  },
  {
    slug: "academics",
    heading: "Academics",
    icon: Brain,
    description: "Theoretical foundations and academic explorations.",
  }
];

export const getSectionData = (slug) => sectionsConfig.find(section => section.slug === slug);

// getPostData will now fetch from Supabase in PostPage.jsx
// This function can be removed or adapted if needed for other purposes.
// For now, we'll keep it simple and rely on direct fetching in components.
export const getPostData = async (sectionSlug, postSlug) => {
  // This is a placeholder. Actual data fetching will happen in PostPage.jsx
  console.warn("getPostData in site.jsx is a placeholder and should be replaced by Supabase fetches in components.");
  return null; 
};