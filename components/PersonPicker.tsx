"use client";

import { Person } from "@/lib/types";

interface Props {
  people: Person[];
  selectedId?: string | null;
  onSelect: (p: Person) => void;
  compact?: boolean;
}

export default function PersonPicker({ people, selectedId, onSelect, compact }: Props) {
  if (compact) {
    return (
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {people.map((p) => {
          const isSelected = p.id === selectedId;
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              title={`${p.name} — ${p.currentRole}`}
              aria-label={p.name}
              className={`group rounded-2xl border p-2 text-left transition-all active:scale-[0.98] ${
                isSelected
                  ? "border-brand-500 bg-brand-50 dark:bg-brand-950 shadow-lg shadow-brand-500/10"
                  : "border-[var(--line)] bg-[var(--bg-elev)] hover:border-brand-400"
              }`}
            >
              <div
                className={`grid place-items-center rounded-full h-9 w-9 text-2xl mx-auto ${
                  isSelected ? "bg-brand-500/20" : "bg-[var(--bg)]"
                }`}
              >
                {p.avatar}
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {people.map((p) => {
        const isSelected = p.id === selectedId;
        return (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            title={`${p.name} — ${p.currentRole}`}
            aria-label={`${p.name}, ${p.currentRole}`}
            className={`group rounded-2xl border p-3 text-left transition-all active:scale-[0.98] ${
              isSelected
                ? "border-brand-500 bg-brand-50 dark:bg-brand-950 shadow-lg shadow-brand-500/10"
                : "border-[var(--line)] bg-[var(--bg-elev)] hover:border-brand-400"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`grid place-items-center rounded-full h-12 w-12 text-3xl flex-shrink-0 ${
                  isSelected ? "bg-brand-500/20" : "bg-[var(--bg)]"
                }`}
              >
                {p.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold leading-tight break-words">
                  {p.name}
                </div>
                <div className="text-[11px] opacity-70 mt-0.5 leading-tight break-words">
                  {p.currentRole}
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] opacity-65">
              <span>{p.yearsExperience} yrs</span>
              <span>{p.skillIds.length} skills</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
