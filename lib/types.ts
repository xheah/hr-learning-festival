export type CategoryId = "hr" | "finance" | "admin";

export interface Category {
  id: CategoryId;
  name: string;
  short: string;
  color: string; // tailwind-ish hex
  accent: string;
  icon: string; // emoji
}

export interface Skill {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  icon: string;
  /** Skills that should usually be acquired before this one. Visual + ordering hint. */
  prerequisites?: string[];
  /** 1 = foundational, 2 = intermediate, 3 = advanced */
  tier: 1 | 2 | 3;
}

export interface Person {
  id: string;
  name: string;
  currentRole: string;
  yearsExperience: number;
  avatar: string; // emoji
  bio: string;
  skillIds: string[];
}

export interface Role {
  id: string;
  title: string;
  department: string;
  description: string;
  /** Must-have skills to be considered ready */
  requiredSkillIds: string[];
  /** Boosts but not required */
  niceToHaveSkillIds: string[];
}
