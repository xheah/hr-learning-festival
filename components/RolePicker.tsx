"use client";

import { Role } from "@/lib/types";

interface Props {
  roles: Role[];
  selectedId?: string | null;
  onSelect: (r: Role | null) => void;
}

export default function RolePicker({ roles, selectedId, onSelect }: Props) {
  return (
    <div className="space-y-2">
      <button
        onClick={() => onSelect(null)}
        className={`w-full rounded-xl border p-3 text-left transition ${
          !selectedId
            ? "border-lavender-500 bg-lavender-50 dark:bg-lavender-950"
            : "border-[var(--line)] bg-[var(--bg-elev)]"
        }`}
      >
        <div className="text-sm font-semibold">No goal yet</div>
        <div className="text-[11px] opacity-70">
          Just show me my current skills
        </div>
      </button>
      {roles.map((r) => {
        const isSelected = r.id === selectedId;
        return (
          <button
            key={r.id}
            onClick={() => onSelect(r)}
            className={`w-full rounded-xl border p-3 text-left transition active:scale-[0.99] ${
              isSelected
                ? "border-lavender-500 bg-lavender-50 dark:bg-lavender-950 shadow-lg shadow-lavender-500/10"
                : "border-[var(--line)] bg-[var(--bg-elev)] hover:border-lavender-400"
            }`}
          >
            <div className="flex items-baseline justify-between gap-2">
              <div className="text-sm font-semibold">{r.title}</div>
              <div className="text-[10px] uppercase tracking-wide opacity-60">
                {r.department}
              </div>
            </div>
            <div className="text-[12px] opacity-75 mt-1 leading-snug">
              {r.description}
            </div>
            <div className="text-[11px] opacity-60 mt-1.5">
              {r.requiredSkillIds.length} required ·{" "}
              {r.niceToHaveSkillIds.length} nice-to-have
            </div>
          </button>
        );
      })}
    </div>
  );
}
