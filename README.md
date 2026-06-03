# Skill Tree · HR Learning Festival

A mobile-first, client-side webapp for the HR Learning Festival booth. Visitors
scan a QR code, pick a person from a small HR org, explore their skill tree,
set a career goal, and walk away with a screenshot-able Career Roadmap. HR
folks can also flip to **Team mode** and stage a complementary team for a
project goal.

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and a hand-rolled
SVG skill-tree renderer. No backend, no API calls — all data is pre-seeded.

---

## What's inside

- **My Tree** — radial skill tree per person, with category wedges for People
  Ops, Talent, L&D, Comp & Ben, HR Tech, and Leadership. Tier 1 skills sit close
  to the centre; tier 3 sits at the edge. Acquired skills are filled and
  connected by solid lines; gap skills are dashed and faded.
- **Career goal** — pick a target role and the tree lights up which required
  skills you already have versus the ones you still need.
- **Career Roadmap card** — a polished, screenshot-friendly takeaway with
  readiness percentage, skills already earned, and the next ones to learn.
- **Team Builder** — pick a role to staff, the app greedily suggests a
  complementary squad, and you can toggle people in/out to see the requirements
  coverage update live.
- **Dark / light mode** with a system-preference default.

The whole interaction is designed to take ~30 seconds at the booth.

---

## Quickstart

Requires Node 18+ and npm (or pnpm/yarn).

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

### Production build

```bash
npm run build
npm start
```

### Deploying to Vercel

The app is a stock Next.js 14 project — push to a Git repo and import it on
Vercel, no env vars or build customisation needed. Vercel will detect Next.js
and use the defaults. The free Hobby tier is plenty for booth traffic.

For the QR code, generate one pointing at your deployed URL (e.g. with
`qrencode -o booth-qr.png "https://your-domain.vercel.app"`). Print it large.

---

## Project layout

```
app/
  layout.tsx          # Root layout, theme bootstrap, metadata
  page.tsx            # Main state-driven page (Explorer / Team modes)
  globals.css         # Theme variables, Tailwind, custom keyframes

components/
  SkillTree.tsx       # SVG radial tree renderer
  PersonPicker.tsx    # Grid of people you can switch to
  RolePicker.tsx      # List of target roles
  SkillSheet.tsx      # Bottom sheet showing one skill's details
  RoadmapCard.tsx     # The shareable takeaway card
  TeamBuilder.tsx     # Project-staffing view
  ThemeToggle.tsx     # Light/dark toggle

lib/
  types.ts            # Skill / Person / Role / Category types
  data.ts             # All seed data (people, skills, roles) + helpers
  team.ts             # Greedy set-cover team suggestion
```

---

## Swapping in real org data

All seed data lives in [`lib/data.ts`](lib/data.ts). The schema is documented
in [`SEED_DATA.md`](SEED_DATA.md). Edit the `categories`, `skills`, `people`,
and `roles` arrays — no other file changes are needed. The tree layout adapts
automatically to however many skills sit in each category.

If you want this to read from a real backend later, the cleanest seam is
`lib/data.ts` — replace the exported arrays with a fetch + cache layer.

---

## Performance notes

- All data ships in the JS bundle — total page weight is small (well under
  100KB gzipped of app code on top of Next's runtime).
- The tree is pure SVG, no canvas, no heavy graph library.
- No client-side fetch on first paint; the whole booth flow works offline once
  loaded.

---

## Credits

A booth demo for the **HR Learning Festival 2026**, exhibiting Claude Routines
use cases for people teams.
