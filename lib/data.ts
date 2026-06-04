import {
  Archive,
  ArrowDownToLine,
  ArrowUpFromLine,
  Award,
  Banknote,
  BarChart3,
  Bird,
  Bot,
  Briefcase,
  Building,
  Calculator,
  CalendarDays,
  Cherry,
  ClipboardCheck,
  Compass,
  Crown,
  DollarSign,
  Dog,
  Droplets,
  FileSpreadsheet,
  Flower,
  FolderOpen,
  Globe,
  HeartPulse,
  Landmark,
  Leaf,
  Map,
  MessagesSquare,
  Mic,
  Mountain,
  Notebook,
  PartyPopper,
  Phone,
  Plane,
  Presentation,
  ScrollText,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Sprout,
  Telescope,
  TrendingUp,
  Trophy,
  Users,
  Wrench,
} from "lucide-react";
import { Category, Person, Role, Skill } from "./types";

export const categories: Category[] = [
  {
    id: "hr",
    name: "Human Resources",
    short: "HR",
    color: "#8d6a9f", // Vintage Lavender
    accent: "#e0d3e9",
    darkColor: "#5f4569", // contrast ratio ~7:1 on accent
    icon: Users,
  },
  {
    id: "finance",
    name: "Finance",
    short: "Finance",
    color: "#8cbcb9", // Muted Teal
    accent: "#d3e6e4",
    darkColor: "#3a5e5c", // contrast ratio ~5.8:1 on accent
    icon: DollarSign,
  },
  {
    id: "admin",
    name: "Administration",
    short: "Admin",
    color: "#dda448", // Honey Bronze
    accent: "#f4e2bf",
    darkColor: "#8a5e1e", // contrast ratio ~5:1 on accent
    icon: Briefcase,
  },
];

