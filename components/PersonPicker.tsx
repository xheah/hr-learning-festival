"use client";

import { Trash2, UserPlus } from "lucide-react";
import { Person } from "@/lib/types";

interface Props {
  people: Person[];
  selectedId?: string | null;
  onSelect: (p: Person) => void;
  onCreate?: () => void;
  onRemove?: (p: Person) => void;
  /** ids that should render as "selected" without being the active person — used in Compare mode. */
  multiSelectedIds?: string[];
  compact?: boolean;
}

export default function PersonPicker({
  people,
  selectedId,
  onSelect,
  onCreate,
  onRemove,
  multiSelectedIds,
  compact,
}: Props) {
  const isMulti = (id: string) =>
    multiSelectedIds?.includes(id) ?? id === selectedId;

  if (compact) {
    return (
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {people.map((p) => {
          const isSelected = isMulti(p.id);
          const Icon = p.icon;
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              title={`${p.name} — ${p.currentRole}`}
              aria-label={p.name}
              className={`group rounded-2xl border p-2 transition-all active:scale-[0.98] ${
                isSelected
                  ? "border-lavender-500 bg-lavender-50 dark:bg-lavender-950 shadow-lg shadow-lavender-500/10"
                  : "border-[var(--line)] bg-[var(--bg-elev)] hover:border-lavender-400"
              }`}
            >
              <div
                className={`grid place-items-center rounded-full h-9 w-9 mx-auto ${
                  isSelected
                    ? "bg-lavender-500/20 text-lavender-700 dark:text-lavender-200"
                    : "bg-[var(--bg)]"
                }`}
              >
                <Icon size={18} strokeWidth={2.25} />
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {onCreate && (
        <button
          onClick={onCreate}
          className="group rounded-2xl border border-dashed border-lavender-400 bg-lavender-50/40 dark:bg-lavender-950/30 p-3 text-left transition-all active:scale-[0.98] hover:bg-lavender-50 dark:hover:bg-lavender-950/60 hover:border-lavender-500"
        >
          <div className="flex items-center gap-3">
            <div className="grid place-items-center rounded-full h-12 w-12 flex-shrink-0 bg-lavender-500/15 text-lavender-700 dark:text-lavender-200">
              <UserPlus size={22} strokeWidth={2.25} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold leading-tight">
                New Person
              </div>
              <div className="text-[11px] opacity-70 mt-0.5 leading-tight">
                Build your own tree
              </div>
            </div>
          </div>
          <div className="mt-3 text-[11px] opacity-65">
            Pick skills · choose mastery
          </div>
        </button>
      )}
      {people.map((p) => {
        const isSelected = isMulti(p.id);
        const Icon = p.icon;
        return (
          <div
            key={p.id}
            className={`group relative rounded-2xl border transition-all ${
              isSelected
                ? "border-lavender-500 bg-lavender-50 dark:bg-lavender-950 shadow-lg shadow-lavender-500/10"
                : "border-[var(--line)] bg-[var(--bg-elev)] hover:border-lavender-400"
            }`}
          >
            <button
              onClick={() => onSelect(p)}
              title={`${p.name} — ${p.currentRole}`}
              aria-label={`${p.name}, ${p.currentRole}`}
              className="w-full p-3 text-left active:scale-[0.98] transition rounded-2xl"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`grid place-items-center rounded-full h-12 w-12 flex-shrink-0 ${
                    isSelected
                      ? "bg-lavender-500/20 text-lavender-700 dark:text-lavender-200"
                      : "bg-[var(--bg)]"
                  }`}
                >
                  <Icon size={22} strokeWidth={2.25} />
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
                <span>{p.skills.length} skills</span>
              </div>
            </button>
            {onRemove && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    confirm(
                      p.custom
                        ? `Delete ${p.name}? This is permanent.`
                        : `Hide ${p.name} from the picker? You can restore them later.`
                    )
                  ) {
                    onRemove(p);
                  }
                }}
                aria-label={`Remove ${p.name}`}
                className="absolute top-2 right-2 h-7 w-7 rounded-full bg-[var(--bg)] border border-[var(--line)] grid place-items-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition hover:bg-red-50 hover:border-red-300 hover:text-red-600 dark:hover:bg-red-950"
              >
                <Trash2 size={13} strokeWidth={2.25} />
              </button>
            )}
            {p.custom && (
              <div className="absolute top-2 left-2 text-[9px] uppercase tracking-wide font-bold px-1.5 py-0.5 rounded bg-lavender-500/15 text-lavender-700 dark:text-lavender-200">
                You
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
