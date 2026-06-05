import { Person, Role } from "./types";

function skillIdSet(person: Person): Set<string> {
  return new Set(person.skills.map((s) => s.id));
}

/** Greedy set-cover: pick people that cover the most uncovered required skills. */
export function suggestTeam(role: Role, people: Person[], maxSize = 4): Person[] {
  const required = new Set(role.requiredSkillIds);
  const chosen: Person[] = [];
  const covered = new Set<string>();
  const remaining = [...people];
  const personSkills = new Map(remaining.map((p) => [p.id, skillIdSet(p)] as const));

  while (covered.size < required.size && chosen.length < maxSize) {
    let best: Person | null = null;
    let bestGain = 0;
    for (const p of remaining) {
      const have = personSkills.get(p.id)!;
      let gain = 0;
      for (const skillId of have) {
        if (required.has(skillId) && !covered.has(skillId)) gain++;
      }
      if (gain > bestGain) {
        bestGain = gain;
        best = p;
      }
    }
    if (!best || bestGain === 0) break;
    chosen.push(best);
    for (const skillId of personSkills.get(best.id)!) {
      if (required.has(skillId)) covered.add(skillId);
    }
    remaining.splice(remaining.indexOf(best), 1);
  }
  return chosen;
}

export function coverage(role: Role, team: Person[]) {
  const required = role.requiredSkillIds;
  const covered = new Set<string>();
  team.forEach((p) =>
    p.skills.forEach((s) => {
      if (required.includes(s.id)) covered.add(s.id);
    })
  );
  return {
    coveredIds: covered,
    pct: required.length === 0 ? 1 : covered.size / required.length,
    missing: required.filter((id) => !covered.has(id)),
  };
}
