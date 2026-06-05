"use client";

import { useState } from "react";
import { ArrowRightLeft, X } from "lucide-react";
import { getMastery, skillsById, categoryById } from "@/lib/data";
import { Person } from "@/lib/types";
import SkillTree from "./SkillTree";
import PersonPicker from "./PersonPicker";

interface Props {
  people: Person[];
}

export default function CompareView({ people }: Props) {
  const [a, setA] = useState<Person | null>(people[0] ?? null);
  const [b, setB] = useState<Person | null>(people[1] ?? people[0] ?? null);
  const [picking, setPicking] = useState<"a" | "b" | null>(null);

  const aIds = new Set(a?.skills.map((s) => s.id) ?? []);
  const bIds = new Set(b?.skills.map((s) => s.id) ?? []);

  const both: string[] = [];
  const onlyA: string[] = [];
  const onlyB: string[] = [];
  const universe = new Set<string>([...aIds, ...bIds]);
  for (const id of universe) {
    const inA = aIds.has(id);
    const inB = bIds.has(id);
    if (inA && inB) both.push(id);
    else if (inA) onlyA.push(id);
    else onlyB.push(id);
  }

  if (!a || !b) {
    return (
      <div className="text-sm opacity-70">
        Need at least one person to compare. Create one in My Tree mode.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
        <PersonChip person={a} onTap={() => setPicking("a")} side="a" />
        <button
          onClick={() => {
            setA(b);
            setB(a);
          }}
          className="h-9 w-9 rounded-full border border-[var(--line)] bg-[var(--bg-elev)] grid place-items-center hover:border-lavender-400 transition"
          aria-label="Swap"
        >
          <ArrowRightLeft size={15} strokeWidth={2.25} />
        </button>
        <PersonChip person={b} onTap={() => setPicking("b")} side="b" />
      </div>

      {/* Trees side by side */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg-elev)] overflow-hidden aspect-square">
          <SkillTree person={a} noEntranceAnimation />
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg-elev)] overflow-hidden aspect-square">
          <SkillTree person={b} noEntranceAnimation />
        </div>
      </div>

      {/* Coverage summary */}
      <div className="grid grid-cols-3 gap-2">
        <SummaryBox
          label="Both share"
          ids={both}
          tone="lavender"
          empty="No overlap yet."
        />
        <SummaryBox
          label={`Only ${a.name.split(" ")[0]}`}
          ids={onlyA}
          tone="a"
          empty="Nothing unique."
        />
        <SummaryBox
          label={`Only ${b.name.split(" ")[0]}`}
          ids={onlyB}
          tone="b"
          empty="Nothing unique."
        />
      </div>

      {picking !== null && (
        <div
          className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in"
          onClick={() => setPicking(null)}
        >
          <div
            className="w-full sm:max-w-lg bg-[var(--bg-elev)] rounded-t-3xl sm:rounded-3xl p-5 border-t sm:border border-[var(--line)] shadow-2xl animate-pop-in max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-bold">
                Pick the {picking === "a" ? "first" : "second"} person
              </div>
              <button
                onClick={() => setPicking(null)}
                aria-label="Close"
                className="h-8 w-8 rounded-full bg-[var(--bg)] grid place-items-center opacity-70 hover:opacity-100"
              >
                <X size={16} strokeWidth={2.25} />
              </button>
            </div>
            <PersonPicker
              people={people}
              selectedId={picking === "a" ? a.id : b.id}
              multiSelectedIds={[a.id, b.id]}
              onSelect={(p) => {
                if (picking === "a") setA(p);
                else setB(p);
                setPicking(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function PersonChip({
  person,
  onTap,
  side,
}: {
  person: Person;
  onTap: () => void;
  side: "a" | "b";
}) {
  const Icon = person.icon;
  const tone =
    side === "a"
      ? "border-lavender-500 bg-lavender-50/60 dark:bg-lavender-950/40 text-lavender-700 dark:text-lavender-200"
      : "border-[#dda448] bg-[#fdf2dc] dark:bg-[#3a2a14] text-[#8a5e1e] dark:text-[#f4c87c]";
  return (
    <button
      onClick={onTap}
      className={`rounded-2xl border px-3 py-2 text-left active:scale-[0.98] transition ${tone}`}
    >
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-full bg-white/50 dark:bg-black/30 grid place-items-center flex-shrink-0">
          <Icon size={18} strokeWidth={2.25} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] uppercase tracking-wide opacity-70">
            {side === "a" ? "Person A" : "Person B"}
          </div>
          <div className="text-sm font-semibold truncate">{person.name}</div>
        </div>
      </div>
    </button>
  );
}

function SummaryBox({
  label,
  ids,
  tone,
  empty,
}: {
  label: string;
  ids: string[];
  tone: "lavender" | "a" | "b";
  empty: string;
}) {
  const toneClass =
    tone === "lavender"
      ? "border-lavender-500/60 bg-lavender-50/40 dark:bg-lavender-950/30"
      : tone === "a"
        ? "border-lavender-400/60 bg-[var(--bg-elev)]"
        : "border-[#dda448]/60 bg-[var(--bg-elev)]";
  return (
    <div
      className={`rounded-2xl border ${toneClass} p-2 min-h-[100px] flex flex-col`}
    >
      <div className="text-[9px] uppercase tracking-wide font-bold opacity-65">
        {label}
      </div>
      <div className="text-[10px] font-bold mt-0.5">
        {ids.length} skill{ids.length === 1 ? "" : "s"}
      </div>
      <div className="mt-1.5 space-y-0.5 flex-1 overflow-y-auto">
        {ids.length === 0 && (
          <div className="text-[10px] opacity-60">{empty}</div>
        )}
        {ids.slice(0, 6).map((id) => {
          const s = skillsById[id];
          if (!s) return null;
          const cat = categoryById[s.category];
          const Icon = s.icon;
          return (
            <div
              key={id}
              className="flex items-center gap-1 text-[10px]"
              style={{ color: cat.darkColor }}
            >
              <Icon size={9} strokeWidth={2.25} />
              <span className="truncate">{s.name}</span>
            </div>
          );
        })}
        {ids.length > 6 && (
          <div className="text-[9px] opacity-60">+ {ids.length - 6} more</div>
        )}
      </div>
    </div>
  );
}
