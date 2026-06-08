"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Person } from "@/lib/types";
import SkillTree from "./SkillTree";

interface Props {
  people: Person[];
  intervalMs?: number;
}

/**
 * Auto-rotates through the visible people every N seconds. Strips chrome to
 * the bare tree + identity strip so the booth screen looks good from across
 * the room. Enabled via `?kiosk=1`.
 */
export default function KioskMode({ people, intervalMs = 18000 }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (people.length === 0) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % people.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [people.length, intervalMs]);

  if (people.length === 0) return null;
  const person = people[index]!;
  const Icon = person.icon;

  return (
    <div className="fixed inset-0 bg-[var(--bg)] flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)]">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 grid place-items-center text-white shadow">
            <Sparkles size={20} strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-bold text-base">Skill Tree</div>
            <div className="text-[11px] opacity-65">HR Learning Festival</div>
          </div>
        </div>
        <div className="text-[11px] opacity-65 uppercase tracking-[0.2em]">
          Kiosk mode · auto
        </div>
      </div>

      <div className="flex-1 grid grid-rows-[auto_1fr]">
        <div
          key={person.id + "-meta"}
          className="px-6 py-4 flex items-center gap-4 animate-fade-in"
        >
          <div className="h-14 w-14 rounded-2xl bg-brand-500 text-white grid place-items-center">
            <Icon size={28} strokeWidth={2.25} />
          </div>
          <div>
            <div className="text-2xl font-bold leading-tight">{person.name}</div>
            <div className="text-sm opacity-70">
              {person.currentRole} · {person.yearsExperience} yrs ·{" "}
              {person.skills.length} skills
            </div>
          </div>
          <div className="ml-auto text-[11px] opacity-60">
            Showing {index + 1} of {people.length}
          </div>
        </div>

        <div key={person.id + "-tree"} className="flex-1 px-4 pb-4 min-h-0">
          <div className="h-full w-full max-w-3xl mx-auto">
            <SkillTree person={person} />
          </div>
        </div>
      </div>
    </div>
  );
}
