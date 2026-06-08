// Smoke test for the d3-force configuration used by useForceSimulation.
// Run with: node scripts/force.test.mjs
//
// Verifies the invariants that matter for the booth experience:
//   1. The centre (person) node stays pinned at (0, 0).
//   2. The three sector hubs stay pinned at their label positions.
//   3. Every skill settles within reach of its sector hub (link force).
//   4. Linked-pair distance is in a sensible band around the target.
//   5. Skill nodes don't overlap (collide is doing its job).
//   6. The simulation actually settles in a reasonable budget.

import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
} from "d3-force";

const HUB_RADIUS = 280;
const HUB_POS = {
  hr:      { x: 0,                                              y: -HUB_RADIUS },
  finance: { x: Math.cos((30 * Math.PI) / 180) * HUB_RADIUS,    y: Math.sin((30 * Math.PI) / 180) * HUB_RADIUS },
  admin:   { x: Math.cos((150 * Math.PI) / 180) * HUB_RADIUS,   y: Math.sin((150 * Math.PI) / 180) * HUB_RADIUS },
  centre:  { x: 0,                                              y: 0 },
};
const LINK_DIST = 120;

const collideRadius = (n) => {
  if (n.kind === "sector") return 55;
  if (n.kind === "centre") return 50;
  return 36;
};

const nodes = [
  { id: "__centre", kind: "centre", sector: "centre", x: 0, y: 0, fx: 0, fy: 0 },
  // Three pinned sector hubs.
  { id: "hub_hr",      kind: "sector", sector: "hr",      x: HUB_POS.hr.x,      y: HUB_POS.hr.y,      fx: HUB_POS.hr.x,      fy: HUB_POS.hr.y },
  { id: "hub_finance", kind: "sector", sector: "finance", x: HUB_POS.finance.x, y: HUB_POS.finance.y, fx: HUB_POS.finance.x, fy: HUB_POS.finance.y },
  { id: "hub_admin",   kind: "sector", sector: "admin",   x: HUB_POS.admin.x,   y: HUB_POS.admin.y,   fx: HUB_POS.admin.x,   fy: HUB_POS.admin.y },
  // Two skills per sector, seeded somewhere arbitrary.
  { id: "hr-a",  kind: "skill", sector: "hr",      x: 30,  y: -150 },
  { id: "hr-b",  kind: "skill", sector: "hr",      x: -40, y: -120 },
  { id: "fin-a", kind: "skill", sector: "finance", x: 120, y: 80 },
  { id: "fin-b", kind: "skill", sector: "finance", x: 150, y: 130 },
  { id: "adm-a", kind: "skill", sector: "admin",   x: -120, y: 80 },
  { id: "adm-b", kind: "skill", sector: "admin",   x: -150, y: 130 },
];

const skillSector = Object.fromEntries(
  nodes.filter((n) => n.kind === "skill").map((n) => [n.id, n.sector])
);

const links = [
  // Sector hub → skill (primary spring)
  { source: "hub_hr",      target: "hr-a",  distance: LINK_DIST, strength: 0.55 },
  { source: "hub_hr",      target: "hr-b",  distance: LINK_DIST, strength: 0.55 },
  { source: "hub_finance", target: "fin-a", distance: LINK_DIST, strength: 0.55 },
  { source: "hub_finance", target: "fin-b", distance: LINK_DIST, strength: 0.55 },
  { source: "hub_admin",   target: "adm-a", distance: LINK_DIST, strength: 0.55 },
  { source: "hub_admin",   target: "adm-b", distance: LINK_DIST, strength: 0.55 },
  // Sample prereq
  { source: "hr-a",  target: "hr-b",  distance: 70, strength: 0.7 },
  { source: "fin-a", target: "fin-b", distance: 70, strength: 0.7 },
  { source: "adm-a", target: "adm-b", distance: 70, strength: 0.7 },
];

