"use client";

import { useMemo, useState } from "react";
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
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 snap-x">
          {roles.map((r) => {
            const active = r.id === role.id;
            return (
              <button
                key={r.id}
                onClick={() => selectRole(r)}
                className={`flex-shrink-0 snap-start rounded-full px-4 py-2 text-sm border transition ${
                  active
                    ? "border-brand-500 bg-brand-500 text-white shadow"
                    : "border-[var(--line)] bg-[var(--bg-elev)] hover:border-brand-400"
                }`}
              >
                {r.title}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg-elev)] p-4">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-sm font-semibold">{role.title}</div>
            <div className="text-xs opacity-70 mt-0.5">{role.description}</div>
          </div>
          <div className="text-sm font-bold text-brand-600 dark:text-brand-300">
            {Math.round(pct * 100)}%
          </div>
        </div>
        <div className="mt-3 h-2 rounded-full bg-[var(--bg)] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-500"
            style={{ width: `${Math.round(pct * 100)}%` }}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {role.requiredSkillIds.map((id) => {
            const s = skillsById[id];
            if (!s) return null;
            const cov = coveredIds.has(id);
            const cat = categoryById[s.category];
            return (
              <div
                key={id}
                className={`text-[11px] px-2 py-1 rounded-full flex items-center gap-1 border ${
                  cov
                    ? "border-transparent"
                    : "border-dashed border-[var(--line)] opacity-65"
                }`}
                style={cov ? { background: cat.color + "22", color: cat.color } : {}}
              >
                <span>{cov ? "✓" : "○"}</span>
                <span>{s.icon}</span>
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
          <div className="mt-3 text-xs font-medium text-green-600 dark:text-green-400">
            ✨ Every required skill is covered by this team.
          </div>
        )}
      </div>

      <div>
        <div className="text-xs uppercase tracking-wide opacity-65 mb-2">
          Tap to add or remove people · suggested team auto-loaded
        </div>
        <div className="space-y-2">
          {ranked.map(({ person: p, cover, unique, selected }) => (
            <button
              key={p.id}
              onClick={() => toggle(p)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition active:scale-[0.99] ${
                selected
                  ? "border-brand-500 bg-brand-50 dark:bg-brand-950 shadow-md shadow-brand-500/10"
                  : "border-[var(--line)] bg-[var(--bg-elev)] hover:border-brand-400"
              }`}
            >
              <div
                className={`h-11 w-11 rounded-full grid place-items-center text-2xl flex-shrink-0 ${
                  selected ? "bg-brand-500/20" : "bg-[var(--bg)]"
                }`}
              >
                {p.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold truncate">{p.name}</div>
                <div className="text-[11px] opacity-70 truncate">{p.currentRole}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs font-bold text-brand-600 dark:text-brand-300">
                  +{selected ? cover : unique}
                </div>
                <div className="text-[10px] opacity-65">
                  {selected ? "covers" : "would add"}
                </div>
              </div>
              <div
                className={`h-6 w-6 rounded-full grid place-items-center text-xs font-bold ${
                  selected
                    ? "bg-brand-500 text-white"
                    : "border border-[var(--line)] opacity-40"
                }`}
              >
                {selected ? "✓" : "+"}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
