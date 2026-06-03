import { Person, Role } from "./types";

/** Greedy set-cover: pick people that cover the most uncovered required skills. */
export function suggestTeam(role: Role, people: Person[], maxSize = 4): Person[] {
  const required = new Set(role.requiredSkillIds);
  const chosen: Person[] = [];
  const covered = new Set<string>();
  const remaining = [...people];

  while (covered.size < required.size && chosen.length < maxSize) {
    let best: Person | null = null;
    let bestGain = 0;
    for (const p of remaining) {
      const gain = p.skillIds.filter(
        (s) => required.has(s) && !covered.has(s)
      ).length;
      if (gain > bestGain) {
        bestGain = gain;
        best = p;
      }
    }
    if (!best || bestGain === 0) break;
    chosen.push(best);
    best.skillIds.forEach((s) => {
      if (required.has(s)) covered.add(s);
    });
    remaining.splice(remaining.indexOf(best), 1);
  }
  return chosen;
}

export function coverage(role: Role, team: Person[]) {
  const required = role.requiredSkillIds;
  const covered = new Set<string>();
  team.forEach((p) =>
    p.skillIds.forEach((s) => {
      if (required.includes(s)) covered.add(s);
    })
  );
  return {
    coveredIds: covered,
    pct: required.length === 0 ? 1 : covered.size / required.length,
    missing: required.filter((id) => !covered.has(id)),
  };
}
