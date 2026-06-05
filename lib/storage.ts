"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Bird,
  Cherry,
  Crown,
  Dog,
  Flower,
  Heart,
  Leaf,
  Mountain,
  Rocket,
  Sparkles,
  Star,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { seedPeople } from "./data";
import { Person, SkillMastery } from "./types";

const CUSTOM_KEY = "skilltree.custom.v1";
const HIDDEN_KEY = "skilltree.hidden.v1";

/** Icons a visitor can pick when creating their own person. */
export const AVATAR_CHOICES: Array<{ id: string; icon: LucideIcon; label: string }> = [
  { id: "leaf", icon: Leaf, label: "Leaf" },
  { id: "cherry", icon: Cherry, label: "Cherry" },
  { id: "flower", icon: Flower, label: "Flower" },
  { id: "sun", icon: Sun, label: "Sun" },
  { id: "star", icon: Star, label: "Star" },
  { id: "sparkles", icon: Sparkles, label: "Sparkles" },
  { id: "rocket", icon: Rocket, label: "Rocket" },
  { id: "mountain", icon: Mountain, label: "Mountain" },
  { id: "heart", icon: Heart, label: "Heart" },
  { id: "crown", icon: Crown, label: "Crown" },
  { id: "bird", icon: Bird, label: "Bird" },
  { id: "dog", icon: Dog, label: "Dog" },
];

const ICON_BY_ID: Record<string, LucideIcon> = Object.fromEntries(
  AVATAR_CHOICES.map((a) => [a.id, a.icon])
);

interface StoredPerson {
  id: string;
  name: string;
  currentRole: string;
  yearsExperience: number;
  iconId: string;
  bio: string;
  skills: SkillMastery[];
}

function loadStored(): StoredPerson[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadHidden(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HIDDEN_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function hydrate(stored: StoredPerson): Person {
  return {
    id: stored.id,
    name: stored.name,
    currentRole: stored.currentRole,
    yearsExperience: stored.yearsExperience,
    icon: ICON_BY_ID[stored.iconId] ?? Sparkles,
    bio: stored.bio,
    skills: stored.skills,
    custom: true,
  };
}

function newId(): string {
  return `custom-${Math.random().toString(36).slice(2, 9)}`;
}

export interface NewPersonInput {
  name: string;
  currentRole: string;
  yearsExperience: number;
  iconId: string;
  bio?: string;
  skills: SkillMastery[];
}

export function usePeople() {
  const [hydrated, setHydrated] = useState(false);
  const [custom, setCustom] = useState<Person[]>([]);
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  // Initial hydration from localStorage (client-only, after mount)
  useEffect(() => {
    setCustom(loadStored().map(hydrate));
    setHidden(new Set(loadHidden()));
    setHydrated(true);
  }, []);

  const persistCustom = useCallback((next: Person[]) => {
    setCustom(next);
    if (typeof window === "undefined") return;
    const serialised: StoredPerson[] = next.map((p) => ({
      id: p.id,
      name: p.name,
      currentRole: p.currentRole,
      yearsExperience: p.yearsExperience,
      iconId:
        Object.entries(ICON_BY_ID).find(([, ic]) => ic === p.icon)?.[0] ??
        "sparkles",
      bio: p.bio,
      skills: p.skills,
    }));
    try {
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(serialised));
    } catch {}
  }, []);

  const persistHidden = useCallback((next: Set<string>) => {
    setHidden(next);
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(HIDDEN_KEY, JSON.stringify([...next]));
    } catch {}
  }, []);

  const addPerson = useCallback(
    (input: NewPersonInput): Person => {
      const person: Person = {
        id: newId(),
        name: input.name.trim() || "Anonymous",
        currentRole: input.currentRole.trim() || "Visitor",
        yearsExperience: Math.max(0, Math.min(50, input.yearsExperience)),
        icon: ICON_BY_ID[input.iconId] ?? Sparkles,
        bio: input.bio?.trim() || "Crafted at the booth.",
        skills: input.skills,
        custom: true,
      };
      persistCustom([person, ...custom]);
      return person;
    },
    [custom, persistCustom]
  );

  const removePerson = useCallback(
    (id: string) => {
      const isSeed = seedPeople.some((p) => p.id === id);
      if (isSeed) {
        // Hide the seed person rather than mutating the source array.
        const next = new Set(hidden);
        next.add(id);
        persistHidden(next);
      } else {
        persistCustom(custom.filter((p) => p.id !== id));
      }
    },
    [custom, hidden, persistCustom, persistHidden]
  );

  const restoreSeed = useCallback(() => {
    persistHidden(new Set());
  }, [persistHidden]);

  // Final merged view: custom (newest first) then seed minus hidden.
  const visible: Person[] = [
    ...custom,
    ...seedPeople.filter((p) => !hidden.has(p.id)),
  ];

  return {
    hydrated,
    people: visible,
    custom,
    hiddenCount: hidden.size,
    addPerson,
    removePerson,
    restoreSeed,
  };
}
