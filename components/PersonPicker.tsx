"use client";

import { Person } from "@/lib/types";

interface Props {
  people: Person[];
  selectedId?: string | null;
  onSelect: (p: Person) => void;
  compact?: boolean;
}

export default function PersonPicker({ people, selectedId, onSelect, compact }: Props) {
  return (
    <div
      className={`grid gap-2 ${
        compact ? "grid-cols-4 sm:grid-cols-8" : "grid-cols-2 sm:grid-cols-4"
      }`}
    >
      {people.map((p) => {
        const isSelected = p.id === selectedId;
        return (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            className={`group rounded-2xl border p-3 text-left transition-all active:scale-[0.98] ${
              isSelected
                ? "border-brand-500 bg-brand-50 dark:bg-brand-950 shadow-lg shadow-brand-500/10"
                : "border-[var(--line)] bg-[var(--bg-elev)] hover:border-brand-400"
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`grid place-items-center rounded-full transition ${
                  compact ? "h-8 w-8 text-xl" : "h-12 w-12 text-3xl"
                } ${isSelected ? "bg-brand-500/20" : "bg-[var(--bg)]"}`}
              >
                {p.avatar}
              </div>
              {!compact && (
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{p.name}</div>
                  <div className="text-[11px] opacity-70 truncate">
                    {p.currentRole}
                  </div>
                </div>
              )}
            </div>
            {!compact && (
              <div className="mt-2 flex items-center justify-between text-[11px] opacity-65">
                <span>{p.yearsExperience} yrs</span>
                <span>{p.skillIds.length} skills</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
