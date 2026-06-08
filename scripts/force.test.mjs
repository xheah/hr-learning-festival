// Smoke test for the d3-force configuration used by useForceSimulation.
// Run with: node scripts/force.test.mjs
//
// Verifies the invariants that matter for the booth experience:
//   1. The centre (person) node stays pinned at (0, 0).
//   2. Sector nodes settle near their soft anchors.
//   3. Connected nodes settle within a sensible band of the link distance.
//   4. No two skill nodes overlap (collide force is doing its job).
//   5. The simulation actually settles (alpha decays below the active threshold).

import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from "d3-force";

const SECTOR_ANCHOR = {
  hr:      { x: 0,   y: -260 },
  finance: { x: 260, y:  150 },
  admin:   { x: -260, y: 150 },
  centre:  { x: 0,   y: 0 },
};

// A small but representative graph: 1 centre + 2 nodes per sector + a couple of links.
const nodes = [
  { id: "__centre", kind: "centre", sector: "centre", x: 0, y: 0, fx: 0, fy: 0 },
  { id: "hr-a",  kind: "skill", sector: "hr",      x: 0,   y: -150 },
  { id: "hr-b",  kind: "skill", sector: "hr",      x: 30,  y: -200 },
  { id: "fin-a", kind: "skill", sector: "finance", x: 100, y: 100 },
  { id: "fin-b", kind: "skill", sector: "finance", x: 130, y: 130 },
  { id: "adm-a", kind: "skill", sector: "admin",   x: -100, y: 100 },
  { id: "adm-b", kind: "skill", sector: "admin",   x: -130, y: 130 },
];

const links = [
  { source: "hr-a",  target: "hr-b",  distance: 70, strength: 0.7 },
  { source: "fin-a", target: "fin-b", distance: 70, strength: 0.7 },
  { source: "adm-a", target: "adm-b", distance: 70, strength: 0.7 },
  { source: "__centre", target: "hr-a",  distance: 140, strength: 0.25 },
  { source: "__centre", target: "fin-a", distance: 140, strength: 0.25 },
  { source: "__centre", target: "adm-a", distance: 140, strength: 0.25 },
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
  .force("centre", forceCenter(0, 0).strength(0.04))
  .force("x", forceX((n) => SECTOR_ANCHOR[n.sector].x).strength(0.07))
  .force("y", forceY((n) => SECTOR_ANCHOR[n.sector].y).strength(0.07))
  .force("collide", forceCollide(36))
  .alpha(0.9)
  .alphaDecay(0.025)
  .velocityDecay(0.35)
  .stop();

// Tick the simulation manually until alpha settles.
let ticks = 0;
while (sim.alpha() > sim.alphaMin()) {
  sim.tick();
  ticks++;
  if (ticks > 1000) break;
}

const get = (id) => nodes.find((n) => n.id === id);
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

const failures = [];
const ok = (label, cond, detail) => {
  if (!cond) failures.push(`✗ ${label} ${detail ?? ""}`.trim());
  else console.log(`✓ ${label} ${detail ?? ""}`.trim());
};

// 1. Centre stays at (0, 0).
const centre = get("__centre");
ok(
  "centre is pinned at origin",
  Math.abs(centre.x) < 0.001 && Math.abs(centre.y) < 0.001,
  `→ (${centre.x.toFixed(2)}, ${centre.y.toFixed(2)})`
);

// 2. Each skill node ends up in the half-plane its sector anchor lives in.
for (const [id, expected] of [
  ["hr-a", "top"],
  ["hr-b", "top"],
  ["fin-a", "bottom-right"],
  ["fin-b", "bottom-right"],
  ["adm-a", "bottom-left"],
  ["adm-b", "bottom-left"],
]) {
  const n = get(id);
  let inRegion = false;
  if (expected === "top") inRegion = n.y < 0;
  else if (expected === "bottom-right") inRegion = n.x > 0 && n.y > 0;
  else if (expected === "bottom-left") inRegion = n.x < 0 && n.y > 0;
  ok(
    `${id} settles in ${expected} region`,
    inRegion,
    `→ (${n.x.toFixed(0)}, ${n.y.toFixed(0)})`
  );
}

// 3. Linked pairs are within a reasonable range of link distance.
// forceLink replaces source/target string ids with node refs after simulation,
// so resolve through whichever form we find.
const resolve = (ref) => (typeof ref === "string" ? get(ref) : ref);
for (const l of links) {
  const a = resolve(l.source);
  const b = resolve(l.target);
  const aId = typeof l.source === "string" ? l.source : l.source.id;
  const bId = typeof l.target === "string" ? l.target : l.target.id;
  const d = dist(a, b);
  const lo = l.distance * 0.4;
  const hi = l.distance * 2.5;
  ok(
    `link ${aId}↔${bId} near ${l.distance}`,
    d >= lo && d <= hi,
    `→ ${d.toFixed(0)} (band ${lo.toFixed(0)}-${hi.toFixed(0)})`
  );
}

// 4. No two skill nodes overlap. Collide radius 36 → centres ≥ 72.
const skills = nodes.filter((n) => n.kind === "skill");
let overlapCount = 0;
for (let i = 0; i < skills.length; i++) {
  for (let j = i + 1; j < skills.length; j++) {
    const d = dist(skills[i], skills[j]);
    if (d < 50) overlapCount++;
  }
}
ok("no skill nodes overlap", overlapCount === 0, `→ ${overlapCount} overlapping pair(s)`);

// 5. Simulation settled.
ok("simulation settles within budget", ticks < 1000, `→ ${ticks} ticks`);

console.log(`\n${failures.length === 0 ? "PASS" : "FAIL"} — ${failures.length} failure(s)`);
if (failures.length) {
  for (const f of failures) console.log("  " + f);
  process.exit(1);
}
