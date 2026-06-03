import { Category, Person, Role, Skill } from "./types";

export const categories: Category[] = [
  {
    id: "people-ops",
    name: "People Operations",
    short: "People Ops",
    color: "#22c55e",
    accent: "#bbf7d0",
    icon: "🤝",
  },
  {
    id: "talent",
    name: "Talent Acquisition",
    short: "Talent",
    color: "#f97316",
    accent: "#fed7aa",
    icon: "🎯",
  },
  {
    id: "learning",
    name: "Learning & Development",
    short: "L&D",
    color: "#8b5cf6",
    accent: "#ddd6fe",
    icon: "📚",
  },
  {
    id: "comp",
    name: "Compensation & Benefits",
    short: "Comp & Ben",
    color: "#06b6d4",
    accent: "#a5f3fc",
    icon: "💎",
  },
  {
    id: "tech",
    name: "HR Tech & Analytics",
    short: "HR Tech",
    color: "#ec4899",
    accent: "#fbcfe8",
    icon: "📊",
  },
  {
    id: "leadership",
    name: "Leadership & Strategy",
    short: "Leadership",
    color: "#eab308",
    accent: "#fef08a",
    icon: "🧭",
  },
];

export const skills: Skill[] = [
  // ─── People Ops ─────────────────────────────────────────────
  { id: "onboarding", name: "Onboarding", category: "people-ops", icon: "🌱", tier: 1, description: "Designing the first 90 days so new joiners feel set up to thrive." },
  { id: "hr-compliance", name: "HR Compliance", category: "people-ops", icon: "📋", tier: 1, description: "Statutory employment basics and policy hygiene." },
  { id: "employee-relations", name: "Employee Relations", category: "people-ops", icon: "💬", tier: 2, description: "Navigating tough conversations and grievances.", prerequisites: ["hr-compliance"] },
  { id: "conflict-resolution", name: "Conflict Resolution", category: "people-ops", icon: "🕊️", tier: 2, description: "Mediating workplace disputes constructively.", prerequisites: ["employee-relations"] },
  { id: "policy-design", name: "Policy Design", category: "people-ops", icon: "📜", tier: 3, description: "Authoring policy that scales with the org.", prerequisites: ["hr-compliance", "employee-relations"] },
  { id: "offboarding", name: "Offboarding", category: "people-ops", icon: "👋", tier: 2, description: "Graceful exits with strong alumni signals.", prerequisites: ["onboarding"] },

  // ─── Talent ─────────────────────────────────────────────────
  { id: "sourcing", name: "Sourcing", category: "talent", icon: "🔎", tier: 1, description: "Finding candidates beyond inbound applicants." },
  { id: "interviewing", name: "Structured Interviewing", category: "talent", icon: "🗣️", tier: 1, description: "Calibrated, bias-aware interviews." },
  { id: "ats-tools", name: "ATS Tooling", category: "talent", icon: "🗂️", tier: 1, description: "Running pipelines in Greenhouse / Lever / Workday." },
  { id: "candidate-assessment", name: "Assessment Design", category: "talent", icon: "🧪", tier: 2, description: "Predictive take-homes, work-samples, scorecards.", prerequisites: ["interviewing"] },
  { id: "employer-branding", name: "Employer Branding", category: "talent", icon: "✨", tier: 2, description: "Telling a story candidates want to be part of.", prerequisites: ["sourcing"] },
  { id: "diversity-hiring", name: "Inclusive Hiring", category: "talent", icon: "🌍", tier: 3, description: "Removing barriers across the pipeline.", prerequisites: ["candidate-assessment", "employer-branding"] },

  // ─── Learning & Development ─────────────────────────────────
  { id: "facilitation", name: "Facilitation", category: "learning", icon: "🎤", tier: 1, description: "Running workshops people actually enjoy." },
  { id: "training-design", name: "Training Design", category: "learning", icon: "🛠️", tier: 2, description: "Outcome-driven curriculum and lesson plans.", prerequisites: ["facilitation"] },
  { id: "coaching", name: "Coaching", category: "learning", icon: "🧠", tier: 2, description: "1:1 development conversations that move the needle." },
  { id: "skills-assessment", name: "Skills Assessment", category: "learning", icon: "📐", tier: 2, description: "Diagnosing where someone is on a competency map." },
  { id: "learning-tech", name: "Learning Tech / LMS", category: "learning", icon: "💻", tier: 2, description: "Running an LMS and digital learning stack.", prerequisites: ["training-design"] },
  { id: "learning-strategy", name: "L&D Strategy", category: "learning", icon: "🗺️", tier: 3, description: "Connecting learning investments to business outcomes.", prerequisites: ["training-design", "skills-assessment"] },

  // ─── Comp & Ben ─────────────────────────────────────────────
  { id: "payroll-admin", name: "Payroll Admin", category: "comp", icon: "💸", tier: 1, description: "Accurate, on-time, statutorily-correct payroll." },
  { id: "benefits-design", name: "Benefits Design", category: "comp", icon: "🩺", tier: 2, description: "Building a benefits stack that resonates.", prerequisites: ["payroll-admin"] },
  { id: "comp-benchmarking", name: "Comp Benchmarking", category: "comp", icon: "⚖️", tier: 2, description: "Pegging pay to live market data." },
  { id: "equity-planning", name: "Equity Planning", category: "comp", icon: "📈", tier: 3, description: "Designing equity programmes for growth-stage orgs.", prerequisites: ["comp-benchmarking"] },
  { id: "total-rewards", name: "Total Rewards Strategy", category: "comp", icon: "🏆", tier: 3, description: "End-to-end rewards philosophy.", prerequisites: ["benefits-design", "comp-benchmarking"] },

  // ─── HR Tech & Analytics ────────────────────────────────────
  { id: "hris-systems", name: "HRIS Systems", category: "tech", icon: "🗃️", tier: 1, description: "Workday / BambooHR / HiBob administration." },
  { id: "data-viz", name: "Data Visualisation", category: "tech", icon: "📉", tier: 2, description: "Telling stories with people data.", prerequisites: ["hris-systems"] },
  { id: "people-analytics", name: "People Analytics", category: "tech", icon: "🔬", tier: 2, description: "Hypothesis-driven analysis on workforce data.", prerequisites: ["data-viz"] },
  { id: "automation", name: "HR Automation", category: "tech", icon: "⚙️", tier: 2, description: "Scripting, no-code flows, Claude routines." },
  { id: "workforce-planning", name: "Workforce Planning", category: "tech", icon: "🧮", tier: 3, description: "Forecasting headcount against strategy.", prerequisites: ["people-analytics"] },
  { id: "ai-in-hr", name: "AI in HR", category: "tech", icon: "🤖", tier: 3, description: "Applying LLMs responsibly across the people stack.", prerequisites: ["automation", "people-analytics"] },

  // ─── Leadership & Strategy ──────────────────────────────────
  { id: "culture-building", name: "Culture Building", category: "leadership", icon: "🌟", tier: 2, description: "Shaping rituals, values, and norms." },
  { id: "change-mgmt", name: "Change Management", category: "leadership", icon: "🌊", tier: 2, description: "Bringing the org along through transitions." },
  { id: "org-design", name: "Org Design", category: "leadership", icon: "🏗️", tier: 3, description: "Structuring teams for the strategy ahead.", prerequisites: ["change-mgmt"] },
  { id: "exec-coaching", name: "Executive Coaching", category: "leadership", icon: "♟️", tier: 3, description: "Partnering with senior leaders on growth." },
  { id: "dei-strategy", name: "DEI Strategy", category: "leadership", icon: "🌈", tier: 3, description: "Embedding inclusion across the employee lifecycle.", prerequisites: ["culture-building"] },
];