export const skills: Skill[] = [
  // ─── HR ─────────────────────────────────────────────────────
  { id: "onboarding", name: "Onboarding", category: "hr", icon: Sprout, tier: 1, description: "Designing the first 90 days so new joiners feel set up to thrive." },
  { id: "hr-compliance", name: "HR Compliance", category: "hr", icon: ClipboardCheck, tier: 1, description: "Statutory employment basics and policy hygiene." },
  { id: "sourcing", name: "Sourcing", category: "hr", icon: Search, tier: 1, description: "Finding candidates beyond inbound applicants." },
  { id: "employee-relations", name: "Employee Relations", category: "hr", icon: MessagesSquare, tier: 2, description: "Navigating tough conversations and grievances.", prerequisites: ["hr-compliance"] },
  { id: "interviewing", name: "Structured Interviewing", category: "hr", icon: Mic, tier: 2, description: "Calibrated, bias-aware interviews.", prerequisites: ["sourcing"] },
  { id: "facilitation", name: "Facilitation", category: "hr", icon: Presentation, tier: 2, description: "Running workshops people actually enjoy." },
  { id: "training-design", name: "Training Design", category: "hr", icon: Wrench, tier: 2, description: "Outcome-driven curriculum and lesson plans.", prerequisites: ["facilitation"] },
  { id: "benefits-design", name: "Benefits Design", category: "hr", icon: HeartPulse, tier: 2, description: "Building a benefits stack that resonates.", prerequisites: ["hr-compliance"] },
  { id: "policy-design", name: "Policy Design", category: "hr", icon: ScrollText, tier: 3, description: "Authoring policy that scales with the org.", prerequisites: ["hr-compliance", "employee-relations"] },
  { id: "inclusive-hiring", name: "Inclusive Hiring", category: "hr", icon: Globe, tier: 3, description: "Removing barriers across the pipeline.", prerequisites: ["interviewing"] },
  { id: "ld-strategy", name: "L&D Strategy", category: "hr", icon: Map, tier: 3, description: "Connecting learning investments to business outcomes.", prerequisites: ["training-design"] },
  { id: "total-rewards", name: "Total Rewards", category: "hr", icon: Trophy, tier: 3, description: "End-to-end rewards philosophy.", prerequisites: ["benefits-design"] },

  // ─── Finance ────────────────────────────────────────────────
  { id: "bookkeeping", name: "Bookkeeping", category: "finance", icon: Notebook, tier: 1, description: "Accurate, day-to-day ledger management." },
  { id: "financial-reporting", name: "Financial Reporting", category: "finance", icon: FileSpreadsheet, tier: 1, description: "Producing the monthly close pack on time." },
  { id: "payroll-processing", name: "Payroll Processing", category: "finance", icon: Banknote, tier: 1, description: "Accurate, on-time, statutorily-correct payroll." },
  { id: "budgeting", name: "Budgeting", category: "finance", icon: BarChart3, tier: 2, description: "Building and tracking annual and quarterly plans.", prerequisites: ["financial-reporting"] },
  { id: "accounts-payable", name: "Accounts Payable", category: "finance", icon: ArrowDownToLine, tier: 2, description: "Vendor invoices in, paid cleanly and on time.", prerequisites: ["bookkeeping"] },
  { id: "accounts-receivable", name: "Accounts Receivable", category: "finance", icon: ArrowUpFromLine, tier: 2, description: "Customer invoices out, cash in.", prerequisites: ["bookkeeping"] },
  { id: "tax-compliance", name: "Tax Compliance", category: "finance", icon: Calculator, tier: 2, description: "Filings, GST/VAT, and audit-ready records.", prerequisites: ["financial-reporting"] },
  { id: "cash-flow-mgmt", name: "Cash Flow Management", category: "finance", icon: Droplets, tier: 2, description: "Forecasting and protecting working capital.", prerequisites: ["accounts-payable", "accounts-receivable"] },
  { id: "financial-modelling", name: "Financial Modelling", category: "finance", icon: TrendingUp, tier: 3, description: "Decision-grade models in spreadsheets.", prerequisites: ["budgeting"] },
  { id: "strategic-forecasting", name: "Strategic Forecasting", category: "finance", icon: Telescope, tier: 3, description: "Multi-year scenarios for the exec team.", prerequisites: ["financial-modelling"] },
  { id: "audit-controls", name: "Audit & Controls", category: "finance", icon: ShieldCheck, tier: 3, description: "Designing controls auditors and regulators trust.", prerequisites: ["tax-compliance"] },
  { id: "treasury-strategy", name: "Treasury Strategy", category: "finance", icon: Landmark, tier: 3, description: "Managing FX, banking, and investment policy.", prerequisites: ["cash-flow-mgmt"] },

  // ─── Admin ──────────────────────────────────────────────────
  { id: "calendar-mgmt", name: "Calendar Management", category: "admin", icon: CalendarDays, tier: 1, description: "Defending leader time without dropping balls." },
  { id: "document-control", name: "Document Control", category: "admin", icon: FolderOpen, tier: 1, description: "Versioned, findable, governable files." },
  { id: "office-coordination", name: "Office Coordination", category: "admin", icon: Building, tier: 1, description: "Keeping the office humming day-to-day." },
  { id: "travel-planning", name: "Travel Planning", category: "admin", icon: Plane, tier: 2, description: "End-to-end trip logistics, on budget.", prerequisites: ["calendar-mgmt"] },
  { id: "procurement", name: "Procurement", category: "admin", icon: ShoppingCart, tier: 2, description: "Sourcing suppliers and getting fair prices.", prerequisites: ["document-control"] },
  { id: "event-coordination", name: "Event Coordination", category: "admin", icon: PartyPopper, tier: 2, description: "Offsites and town halls that actually land.", prerequisites: ["calendar-mgmt", "office-coordination"] },
  { id: "stakeholder-liaison", name: "Stakeholder Liaison", category: "admin", icon: Phone, tier: 2, description: "Brokering communication across teams.", prerequisites: ["office-coordination"] },
  { id: "records-mgmt", name: "Records Management", category: "admin", icon: Archive, tier: 2, description: "Retention policies and information governance.", prerequisites: ["document-control"] },
  { id: "facilities-mgmt", name: "Facilities Management", category: "admin", icon: Wrench, tier: 3, description: "Leases, building services, health & safety.", prerequisites: ["procurement"] },
  { id: "process-automation", name: "Process Automation", category: "admin", icon: Bot, tier: 3, description: "Eliminating manual work with scripts and bots.", prerequisites: ["records-mgmt"] },
  { id: "operations-strategy", name: "Operations Strategy", category: "admin", icon: Compass, tier: 3, description: "Designing how the back-office runs at scale.", prerequisites: ["facilities-mgmt", "process-automation"] },
  { id: "executive-support", name: "Executive Support", category: "admin", icon: Crown, tier: 3, description: "Senior chief-of-staff style partnering.", prerequisites: ["calendar-mgmt", "stakeholder-liaison"] },
];

