# Seed Data Reference

This app ships with a small, hand-crafted back-office org spanning **HR,
Finance and Admin** so the booth demo works the moment the QR code is
scanned. Everything lives in [`lib/data.ts`](lib/data.ts). This document
describes the schema so you can swap in real org data without touching any
UI code.

> The tree layout is **fully data-driven** — add or remove skills and the
> radial tree re-flows. The wedge geometry is derived from the number of
> sectors (currently 3), so adding a fourth sector is also seamless (see
> [Adding or removing sectors](#adding-or-removing-sectors) below).

---

## Sectors (top-level categories)

```ts
interface Category {
  id: CategoryId;     // 'hr' | 'finance' | 'admin'
  name: string;       // "Human Resources"
  short: string;      // "HR"  — used as the tree label
  color: string;      // hex, used for acquired skill fills and lines
  accent: string;     // softer hex, used for backgrounds
  icon: string;       // emoji
}
```

Three sectors ship by default — each gets its own 120° wedge in the radial
tree.

| ID        | Sector            |
| --------- | ----------------- |
| `hr`      | Human Resources   |
| `finance` | Finance           |
| `admin`   | Administration    |

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

- **Tier 1 — Foundational.** Most early-career people in this sector will
  have these. Sits closest to the centre. Aim for 2–3 per sector.
- **Tier 2 — Intermediate.** Mid-level capability built on the foundations.
  Aim for 4–6 per sector.
- **Tier 3 — Advanced.** Strategic / leadership-level. Sits at the edge.
  Aim for 3–4 per sector.

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
potential) and one senior leader (a near-full tree). Spread them across
the three sectors so the team builder has something interesting to do —
the seed ships with 3 HR, 3 Finance, and 2 Admin people.

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
  department: string;        // shown as a small tag, e.g. "HR" / "Finance" / "Admin"
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

## Adding or removing sectors

The wedge arc and anchor angles are derived from `categories.length` in
[`components/SkillTree.tsx`](components/SkillTree.tsx) (`WEDGE_ARC = 360 /
categories.length`), so adding or removing a sector is a one-step change:

1. Add or remove a `Category` entry in the `categories` array in
   [`lib/data.ts`](lib/data.ts) — give it an `id`, `color`, `icon`, and a short
   label that fits in the outer ring.
2. (Optional) Update `CategoryId` in [`lib/types.ts`](lib/types.ts) for type
   safety on the new sector id.

The viewBox is generous enough for 3–6 sectors; if you go beyond that the
outer labels may need re-positioning.

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
