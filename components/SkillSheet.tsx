"use client";

import {
  BookOpen,
  ExternalLink,
  GraduationCap,
  Newspaper,
  PlayCircle,
  X,
  type LucideIcon,
} from "lucide-react";
import { categoryById, getMastery } from "@/lib/data";
import {
  MASTERY_NAMES,
  MASTERY_PERCENT,
  MasteryLevel,
  Person,
  ResourceType,
  Role,
  Skill,
} from "@/lib/types";

interface Props {
  skill: Skill | null;
  person: Person;
  role: Role | null;
  onClose: () => void;
}

const RESOURCE_ICON: Record<ResourceType, LucideIcon> = {
  course: GraduationCap,
  video: PlayCircle,
  book: BookOpen,
  article: Newspaper,
};

const RESOURCE_LABEL: Record<ResourceType, string> = {
  course: "Course",
  video: "Video",
  book: "Book",
  article: "Article",
};

export default function SkillSheet({ skill, person, role, onClose }: Props) {
  if (!skill) return null;
  const level = getMastery(person, skill.id);
  const have = level > 0;
  const required = role?.requiredSkillIds.includes(skill.id);
  const nice = role?.niceToHaveSkillIds.includes(skill.id);
  const cat = categoryById[skill.category];
  const SkillIcon = skill.icon;
  const CatIcon = cat.icon;

  let status = "Not yet acquired";
  let tone = "opacity-70";
  if (have) {
    status = MASTERY_NAMES[level];
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
        className="w-full sm:max-w-md bg-[var(--bg-elev)] rounded-t-3xl sm:rounded-3xl p-5 border-t sm:border border-[var(--line)] shadow-2xl animate-pop-in max-h-[85vh] overflow-y-auto"
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

        {/* Mastery progress */}
        <div className="mt-4">
          <div className="text-[10px] uppercase tracking-wide opacity-65 mb-1.5 flex items-center justify-between">
            <span>Mastery</span>
            <span>{MASTERY_PERCENT[level]}%</span>
          </div>
          <MasteryBar level={level} color={cat.color} />
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

        {/* Resources */}
        {skill.resources && skill.resources.length > 0 && (
          <div className="mt-5">
            <div className="text-[10px] uppercase tracking-wide opacity-65 mb-2">
              Learn this skill
            </div>
            <div className="space-y-2">
              {skill.resources.map((r) => {
                const Icon = RESOURCE_ICON[r.type];
                return (
                  <a
                    key={r.url}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] hover:border-lavender-400 transition p-3 active:scale-[0.99]"
                  >
                    <div
                      className="h-9 w-9 rounded-lg grid place-items-center flex-shrink-0"
                      style={{ background: cat.color + "22", color: cat.color }}
                    >
                      <Icon size={18} strokeWidth={2.25} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] uppercase tracking-wide opacity-65">
                        {RESOURCE_LABEL[r.type]}
                      </div>
                      <div className="text-sm font-medium leading-tight truncate">
                        {r.title}
                      </div>
                    </div>
                    <ExternalLink
                      size={14}
                      strokeWidth={2.25}
                      className="flex-shrink-0 opacity-60"
                    />
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MasteryBar({ level, color }: { level: MasteryLevel; color: string }) {
  const labels: { level: MasteryLevel; name: string }[] = [
    { level: 0, name: "Locked" },
    { level: 1, name: "Practicing" },
    { level: 2, name: "Competent" },
    { level: 3, name: "Expert" },
  ];
  return (
    <div>
      <div className="h-2 rounded-full bg-[var(--bg)] overflow-hidden border border-[var(--line)]">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${MASTERY_PERCENT[level]}%`,
            background: color,
          }}
        />
      </div>
      <div className="mt-1.5 grid grid-cols-4 gap-1 text-[9px]">
        {labels.map((l) => (
          <div
            key={l.level}
            className={`text-center uppercase tracking-wide font-medium ${
              l.level === level ? "opacity-100" : "opacity-40"
            }`}
            style={l.level === level && level > 0 ? { color } : undefined}
          >
            {l.name}
          </div>
        ))}
      </div>
    </div>
  );
}
