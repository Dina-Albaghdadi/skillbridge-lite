import { createContext, useContext, useState, type ReactNode } from "react";

export type Profile = {
  name: string;
  headline: string;
  about: string;
  skills: string;
  projects: string;
  experience: string;
};

export const SAMPLE_PROFILE: Profile = {
  name: "Sample Student",
  headline: "Computer Engineering student (sample profile)",
  about: "This is a placeholder profile used for demonstration until you enter your own details.",
  skills: "Python, HTML, CSS, APIs",
  projects: "Sample project: a small weather dashboard using a public API.",
  experience: "Sample entry: university group project coordinator.",
};

export type Opportunity = {
  id: string;
  title: string;
  company: string;
  description: string;
  skills: string[];
  responsibilities: string[];
};

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "ai-automation-intern",
    title: "AI Automation Intern",
    company: "TechFlow",
    description:
      "Support development of AI-powered workflows and automation solutions for business processes.",
    skills: ["Python", "AI", "Automation", "APIs"],
    responsibilities: [
      "Assist in building automated workflows for internal business processes",
      "Integrate AI services through APIs",
      "Test and document automation scripts",
    ],
  },
  {
    id: "junior-frontend-developer",
    title: "Junior Frontend Developer",
    company: "PixelWorks",
    description: "Help build responsive web interfaces and interactive user experiences.",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    responsibilities: [
      "Implement responsive layouts from design mockups",
      "Build reusable React components",
      "Collaborate with designers to refine user experience",
    ],
  },
  {
    id: "iot-solutions-engineer",
    title: "IoT Solutions Engineer",
    company: "Connected Systems Lab",
    description:
      "Support development of connected systems using sensors, microcontrollers, and software.",
    skills: ["IoT", "Python", "ESP32", "APIs"],
    responsibilities: [
      "Prototype sensor-based devices with ESP32 microcontrollers",
      "Write software to collect and transmit device data",
      "Connect devices to cloud services through APIs",
    ],
  },
];

type Ctx = { profile: Profile; isSample: boolean; save: (p: Profile) => void };
const ProfileContext = createContext<Ctx | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(SAMPLE_PROFILE);
  const [isSample, setIsSample] = useState(true);
  return (
    <ProfileContext.Provider
      value={{ profile, isSample, save: (p) => { setProfile(p); setIsSample(false); } }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const c = useContext(ProfileContext);
  if (!c) throw new Error("useProfile outside provider");
  return c;
}

/** Real AI is not configured in this prototype. */
export const AI_CONFIGURED = false;

export function hasEnoughData(p: Profile) {
  return p.skills.trim().length > 0 && (p.projects.trim() || p.experience.trim()).length > 0;
}