const sim = forceSimulation(nodes)
  .force("repel", forceManyBody().strength(-220))
  .force(
    "link",
    forceLink(links)
      .id((n) => n.id)
      .distance((l) => l.distance)
      .strength((l) => l.strength ?? 0.6)
  )
  .force("centre", forceCenter(0, 0).strength(0.02))
  .force("collide", forceCollide(collideRadius))
  .alpha(0.9)
  .alphaDecay(0.025)
  .velocityDecay(0.35)
  .stop();

let ticks = 0;
while (sim.alpha() > sim.alphaMin()) {
  sim.tick();
  ticks++;
  if (ticks > 1500) break;
}

const get = (id) => nodes.find((n) => n.id === id);
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

const failures = [];
const ok = (label, cond, detail) => {
  if (!cond) failures.push(`✗ ${label} ${detail ?? ""}`.trim());
  else console.log(`✓ ${label} ${detail ?? ""}`.trim());
};

// 1. Centre pinned.
const centre = get("__centre");
ok(
  "centre pinned at origin",
  Math.abs(centre.x) < 0.001 && Math.abs(centre.y) < 0.001,
  `→ (${centre.x.toFixed(2)}, ${centre.y.toFixed(2)})`
);

// 2. Each sector hub pinned exactly at its label position.
for (const sector of ["hr", "finance", "admin"]) {
  const hub = get(`hub_${sector}`);
  const target = HUB_POS[sector];
  ok(
    `${sector} hub pinned at label position`,
    Math.abs(hub.x - target.x) < 0.001 && Math.abs(hub.y - target.y) < 0.001,
    `→ (${hub.x.toFixed(1)}, ${hub.y.toFixed(1)}) target (${target.x.toFixed(1)}, ${target.y.toFixed(1)})`
  );
}

// 3. Every skill settles near its sector hub.
for (const id of ["hr-a", "hr-b", "fin-a", "fin-b", "adm-a", "adm-b"]) {
  const skill = get(id);
  const hub = get(`hub_${skillSector[id]}`);
  const d = dist(skill, hub);
  ok(
    `${id} close to ${skillSector[id]} hub`,
    d < 200,
    `→ ${d.toFixed(0)} units from hub`
  );
}

// 4. Sector links settle in a sensible band around their target distance.
const resolve = (ref) => (typeof ref === "string" ? get(ref) : ref);
for (const l of links) {
  if (l.distance !== LINK_DIST) continue;
  const a = resolve(l.source);
  const b = resolve(l.target);
  const d = dist(a, b);
  ok(
    `${typeof l.source === "string" ? l.source : l.source.id}↔${typeof l.target === "string" ? l.target : l.target.id} near ${LINK_DIST}`,
    d >= 50 && d <= 240,
    `→ ${d.toFixed(0)}`
  );
}

// 4b. Every skill stays inside the ±470 viewBox (no drift outside).
for (const id of ["hr-a", "hr-b", "fin-a", "fin-b", "adm-a", "adm-b"]) {
  const skill = get(id);
  const VIEWBOX = 470;
  const COLLIDE = 36;
  const insideX = Math.abs(skill.x) + COLLIDE <= VIEWBOX;
  const insideY = Math.abs(skill.y) + COLLIDE <= VIEWBOX;
  ok(
    `${id} inside viewBox`,
    insideX && insideY,
    `→ (${skill.x.toFixed(0)}, ${skill.y.toFixed(0)})`
  );
}

// 5. Skill-skill overlap check.
const skills = nodes.filter((n) => n.kind === "skill");
let overlapCount = 0;
for (let i = 0; i < skills.length; i++) {
  for (let j = i + 1; j < skills.length; j++) {
    const d = dist(skills[i], skills[j]);
    if (d < 50) overlapCount++;
  }
}
ok("no skill-skill overlap", overlapCount === 0, `→ ${overlapCount} pair(s)`);

// 6. Settled within budget.
ok("settles within budget", ticks < 1500, `→ ${ticks} ticks`);

console.log(`\n${failures.length === 0 ? "PASS" : "FAIL"} — ${failures.length} failure(s)`);
if (failures.length) {
  for (const f of failures) console.log("  " + f);
  process.exit(1);
}
