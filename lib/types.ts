import type { LucideIcon } from "lucide-react";

export type CategoryId = "hr" | "finance" | "admin";

export interface Category {
  id: CategoryId;
  name: string;
  short: string;
  /** Main sector colour — used for borders, acquired skill fills, highlights. */
  color: string;
  /** Soft tint used as the label / chip background. */
  accent: string;
  /** Dark sector variant used for text and icons placed on the accent fill,
   *  so we don't trip on low contrast. */
  darkColor: string;
  icon: LucideIcon;
}

export interface Skill {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  icon: LucideIcon;
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
  /** Lucide identity icon — distinct per person so each card / centre node is recognisable. */
  icon: LucideIcon;
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