export const people: Person[] = [
  // ─── HR ─────────────────────────────────────────────────────
  {
    id: "amara",
    name: "Amara Chen",
    currentRole: "L&D Specialist",
    yearsExperience: 4,
    icon: Cherry,
    bio: "Runs the new-hire bootcamp and a monthly facilitation guild.",
    skillIds: [
      "facilitation",
      "training-design",
      "onboarding",
      "hr-compliance",
      "ld-strategy",
      "calendar-mgmt",
    ],
  },
  {
    id: "ben",
    name: "Ben Okafor",
    currentRole: "Recruitment Lead",
    yearsExperience: 7,
    icon: Mountain,
    bio: "Built the sourcing engine that tripled engineering applications.",
    skillIds: [
      "sourcing",
      "interviewing",
      "inclusive-hiring",
      "hr-compliance",
      "onboarding",
      "document-control",
    ],
  },
  {
    id: "lena",
    name: "Lena Park",
    currentRole: "HR Business Partner",
    yearsExperience: 9,
    icon: Bird,
    bio: "Trusted advisor to the product & design org.",
    skillIds: [
      "employee-relations",
      "policy-design",
      "hr-compliance",
      "onboarding",
      "interviewing",
      "benefits-design",
      "facilitation",
    ],
  },

  // ─── Finance ────────────────────────────────────────────────
  {
    id: "priya",
    name: "Priya Raman",
    currentRole: "Payroll & Accounts Admin",
    yearsExperience: 3,
    icon: Flower,
    bio: "Runs monthly payroll across 4 countries without breaking a sweat.",
    skillIds: [
      "payroll-processing",
      "bookkeeping",
      "financial-reporting",
      "accounts-payable",
      "accounts-receivable",
      "tax-compliance",
      "hr-compliance",
    ],
  },
  {
    id: "marco",
    name: "Marco Silva",
    currentRole: "Finance Analyst",
    yearsExperience: 5,
    icon: Dog,
    bio: "Loves a clean dataset more than a clean inbox.",
    skillIds: [
      "financial-reporting",
      "budgeting",
      "financial-modelling",
      "cash-flow-mgmt",
      "bookkeeping",
      "process-automation",
    ],
  },
  {
    id: "samir",
    name: "Samir Haddad",
    currentRole: "Finance Director",
    yearsExperience: 14,
    icon: Award,
    bio: "Scaled two startups from 30 to 300. Loves a tidy P&L.",
    skillIds: [
      "financial-reporting",
      "budgeting",
      "financial-modelling",
      "strategic-forecasting",
      "audit-controls",
      "treasury-strategy",
      "cash-flow-mgmt",
      "tax-compliance",
      "operations-strategy",
      "policy-design",
    ],
  },

  // ─── Admin ──────────────────────────────────────────────────
  {
    id: "nadia",
    name: "Nadia Volkov",
    currentRole: "Office Manager",
    yearsExperience: 6,
    icon: Sparkles,
    bio: "Keeps the office humming and the offsites unforgettable.",
    skillIds: [
      "calendar-mgmt",
      "document-control",
      "office-coordination",
      "travel-planning",
      "event-coordination",
      "procurement",
      "stakeholder-liaison",
      "facilities-mgmt",
    ],
  },
  {
    id: "tomas",
    name: "Tomás Reyes",
    currentRole: "Admin Coordinator",
    yearsExperience: 2,
    icon: Leaf,
    bio: "Three months in. Hungry for the next skill on the tree.",
    skillIds: [
      "calendar-mgmt",
      "document-control",
      "office-coordination",
      "travel-planning",
    ],
  },
];

