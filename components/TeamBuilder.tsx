"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
  Plus,
  Sparkles,
} from "lucide-react";
import { people, roles, skillsById, categoryById } from "@/lib/data";
import { coverage, suggestTeam } from "@/lib/team";
import { Person, Role } from "@/lib/types";

export default function TeamBuilder() {
  const [role, setRole] = useState<Role>(roles[0]);
  const [team, setTeam] = useState<Person[]>(() => suggestTeam(roles[0], people));

  const { coveredIds, pct, missing } = useMemo(
    () => coverage(role, team),
    [role, team]
  );

  const selectRole = (r: Role) => {
    setRole(r);
    setTeam(suggestTeam(r, people));
  };

  const toggle = (p: Person) => {
    setTeam((prev) =>
      prev.find((x) => x.id === p.id) ? prev.filter((x) => x.id !== p.id) : [...prev, p]
    );
  };

  const ranked = useMemo(() => {
    const teamIds = new Set(team.map((p) => p.id));
    const required = new Set(role.requiredSkillIds);
    return [...people]
      .map((p) => {
        const cover = p.skillIds.filter((s) => required.has(s)).length;
        const unique = p.skillIds.filter(
          (s) => required.has(s) && !coveredIds.has(s)
        ).length;
        return { person: p, cover, unique, selected: teamIds.has(p.id) };
      })
      .sort((a, b) => {
        if (a.selected !== b.selected) return a.selected ? -1 : 1;
        if (b.unique !== a.unique) return b.unique - a.unique;
        return b.cover - a.cover;
      });
  }, [team, role, coveredIds]);

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs uppercase tracking-wide opacity-65 mb-2">
          Project goal · pick a role to staff
        </div>
        <RoleScroller roles={roles} activeId={role.id} onSelect={selectRole} />
      </div>

      <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg-elev)] p-4">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-sm font-semibold">{role.title}</div>
            <div className="text-xs opacity-70 mt-0.5">{role.description}</div>
          </div>
          <div className="text-sm font-bold text-lavender-700 dark:text-lavender-200">
            {Math.round(pct * 100)}%
          </div>
        </div>
        <div className="mt-3 h-2 rounded-full bg-[var(--bg)] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-lavender-400 to-lavender-600 transition-all duration-500"
            style={{ width: `${Math.round(pct * 100)}%` }}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {role.requiredSkillIds.map((id) => {
            const s = skillsById[id];
            if (!s) return null;
            const cov = coveredIds.has(id);
            const cat = categoryById[s.category];
            const Icon = s.icon;
            return (
              <div
                key={id}
                title={s.name}
                className={`text-[11px] px-2 py-1 rounded-full flex items-center gap-1.5 border ${
                  cov
                    ? "border-transparent"
                    : "border-dashed border-[var(--line)] opacity-65"
                }`}
                style={cov ? { background: cat.color + "22", color: cat.color } : {}}
              >
                {cov ? (
                  <Check size={11} strokeWidth={3} />
                ) : (
                  <Circle size={9} strokeWidth={2} />
                )}
                <Icon size={12} strokeWidth={2.25} />
                <span>{s.name}</span>
              </div>
            );
          })}
        </div>
        {missing.length > 0 && (
          <div className="mt-3 text-[11px] opacity-65">
            Still uncovered: <span className="font-semibold">{missing.length}</span> skill
            {missing.length === 1 ? "" : "s"}
          </div>
        )}
        {missing.length === 0 && (
          <div className="mt-3 text-xs font-medium text-green-600 dark:text-green-400 inline-flex items-center gap-1.5">
            <Sparkles size={13} strokeWidth={2.5} />
            <span>Every required skill is covered by this team.</span>
          </div>
        )}
      </div>

      <div>
        <div className="text-xs uppercase tracking-wide opacity-65 mb-2">
          Tap to add or remove people · suggested team auto-loaded
        </div>
        <div className="space-y-2">
          {ranked.map(({ person: p, cover, unique, selected }) => {
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => toggle(p)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition active:scale-[0.99] ${
                  selected
                    ? "border-lavender-500 bg-lavender-50 dark:bg-lavender-950 shadow-md shadow-lavender-500/10"
                    : "border-[var(--line)] bg-[var(--bg-elev)] hover:border-lavender-400"
                }`}
              >
                <div
                  className={`h-11 w-11 rounded-full grid place-items-center flex-shrink-0 ${
                    selected
                      ? "bg-lavender-500/20 text-lavender-700 dark:text-lavender-200"
                      : "bg-[var(--bg)]"
                  }`}
                >
                  <Icon size={22} strokeWidth={2.25} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold truncate">{p.name}</div>
                  <div className="text-[11px] opacity-70 truncate">{p.currentRole}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-bold text-lavender-700 dark:text-lavender-200">
                    +{selected ? cover : unique}
                  </div>
                  <div className="text-[10px] opacity-65">
                    {selected ? "covers" : "would add"}
                  </div>
                </div>
                <div
                  className={`h-6 w-6 rounded-full grid place-items-center ${
                    selected
                      ? "bg-lavender-500 text-white"
                      : "border border-[var(--line)] opacity-40"
                  }`}
                >
                  {selected ? (
                    <Check size={13} strokeWidth={3} />
                  ) : (
                    <Plus size={13} strokeWidth={2.75} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Role scroller ────────────────────────────────────────────────────────
// Horizontal scroller for role pills with arrow buttons instead of a native
// scrollbar. Arrows fade out at the scroll edges so visitors know when
// there's nothing more to reveal.

interface RoleScrollerProps {
  roles: Role[];
  activeId: string;
  onSelect: (r: Role) => void;
}

function RoleScroller({ roles, activeId, onSelect }: RoleScrollerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateEdges = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 2);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateEdges();
    el.addEventListener("scroll", updateEdges, { passive: true });
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      ro.disconnect();
    };
  }, []);

  const scrollBy = (dx: number) => {
    trackRef.current?.scrollBy({ left: dx, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <button
        onClick={() => scrollBy(-220)}
        aria-label="Scroll roles left"
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full border border-[var(--line)] bg-[var(--bg-elev)] grid place-items-center shadow-sm transition-opacity ${
          canLeft ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <ChevronLeft size={18} strokeWidth={2.25} />
      </button>
      <div
        ref={trackRef}
        className="flex gap-2 overflow-x-auto hide-scrollbar px-10 py-1"
      >
        {roles.map((r) => {
          const active = r.id === activeId;
          return (
            <button
              key={r.id}
              onClick={() => onSelect(r)}
              className={`flex-shrink-0 rounded-full px-4 py-2 text-sm border transition ${
                active
                  ? "border-lavender-500 bg-lavender-500 text-white shadow"
                  : "border-[var(--line)] bg-[var(--bg-elev)] hover:border-lavender-400"
              }`}
            >
              {r.title}
            </button>
          );
        })}
      </div>
      <button
        onClick={() => scrollBy(220)}
        aria-label="Scroll roles right"
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full border border-[var(--line)] bg-[var(--bg-elev)] grid place-items-center shadow-sm transition-opacity ${
          canRight ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <ChevronRight size={18} strokeWidth={2.25} />
      </button>
    </div>
  );
}
