"use client";

import { X } from "lucide-react";
import { categoryById } from "@/lib/data";
import { Person, Role, Skill } from "@/lib/types";

interface Props {
  skill: Skill | null;
  person: Person;
  role: Role | null;
  onClose: () => void;
}

export default function SkillSheet({ skill, person, role, onClose }: Props) {
  if (!skill) return null;
  const have = person.skillIds.includes(skill.id);
  const required = role?.requiredSkillIds.includes(skill.id);
  const nice = role?.niceToHaveSkillIds.includes(skill.id);
  const cat = categoryById[skill.category];
  const SkillIcon = skill.icon;
  const CatIcon = cat.icon;

  let status = "Not yet acquired";
  let tone = "opacity-70";
  if (have) {
    status = "Acquired";
    tone = "text-green-600 dark:text-green-400";
  } else if (required) {
    status = "Required for your goal";
    tone = "text-orange-600 dark:text-orange-400";
  } else if (nice) {
    status = "Nice-to-have for your goal";
    tone = "text-blue-600 dark:text-blue-400";
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-[var(--bg-elev)] rounded-t-3xl sm:rounded-3xl p-5 border-t sm:border border-[var(--line)] shadow-2xl animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[var(--line)] sm:hidden" />
        <div className="flex items-start gap-3">
          <div
            className="h-14 w-14 rounded-2xl grid place-items-center flex-shrink-0"
            style={{ background: cat.color + "22", color: cat.color }}
          >
            <SkillIcon size={28} strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs uppercase tracking-wide opacity-65 flex items-center gap-1">
              <CatIcon size={12} strokeWidth={2.25} />
              <span>{cat.name}</span>
            </div>
            <div className="text-xl font-bold leading-tight">{skill.name}</div>
            <div className={`text-xs font-medium mt-1 ${tone}`}>{status}</div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="h-8 w-8 rounded-full bg-[var(--bg)] grid place-items-center opacity-70 hover:opacity-100"
          >
            <X size={16} strokeWidth={2.25} />
          </button>
        </div>
        <p className="text-sm opacity-80 mt-4 leading-relaxed">
          {skill.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5 text-[11px]">
          <span className="px-2 py-1 rounded-full bg-[var(--bg)] border border-[var(--line)]">
            Tier {skill.tier}
          </span>
          {skill.prerequisites?.length ? (
            <span className="px-2 py-1 rounded-full bg-[var(--bg)] border border-[var(--line)]">
              Builds on {skill.prerequisites.length}
            </span>
          ) : (
            <span className="px-2 py-1 rounded-full bg-[var(--bg)] border border-[var(--line)]">
              Foundational
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