export const roles: Role[] = [
  // ─── HR ─────────────────────────────────────────────────────
  {
    id: "hrbp",
    title: "HR Business Partner",
    department: "HR",
    description: "Trusted advisor to a function — coaching leaders, handling ER, and shepherding change.",
    requiredSkillIds: [
      "employee-relations",
      "hr-compliance",
      "policy-design",
      "onboarding",
      "interviewing",
      "ld-strategy",
    ],
    niceToHaveSkillIds: ["facilitation", "benefits-design", "stakeholder-liaison"],
  },
  {
    id: "talent-lead",
    title: "Head of Talent",
    department: "HR",
    description: "Owns the full hiring funnel and the employer brand that feeds it.",
    requiredSkillIds: [
      "sourcing",
      "interviewing",
      "inclusive-hiring",
      "hr-compliance",
      "onboarding",
    ],
    niceToHaveSkillIds: ["employee-relations", "ld-strategy"],
  },

  // ─── Finance ────────────────────────────────────────────────
  {
    id: "finance-manager",
    title: "Finance Manager",
    department: "Finance",
    description: "Owns the monthly close, working capital, and statutory filings.",
    requiredSkillIds: [
      "financial-reporting",
      "budgeting",
      "accounts-payable",
      "accounts-receivable",
      "tax-compliance",
      "cash-flow-mgmt",
    ],
    niceToHaveSkillIds: ["audit-controls", "process-automation"],
  },
  {
    id: "senior-fp-and-a",
    title: "Senior FP&A Analyst",
    department: "Finance",
    description: "Translates the strategy into numbers leadership can act on.",
    requiredSkillIds: [
      "financial-reporting",
      "budgeting",
      "financial-modelling",
      "strategic-forecasting",
      "cash-flow-mgmt",
    ],
    niceToHaveSkillIds: ["audit-controls", "process-automation"],
  },
  {
    id: "head-of-finance",
    title: "Head of Finance",
    department: "Finance",
    description: "Sets the finance strategy and partners with the CEO on capital allocation.",
    requiredSkillIds: [
      "strategic-forecasting",
      "treasury-strategy",
      "audit-controls",
      "financial-modelling",
      "policy-design",
      "operations-strategy",
    ],
    niceToHaveSkillIds: ["stakeholder-liaison", "process-automation"],
  },

  // ─── Admin ──────────────────────────────────────────────────
  {
    id: "executive-assistant",
    title: "Executive Assistant",
    department: "Admin",
    description: "The right hand of a senior leader — calendars, travel, and judgment calls.",
    requiredSkillIds: [
      "calendar-mgmt",
      "document-control",
      "travel-planning",
      "stakeholder-liaison",
      "executive-support",
    ],
    niceToHaveSkillIds: ["event-coordination", "procurement"],
  },
  {
    id: "operations-manager",
    title: "Operations Manager",
    department: "Admin",
    description: "Runs the back-office systems that let everyone else do their best work.",
    requiredSkillIds: [
      "operations-strategy",
      "facilities-mgmt",
      "process-automation",
      "procurement",
      "records-mgmt",
      "stakeholder-liaison",
    ],
    niceToHaveSkillIds: ["event-coordination", "policy-design"],
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
