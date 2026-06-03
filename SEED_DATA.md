# Seed Data Reference

This app ships with a small, hand-crafted HR org so the booth demo works the
moment the QR code is scanned. Everything lives in
[`lib/data.ts`](lib/data.ts). This document describes the schema so you can
swap in real org data without touching any UI code.

> The tree layout is **fully data-driven** — add or remove skills and the
> radial tree re-flows. Just stay within the six categories (or extend them, see
> below).

---

## Categories

```ts
interface Category {
  id: CategoryId;     // 'people-ops' | 'talent' | ...
  name: string;       // "People Operations"
  short: string;      // "People Ops"  — used as the tree label
  color: string;      // hex, used for acquired skill fills and lines
  accent: string;     // softer hex, used for backgrounds
  icon: string;       // emoji
}
```

Six categories ship by default — each gets its own 60° wedge in the radial
tree. If you change the count, also adjust the wedge geometry in
`components/SkillTree.tsx` (look for `wedgeArc = 60` and the `-90 + 60 * ci`
anchor calculation).

| ID            | Domain                    |
| ------------- | ------------------------- |
| `people-ops`  | People Operations         |
| `talent`      | Talent Acquisition        |
| `learning`    | Learning & Development    |
| `comp`        | Compensation & Benefits   |
| `tech`        | HR Tech & Analytics       |
| `leadership`  | Leadership & Strategy     |

---

## Skills

```ts
interface Skill {
  id: string;          // unique, kebab-case, used everywhere
  name: string;        // shown under the node, e.g. "Structured Interviewing"
  category: CategoryId;
  description: string; // shown in the skill detail sheet
  icon: string;        // single emoji, shown inside the node circle
  tier: 1 | 2 | 3;     // distance from the centre of the tree
  prerequisites?: string[];  // ids of other skills, draws a connecting line
}
```

**Tier guidance**

- **Tier 1 — Foundational.** Most early-career people in this domain will
  have these. Sits closest to the centre. Aim for 1–2 per category.
- **Tier 2 — Intermediate.** Mid-level capability built on the foundations.
  Aim for 2–4 per category.
- **Tier 3 — Advanced.** Strategic / leadership-level. Sits at the edge.
  Aim for 1–2 per category.

**Prerequisites** are visual — they draw a curved line between skills. They
do **not** prevent someone from having a tier-3 skill without a tier-1; they
just signal natural progression on the tree. Keep the graph mostly acyclic for
readability.

---

## People

```ts
interface Person {
  id: string;            // kebab-case, e.g. "amara"
  name: string;          // display name
  currentRole: string;   // shown under the avatar, e.g. "L&D Specialist"
  yearsExperience: number;
  avatar: string;        // emoji
  bio: string;           // 1-line bio
  skillIds: string[];    // ids from the `skills` array — what they already have
}
```

Aim for ~6–10 people for the booth so the picker stays scannable. Mix
seniority: at least one early-career person (a small tree to show growth
potential) and one senior leader (a near-full tree).

Each person's `skillIds` list defines what's filled in on their tree. Don't
worry about including every prerequisite — the tree shows the prerequisite
line whether or not they've claimed the prereq, and gaps are part of the
story.

---

## Roles (career goals & project targets)

```ts
interface Role {
  id: string;
  title: string;             // e.g. "HR Business Partner"
  department: string;        // shown as a small tag
  description: string;       // 1-sentence pitch
  requiredSkillIds: string[];   // must-haves to be considered ready
  niceToHaveSkillIds: string[]; // boosts, marked separately in the UI
}
```

Roles power two flows:

1. **My Tree → Set a goal** — picks one role as the visitor's target. The
   tree highlights matches and gaps; the readiness percentage equals
   `acquired / required`.
2. **Team Builder** — picks one role as the project's required skill set.
   The greedy set-cover algorithm in [`lib/team.ts`](lib/team.ts) chooses
   the fewest people that together cover the required skills.

Keep `requiredSkillIds` to 5–8 entries per role. Anything more makes the
team-builder feel impossible.

---

## Adding or removing categories

If you want to add a 7th category:

1. Add the new `Category` entry to the `categories` array in `data.ts`.
2. In [`components/SkillTree.tsx`](components/SkillTree.tsx) update:
   - `wedgeArc = 60` → `360 / N`
   - `anchorAngle = -90 + 60 * ci` → `-90 + (360 / N) * ci`
3. The viewBox is already generous; you shouldn't need to change it.

---

## Replacing this with a real backend later

The seam is `lib/data.ts`. Currently it exports plain TypeScript arrays.
To wire in a real source:

- Replace the arrays with `async` functions returning the same types.
- Push a fetch + cache layer in front (e.g. React Server Components, SWR,
  `cache()` from `react`).
- Components currently consume the arrays as imports — switch to props or
  a server-side data fetch in `app/page.tsx`.

Nothing in the components themselves depends on the data being synchronous;
they all receive `Person`, `Role`, or `Skill` objects via props.