export const people: Person[] = [
  {
    id: "amara",
    name: "Amara Chen",
    currentRole: "L&D Specialist",
    yearsExperience: 4,
    avatar: "🌸",
    bio: "Runs the new-hire bootcamp and a monthly facilitation guild.",
    skillIds: [
      "facilitation",
      "training-design",
      "coaching",
      "skills-assessment",
      "learning-tech",
      "onboarding",
      "hr-compliance",
    ],
  },
  {
    id: "ben",
    name: "Ben Okafor",
    currentRole: "Recruitment Lead",
    yearsExperience: 7,
    avatar: "🦊",
    bio: "Built the sourcing engine that 3× tripled engineering applications.",
    skillIds: [
      "sourcing",
      "interviewing",
      "ats-tools",
      "candidate-assessment",
      "employer-branding",
      "hr-compliance",
      "onboarding",
    ],
  },
  {
    id: "priya",
    name: "Priya Raman",
    currentRole: "Payroll & Benefits Admin",
    yearsExperience: 3,
    avatar: "🌼",
    bio: "Runs monthly payroll across 4 countries without breaking a sweat.",
    skillIds: [
      "payroll-admin",
      "benefits-design",
      "hr-compliance",
      "hris-systems",
      "comp-benchmarking",
    ],
  },
  {
    id: "marco",
    name: "Marco Silva",
    currentRole: "People Analytics Analyst",
    yearsExperience: 5,
    avatar: "🐺",
    bio: "Loves a clean dataset more than a clean inbox.",
    skillIds: [
      "hris-systems",
      "data-viz",
      "people-analytics",
      "automation",
      "ai-in-hr",
      "hr-compliance",
    ],
  },
  {
    id: "lena",
    name: "Lena Park",
    currentRole: "HR Business Partner",
    yearsExperience: 9,
    avatar: "🦉",
    bio: "Trusted advisor to the product & design org.",
    skillIds: [
      "employee-relations",
      "conflict-resolution",
      "coaching",
      "change-mgmt",
      "culture-building",
      "hr-compliance",
      "onboarding",
      "offboarding",
      "policy-design",
    ],
  },
  {
    id: "samir",
    name: "Samir Haddad",
    currentRole: "Head of People",
    yearsExperience: 14,
    avatar: "🦁",
    bio: "Scaled two startups from 30 to 300. Loves a good org chart.",
    skillIds: [
      "org-design",
      "change-mgmt",
      "culture-building",
      "exec-coaching",
      "dei-strategy",
      "policy-design",
      "total-rewards",
      "learning-strategy",
      "workforce-planning",
      "employer-branding",
      "employee-relations",
    ],
  },
  {
    id: "nadia",
    name: "Nadia Volkov",
    currentRole: "DEI Programme Lead",
    yearsExperience: 6,
    avatar: "🦋",
    bio: "Designs inclusion programmes that ship and stick.",
    skillIds: [
      "diversity-hiring",
      "dei-strategy",
      "culture-building",
      "facilitation",
      "coaching",
      "employee-relations",
      "hr-compliance",
    ],
  },
  {
    id: "tomas",
    name: "Tomás Reyes",
    currentRole: "HR Generalist",
    yearsExperience: 2,
    avatar: "🌿",
    bio: "Three months in. Hungry for the next skill on the tree.",
    skillIds: [
      "onboarding",
      "hr-compliance",
      "hris-systems",
      "ats-tools",
      "interviewing",
    ],
  },
];

