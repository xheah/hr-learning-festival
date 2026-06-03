"use client";

import { getSkillGap } from "@/lib/data";
import { Person, Role } from "@/lib/types";

interface Props {
  person: Person;
  role: Role;
}

export default function RoadmapCard({ person, role }: Props) {
  const { acquired, missing, niceMissing, readiness } = getSkillGap(person, role);
  const pct = Math.round(readiness * 100);

  return (
    <div
      id="roadmap-card"
      className="relative overflow-hidden rounded-3xl border border-[var(--line)] bg-gradient-to-br from-brand-50 via-white to-brand-100 dark:from-brand-950 dark:via-[var(--bg-elev)] dark:to-brand-900 shadow-xl"
    >
      <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-brand-500/20 blur-2xl" />
      <div className="absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-brand-400/20 blur-2xl" />

      <div className="relative p-5">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] opacity-65">
          <span>Career Roadmap</span>
          <span>HR Learning Festival 2026</span>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-14 w-14 rounded-2xl bg-brand-500 text-white grid place-items-center text-3xl shadow-lg">
            {person.avatar}
          </div>
          <div>
            <div className="text-xl font-bold leading-tight">{person.name}</div>
            <div className="text-xs opacity-75">
              {person.currentRole} · {person.yearsExperience} yrs
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 text-sm">
          <span className="opacity-65">Targeting</span>
          <span className="font-semibold">{role.title}</span>
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-700 dark:text-brand-200 font-semibold">
            {pct}% ready
          </span>
        </div>

        <div className="mt-2 h-2 rounded-full bg-[var(--bg)] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/65 dark:bg-black/20 p-3 border border-[var(--line)]">
            <div className="text-[10px] uppercase tracking-wide opacity-65 mb-1.5">
              ✓ Already in your tree
            </div>
            <div className="space-y-1">
              {acquired.length === 0 && (
                <div className="text-xs opacity-60">Starting fresh!</div>
              )}
              {acquired.slice(0, 5).map((s) => (
                <div key={s.id} className="flex items-center gap-1.5 text-xs">
                  <span className="text-sm">{s.icon}</span>
                  <span className="truncate">{s.name}</span>
                </div>
              ))}
              {acquired.length > 5 && (
                <div className="text-[10px] opacity-60">
                  + {acquired.length - 5} more
                </div>
              )}
            </div>
          </div>
          <div className="rounded-2xl bg-white/65 dark:bg-black/20 p-3 border border-[var(--line)]">
            <div className="text-[10px] uppercase tracking-wide opacity-65 mb-1.5">
              → Next to learn
            </div>
            <div className="space-y-1">
              {missing.length === 0 && (
                <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                  You're ready! 🎉
                </div>
              )}
              {missing.slice(0, 5).map((s) => (
                <div key={s.id} className="flex items-center gap-1.5 text-xs">
                  <span className="text-sm">{s.icon}</span>
                  <span className="truncate">{s.name}</span>
                </div>
              ))}
              {missing.length > 5 && (
                <div className="text-[10px] opacity-60">
                  + {missing.length - 5} more
                </div>
              )}
            </div>
          </div>
        </div>

        {niceMissing.length > 0 && (
          <div className="mt-3 text-[11px] opacity-70">
            <span className="font-semibold">Bonus picks: </span>
            {niceMissing
              .slice(0, 3)
              .map((s) => `${s.icon} ${s.name}`)
              .join(" · ")}
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-[var(--line)] flex items-center justify-between text-[10px] opacity-65">
          <span>Generated at the HR Learning Festival booth</span>
          <span>Screenshot to keep ✨</span>
        </div>
      </div>
    </div>
  );
}
