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

// ─── Mastery ──────────────────────────────────────────────────
/** 0 = Locked (skill not yet picked up), 1/2/3 = Practicing / Competent / Expert. */
export type MasteryLevel = 0 | 1 | 2 | 3;

export const MASTERY_NAMES: Record<MasteryLevel, string> = {
  0: "Locked",
  1: "Practicing",
  2: "Competent",
  3: "Expert",
};

export const MASTERY_PERCENT: Record<MasteryLevel, number> = {
  0: 0,
  1: 33,
  2: 66,
  3: 100,
};

export const MASTERY_LEVELS: MasteryLevel[] = [0, 1, 2, 3];
/** Levels a person can actually hold on their tree (a skill they "have"). */
export const MASTERY_ACQUIRED: Exclude<MasteryLevel, 0>[] = [1, 2, 3];

// ─── Skills + Resources ───────────────────────────────────────
export type ResourceType = "course" | "video" | "book" | "article";

export interface ResourceLink {
  title: string;
  url: string;
  type: ResourceType;
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
  /** 1-2 vetted external resources visitors can follow to learn this skill. */
  resources: ResourceLink[];
}

// ─── People + Roles ───────────────────────────────────────────
export interface SkillMastery {
  id: string;
  level: Exclude<MasteryLevel, 0>; // 1 / 2 / 3
}

export interface Person {
  id: string;
  name: string;
  currentRole: string;
  yearsExperience: number;
  /** Lucide identity icon — distinct per person so each card / centre node is recognisable. */
  icon: LucideIcon;
  bio: string;
  /** Skills the person has, each carrying their current mastery level. */
  skills: SkillMastery[];
  /** Marks visitor-created people. Seed people omit this flag. */
  custom?: boolean;
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