export const roles: Role[] = [
  {
    id: "hrbp",
    title: "HR Business Partner",
    department: "People Ops",
    description: "Trusted advisor to a function — coaching leaders, handling ER, and shepherding change.",
    requiredSkillIds: [
      "employee-relations",
      "conflict-resolution",
      "coaching",
      "change-mgmt",
      "hr-compliance",
      "policy-design",
    ],
    niceToHaveSkillIds: ["culture-building", "people-analytics", "onboarding"],
  },
  {
    id: "talent-lead",
    title: "Head of Talent",
    department: "Talent Acquisition",
    description: "Owns the full hiring funnel and the employer brand that feeds it.",
    requiredSkillIds: [
      "sourcing",
      "interviewing",
      "candidate-assessment",
      "ats-tools",
      "employer-branding",
      "diversity-hiring",
    ],
    niceToHaveSkillIds: ["people-analytics", "change-mgmt"],
  },
  {
    id: "ld-lead",
    title: "Head of Learning",
    department: "L&D",
    description: "Defines how the org learns — from new-hire to senior IC to executive.",
    requiredSkillIds: [
      "facilitation",
      "training-design",
      "coaching",
      "skills-assessment",
      "learning-tech",
      "learning-strategy",
    ],
    niceToHaveSkillIds: ["change-mgmt", "ai-in-hr", "culture-building"],
  },
  {
    id: "rewards-lead",
    title: "Total Rewards Lead",
    department: "Comp & Ben",
    description: "Designs pay, benefits and equity programmes for the long haul.",
    requiredSkillIds: [
      "payroll-admin",
      "benefits-design",
      "comp-benchmarking",
      "equity-planning",
      "total-rewards",
      "hr-compliance",
    ],
    niceToHaveSkillIds: ["people-analytics", "workforce-planning"],
  },
  {
    id: "people-analytics-lead",
    title: "People Analytics Lead",
    department: "HR Tech",
    description: "Translates messy workforce data into decisions the exec team trusts.",
    requiredSkillIds: [
      "hris-systems",
      "data-viz",
      "people-analytics",
      "workforce-planning",
      "automation",
    ],
    niceToHaveSkillIds: ["ai-in-hr", "change-mgmt"],
  },
  {
    id: "head-of-people",
    title: "Head of People",
    department: "Leadership",
    description: "Sets the people strategy and partners with the CEO on org design.",
    requiredSkillIds: [
      "org-design",
      "change-mgmt",
      "culture-building",
      "exec-coaching",
      "policy-design",
      "total-rewards",
      "learning-strategy",
      "workforce-planning",
    ],
    niceToHaveSkillIds: ["dei-strategy", "employer-branding", "ai-in-hr"],
  },
  {
    id: "dei-lead",
    title: "DEI Lead",
    department: "Leadership",
    description: "Embeds inclusion across hiring, development and culture.",
    requiredSkillIds: [
      "diversity-hiring",
      "dei-strategy",
      "culture-building",
      "facilitation",
      "employee-relations",
    ],
    niceToHaveSkillIds: ["change-mgmt", "people-analytics", "coaching"],
  },
];

// ─── Helpers ──────────────────────────────────────────────────
export const skillsById: Record<string, Skill> = Object.fromEntries(
  skills.map((s) => [s.id, s])
);

export const categoryById: Record<string, Category> = Object.fromEntries(
  categories.map((c) => [c.id, c])
);

export function getPersonSkills(person: Person): Skill[] {
  return person.skillIds.map((id) => skillsById[id]).filter(Boolean);
}

export function getSkillGap(person: Person, role: Role) {
  const have = new Set(person.skillIds);
  const required = role.requiredSkillIds.map((id) => skillsById[id]).filter(Boolean);
  const niceToHave = role.niceToHaveSkillIds.map((id) => skillsById[id]).filter(Boolean);
  const acquired = required.filter((s) => have.has(s.id));
  const missing = required.filter((s) => !have.has(s.id));
  const niceMissing = niceToHave.filter((s) => !have.has(s.id));
  const readiness =
    required.length === 0 ? 1 : acquired.length / required.length;
  return { acquired, missing, niceMissing, readiness };
}
