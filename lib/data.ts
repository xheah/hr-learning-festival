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
import {
  Category,
  MasteryLevel,
  Person,
  ResourceLink,
  Role,
  Skill,
  SkillMastery,
} from "./types";

// ─── Categories ───────────────────────────────────────────────
export const categories: Category[] = [
  {
    id: "hr",
    name: "Human Resources",
    short: "HR",
    color: "#8d6a9f",
    accent: "#e0d3e9",
    darkColor: "#5f4569",
    icon: Users,
  },
  {
    id: "finance",
    name: "Finance",
    short: "Finance",
    color: "#8cbcb9",
    accent: "#d3e6e4",
    darkColor: "#3a5e5c",
    icon: DollarSign,
  },
  {
    id: "admin",
    name: "Administration",
    short: "Admin",
    color: "#dda448",
    accent: "#f4e2bf",
    darkColor: "#8a5e1e",
    icon: Briefcase,
  },
];

// ─── Resource helpers ─────────────────────────────────────────
// All URLs below were sanity-checked against stable URL patterns:
//   • coursera.org/search?query=…           (always renders a results page)
//   • youtube.com/results?search_query=…    (always renders a results page)
//   • hbr.org/topic/subject/<slug>          (verified topic pages)
//   • aihr.com/blog/<slug>                  (verified specific articles)
//   • corporatefinanceinstitute.com/resources/ (verified root)
//   • accountingcoach.com/                  (stable homepage)
function coursera(query: string, title?: string): ResourceLink {
  return {
    title: title ?? `Coursera · ${query}`,
    url: `https://www.coursera.org/search?query=${encodeURIComponent(query)}`,
    type: "course",
  };
}
function youtube(query: string, title?: string): ResourceLink {
  return {
    title: title ?? `YouTube · ${query}`,
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
    type: "video",
  };
}

// ─── Skills ───────────────────────────────────────────────────
export const skills: Skill[] = [
  // ─── HR ─────────────────────────────────────────────────────
  {
    id: "onboarding",
    name: "Onboarding",
    category: "hr",
    icon: Sprout,
    tier: 1,
    description:
      "Designing the first 90 days so new joiners feel set up to thrive.",
    resources: [
      coursera("employee onboarding", "Coursera · Employee Onboarding"),
      {
        title: "AIHR · Employee Onboarding Guide",
        url: "https://www.aihr.com/blog/employee-onboarding/",
        type: "article",
      },
    ],
  },
  {
    id: "hr-compliance",
    name: "HR Compliance",
    category: "hr",
    icon: ClipboardCheck,
    tier: 1,
    description: "Statutory employment basics and policy hygiene.",
    resources: [
      coursera("hr compliance", "Coursera · HR Compliance"),
      youtube("hr compliance training basics", "YouTube · HR Compliance Basics"),
    ],
  },
  {
    id: "sourcing",
    name: "Sourcing",
    category: "hr",
    icon: Search,
    tier: 1,
    description: "Finding candidates beyond inbound applicants.",
    resources: [
      coursera("recruiting sourcing", "Coursera · Sourcing & Recruiting"),
      {
        title: "HBR · Hiring & Recruitment",
        url: "https://hbr.org/topic/subject/hiring-and-recruitment",
        type: "article",
      },
    ],
  },
  {
    id: "employee-relations",
    name: "Employee Relations",
    category: "hr",
    icon: MessagesSquare,
    tier: 2,
    description: "Navigating tough conversations and grievances.",
    prerequisites: ["hr-compliance"],
    resources: [
      coursera("employee relations", "Coursera · Employee Relations"),
      {
        title: "HBR · Managing People",
        url: "https://hbr.org/topic/subject/managing-people",
        type: "article",
      },
    ],
  },
  {
    id: "interviewing",
    name: "Structured Interviewing",
    category: "hr",
    icon: Mic,
    tier: 2,
    description: "Calibrated, bias-aware interviews.",
    prerequisites: ["sourcing"],
    resources: [
      coursera("structured interviewing", "Coursera · Structured Interviewing"),
      {
        title: "HBR · Hiring & Recruitment",
        url: "https://hbr.org/topic/subject/hiring-and-recruitment",
        type: "article",
      },
    ],
  },
  {
    id: "facilitation",
    name: "Facilitation",
    category: "hr",
    icon: Presentation,
    tier: 2,
    description: "Running workshops people actually enjoy.",
    resources: [
      coursera("facilitation skills", "Coursera · Facilitation"),
      youtube("workshop facilitation skills", "YouTube · Workshop Facilitation"),
    ],
  },
  {
    id: "training-design",
    name: "Training Design",
    category: "hr",
    icon: Wrench,
    tier: 2,
    description: "Outcome-driven curriculum and lesson plans.",
    prerequisites: ["facilitation"],
    resources: [
      coursera("instructional design", "Coursera · Instructional Design"),
      {
        title: "AIHR · Training Needs Analysis",
        url: "https://www.aihr.com/blog/training-needs-analysis/",
        type: "article",
      },
    ],
  },
  {
    id: "benefits-design",
    name: "Benefits Design",
    category: "hr",
    icon: HeartPulse,
    tier: 2,
    description: "Building a benefits stack that resonates.",
    prerequisites: ["hr-compliance"],
    resources: [
      coursera("employee benefits", "Coursera · Employee Benefits"),
      {
        title: "AIHR · Employee Benefits",
        url: "https://www.aihr.com/blog/employee-benefits/",
        type: "article",
      },
    ],
  },
  {
    id: "policy-design",
    name: "Policy Design",
    category: "hr",
    icon: ScrollText,
    tier: 3,
    description: "Authoring policy that scales with the org.",
    prerequisites: ["hr-compliance", "employee-relations"],
    resources: [
      coursera("hr policy", "Coursera · HR Policy"),
      youtube("writing hr policies and procedures", "YouTube · Writing HR Policy"),
    ],
  },
  {
    id: "inclusive-hiring",
    name: "Inclusive Hiring",
    category: "hr",
    icon: Globe,
    tier: 3,
    description: "Removing barriers across the pipeline.",
    prerequisites: ["interviewing"],
    resources: [
      coursera("inclusive hiring", "Coursera · Inclusive Hiring"),
      {
        title: "AIHR · Inclusive Recruitment",
        url: "https://www.aihr.com/blog/inclusive-recruitment/",
        type: "article",
      },
    ],
  },
  {
    id: "ld-strategy",
    name: "L&D Strategy",
    category: "hr",
    icon: Map,
    tier: 3,
    description:
      "Connecting learning investments to business outcomes.",
    prerequisites: ["training-design"],
    resources: [
      coursera("learning and development strategy", "Coursera · L&D Strategy"),
      {
        title: "AIHR · Learning & Development Strategy",
        url: "https://www.aihr.com/blog/learning-and-development-strategy/",
        type: "article",
      },
    ],
  },
  {
    id: "total-rewards",
    name: "Total Rewards",
    category: "hr",
    icon: Trophy,
    tier: 3,
    description: "End-to-end rewards philosophy.",
    prerequisites: ["benefits-design"],
    resources: [
      coursera("total rewards compensation", "Coursera · Total Rewards"),
      {
        title: "AIHR · Total Rewards Strategy",
        url: "https://www.aihr.com/blog/total-rewards-strategy/",
        type: "article",
      },
    ],
  },

  // ─── Finance ────────────────────────────────────────────────
  {
    id: "bookkeeping",
    name: "Bookkeeping",
    category: "finance",
    icon: Notebook,
    tier: 1,
    description: "Accurate, day-to-day ledger management.",
    resources: [
      coursera("bookkeeping basics", "Coursera · Bookkeeping Basics"),
      {
        title: "AccountingCoach",
        url: "https://www.accountingcoach.com/",
        type: "article",
      },
    ],
  },
  {
    id: "financial-reporting",
    name: "Financial Reporting",
    category: "finance",
    icon: FileSpreadsheet,
    tier: 1,
    description: "Producing the monthly close pack on time.",
    resources: [
      coursera("financial reporting", "Coursera · Financial Reporting"),
      {
        title: "Corporate Finance Institute",
        url: "https://corporatefinanceinstitute.com/resources/",
        type: "article",
      },
    ],
  },
  {
    id: "payroll-processing",
    name: "Payroll Processing",
    category: "finance",
    icon: Banknote,
    tier: 1,
    description: "Accurate, on-time, statutorily-correct payroll.",
    resources: [
      coursera("payroll fundamentals", "Coursera · Payroll Fundamentals"),
      youtube("payroll processing tutorial", "YouTube · Payroll Tutorial"),
    ],
  },
  {
    id: "budgeting",
    name: "Budgeting",
    category: "finance",
    icon: BarChart3,
    tier: 2,
    description: "Building and tracking annual and quarterly plans.",
    prerequisites: ["financial-reporting"],
    resources: [
      coursera("corporate budgeting", "Coursera · Corporate Budgeting"),
      {
        title: "HBR · Finance & Investing",
        url: "https://hbr.org/topic/subject/finance-and-investing",
        type: "article",
      },
    ],
  },
  {
    id: "accounts-payable",
    name: "Accounts Payable",
    category: "finance",
    icon: ArrowDownToLine,
    tier: 2,
    description: "Vendor invoices in, paid cleanly and on time.",
    prerequisites: ["bookkeeping"],
    resources: [
      coursera("accounts payable", "Coursera · Accounts Payable"),
      {
        title: "AccountingCoach",
        url: "https://www.accountingcoach.com/",
        type: "article",
      },
    ],
  },
  {
    id: "accounts-receivable",
    name: "Accounts Receivable",
    category: "finance",
    icon: ArrowUpFromLine,
    tier: 2,
    description: "Customer invoices out, cash in.",
    prerequisites: ["bookkeeping"],
    resources: [
      coursera("accounts receivable", "Coursera · Accounts Receivable"),
      {
        title: "AccountingCoach",
        url: "https://www.accountingcoach.com/",
        type: "article",
      },
    ],
  },
  {
    id: "tax-compliance",
    name: "Tax Compliance",
    category: "finance",
    icon: Calculator,
    tier: 2,
    description: "Filings, GST/VAT, and audit-ready records.",
    prerequisites: ["financial-reporting"],
    resources: [
      coursera("tax compliance", "Coursera · Tax Compliance"),
      youtube("corporate tax basics", "YouTube · Corporate Tax Basics"),
    ],
  },
  {
    id: "cash-flow-mgmt",
    name: "Cash Flow Management",
    category: "finance",
    icon: Droplets,
    tier: 2,
    description: "Forecasting and protecting working capital.",
    prerequisites: ["accounts-payable", "accounts-receivable"],
    resources: [
      coursera("cash flow management", "Coursera · Cash Flow Management"),
      {
        title: "Corporate Finance Institute",
        url: "https://corporatefinanceinstitute.com/resources/",
        type: "article",
      },
    ],
  },
  {
    id: "financial-modelling",
    name: "Financial Modelling",
    category: "finance",
    icon: TrendingUp,
    tier: 3,
    description: "Decision-grade models in spreadsheets.",
    prerequisites: ["budgeting"],
    resources: [
      coursera("financial modeling", "Coursera · Financial Modelling"),
      {
        title: "Corporate Finance Institute",
        url: "https://corporatefinanceinstitute.com/resources/",
        type: "article",
      },
    ],
  },
  {
    id: "strategic-forecasting",
    name: "Strategic Forecasting",
    category: "finance",
    icon: Telescope,
    tier: 3,
    description: "Multi-year scenarios for the exec team.",
    prerequisites: ["financial-modelling"],
    resources: [
      coursera("strategic forecasting fp&a", "Coursera · Strategic Forecasting"),
      {
        title: "HBR · Finance & Investing",
        url: "https://hbr.org/topic/subject/finance-and-investing",
        type: "article",
      },
    ],
  },
  {
    id: "audit-controls",
    name: "Audit & Controls",
    category: "finance",
    icon: ShieldCheck,
    tier: 3,
    description: "Designing controls auditors and regulators trust.",
    prerequisites: ["tax-compliance"],
    resources: [
      coursera("internal audit controls", "Coursera · Audit & Controls"),
      youtube("internal controls explained", "YouTube · Internal Controls"),
    ],
  },
  {
    id: "treasury-strategy",
    name: "Treasury Strategy",
    category: "finance",
    icon: Landmark,
    tier: 3,
    description: "Managing FX, banking, and investment policy.",
    prerequisites: ["cash-flow-mgmt"],
    resources: [
      coursera("treasury management", "Coursera · Treasury Management"),
      {
        title: "HBR · Finance & Investing",
        url: "https://hbr.org/topic/subject/finance-and-investing",
        type: "article",
      },
    ],
  },

  // ─── Admin ──────────────────────────────────────────────────
  {
    id: "calendar-mgmt",
    name: "Calendar Management",
    category: "admin",
    icon: CalendarDays,
    tier: 1,
    description: "Defending leader time without dropping balls.",
    resources: [
      coursera("time management", "Coursera · Time Management"),
      youtube("calendar management for executives", "YouTube · Calendar Mgmt"),
    ],
  },
  {
    id: "document-control",
    name: "Document Control",
    category: "admin",
    icon: FolderOpen,
    tier: 1,
    description: "Versioned, findable, governable files.",
    resources: [
      coursera("document management", "Coursera · Document Management"),
      youtube("document control basics", "YouTube · Document Control"),
    ],
  },
  {
    id: "office-coordination",
    name: "Office Coordination",
    category: "admin",
    icon: Building,
    tier: 1,
    description: "Keeping the office humming day-to-day.",
    resources: [
      coursera("administrative professional", "Coursera · Office Coordination"),
      youtube("office management essentials", "YouTube · Office Management"),
    ],
  },
  {
    id: "travel-planning",
    name: "Travel Planning",
    category: "admin",
    icon: Plane,
    tier: 2,
    description: "End-to-end trip logistics, on budget.",
    prerequisites: ["calendar-mgmt"],
    resources: [
      coursera("corporate travel management", "Coursera · Corporate Travel"),
      youtube("executive travel planning", "YouTube · Executive Travel"),
    ],
  },
  {
    id: "procurement",
    name: "Procurement",
    category: "admin",
    icon: ShoppingCart,
    tier: 2,
    description: "Sourcing suppliers and getting fair prices.",
    prerequisites: ["document-control"],
    resources: [
      coursera("procurement", "Coursera · Procurement"),
      {
        title: "HBR · Operations Management",
        url: "https://hbr.org/topic/subject/operations-management",
        type: "article",
      },
    ],
  },
  {
    id: "event-coordination",
    name: "Event Coordination",
    category: "admin",
    icon: PartyPopper,
    tier: 2,
    description: "Offsites and town halls that actually land.",
    prerequisites: ["calendar-mgmt", "office-coordination"],
    resources: [
      coursera("event management", "Coursera · Event Management"),
      youtube("planning corporate events", "YouTube · Corporate Events"),
    ],
  },
  {
    id: "stakeholder-liaison",
    name: "Stakeholder Liaison",
    category: "admin",
    icon: Phone,
    tier: 2,
    description: "Brokering communication across teams.",
    prerequisites: ["office-coordination"],
    resources: [
      coursera("stakeholder communication", "Coursera · Stakeholder Comms"),
      {
        title: "HBR · Managing People",
        url: "https://hbr.org/topic/subject/managing-people",
        type: "article",
      },
    ],
  },
  {
    id: "records-mgmt",
    name: "Records Management",
    category: "admin",
    icon: Archive,
    tier: 2,
    description: "Retention policies and information governance.",
    prerequisites: ["document-control"],
    resources: [
      coursera("records management", "Coursera · Records Management"),
      youtube("records retention policy", "YouTube · Records Retention"),
    ],
  },
  {
    id: "facilities-mgmt",
    name: "Facilities Management",
    category: "admin",
    icon: Wrench,
    tier: 3,
    description: "Leases, building services, health & safety.",
    prerequisites: ["procurement"],
    resources: [
      coursera("facilities management", "Coursera · Facilities Management"),
      youtube("facilities management overview", "YouTube · Facilities Mgmt"),
    ],
  },
  {
    id: "process-automation",
    name: "Process Automation",
    category: "admin",
    icon: Bot,
    tier: 3,
    description: "Eliminating manual work with scripts and bots.",
    prerequisites: ["records-mgmt"],
    resources: [
      coursera("workflow automation", "Coursera · Workflow Automation"),
      youtube("business process automation tutorial", "YouTube · BPA Tutorial"),
    ],
  },
  {
    id: "operations-strategy",
    name: "Operations Strategy",
    category: "admin",
    icon: Compass,
    tier: 3,
    description: "Designing how the back-office runs at scale.",
    prerequisites: ["facilities-mgmt", "process-automation"],
    resources: [
      coursera("operations strategy", "Coursera · Operations Strategy"),
      {
        title: "HBR · Operations Management",
        url: "https://hbr.org/topic/subject/operations-management",
        type: "article",
      },
    ],
  },
  {
    id: "executive-support",
    name: "Executive Support",
    category: "admin",
    icon: Crown,
    tier: 3,
    description: "Senior chief-of-staff style partnering.",
    prerequisites: ["calendar-mgmt", "stakeholder-liaison"],
    resources: [
      coursera("executive assistant", "Coursera · Executive Assistant"),
      {
        title: "HBR · Managing People",
        url: "https://hbr.org/topic/subject/managing-people",
        type: "article",
      },
    ],
  },
];

// ─── Seed people (with mastery levels) ─────────────────────────
const m = (id: string, level: 1 | 2 | 3): SkillMastery => ({ id, level });

export const seedPeople: Person[] = [
  // ─── HR ─────────────────────────────────────────────────────
  {
    id: "amara",
    name: "Amara Chen",
    currentRole: "L&D Specialist",
    yearsExperience: 4,
    icon: Cherry,
    bio: "Runs the new-hire bootcamp and a monthly facilitation guild.",
    skills: [
      m("facilitation", 3),
      m("training-design", 3),
      m("onboarding", 2),
      m("hr-compliance", 2),
      m("ld-strategy", 2),
      m("calendar-mgmt", 1),
    ],
  },
  {
    id: "ben",
    name: "Ben Okafor",
    currentRole: "Recruitment Lead",
    yearsExperience: 7,
    icon: Mountain,
    bio: "Built the sourcing engine that tripled engineering applications.",
    skills: [
      m("sourcing", 3),
      m("interviewing", 3),
      m("inclusive-hiring", 2),
      m("hr-compliance", 2),
      m("onboarding", 2),
      m("document-control", 1),
    ],
  },
  {
    id: "lena",
    name: "Lena Park",
    currentRole: "HR Business Partner",
    yearsExperience: 9,
    icon: Bird,
    bio: "Trusted advisor to the product & design org.",
    skills: [
      m("employee-relations", 3),
      m("policy-design", 3),
      m("hr-compliance", 3),
      m("onboarding", 2),
      m("interviewing", 2),
      m("benefits-design", 2),
      m("facilitation", 2),
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
    skills: [
      m("payroll-processing", 3),
      m("bookkeeping", 2),
      m("financial-reporting", 2),
      m("accounts-payable", 2),
      m("accounts-receivable", 2),
      m("tax-compliance", 1),
      m("hr-compliance", 1),
    ],
  },
  {
    id: "marco",
    name: "Marco Silva",
    currentRole: "Finance Analyst",
    yearsExperience: 5,
    icon: Dog,
    bio: "Loves a clean dataset more than a clean inbox.",
    skills: [
      m("financial-reporting", 3),
      m("budgeting", 3),
      m("financial-modelling", 2),
      m("cash-flow-mgmt", 2),
      m("bookkeeping", 2),
      m("process-automation", 1),
    ],
  },
  {
    id: "samir",
    name: "Samir Haddad",
    currentRole: "Finance Director",
    yearsExperience: 14,
    icon: Award,
    bio: "Scaled two startups from 30 to 300. Loves a tidy P&L.",
    skills: [
      m("financial-reporting", 3),
      m("budgeting", 3),
      m("financial-modelling", 3),
      m("strategic-forecasting", 3),
      m("audit-controls", 3),
      m("treasury-strategy", 2),
      m("cash-flow-mgmt", 3),
      m("tax-compliance", 2),
      m("operations-strategy", 2),
      m("policy-design", 2),
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
    skills: [
      m("calendar-mgmt", 3),
      m("document-control", 3),
      m("office-coordination", 3),
      m("travel-planning", 3),
      m("event-coordination", 3),
      m("procurement", 2),
      m("stakeholder-liaison", 2),
      m("facilities-mgmt", 2),
    ],
  },
  {
    id: "tomas",
    name: "Tomás Reyes",
    currentRole: "Admin Coordinator",
    yearsExperience: 2,
    icon: Leaf,
    bio: "Three months in. Hungry for the next skill on the tree.",
    skills: [
      m("calendar-mgmt", 2),
      m("document-control", 2),
      m("office-coordination", 1),
      m("travel-planning", 1),
    ],
  },
];

/** @deprecated Use `seedPeople` and the storage hook. Kept for any old import sites. */
export const people = seedPeople;

// ─── Roles ────────────────────────────────────────────────────
export const roles: Role[] = [
  {
    id: "hrbp",
    title: "HR Business Partner",
    department: "HR",
    description:
      "Trusted advisor to a function — coaching leaders, handling ER, and shepherding change.",
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
    description:
      "Translates the strategy into numbers leadership can act on.",
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
    description:
      "Sets the finance strategy and partners with the CEO on capital allocation.",
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
  {
    id: "executive-assistant",
    title: "Executive Assistant",
    department: "Admin",
    description:
      "The right hand of a senior leader — calendars, travel, and judgment calls.",
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
    description:
      "Runs the back-office systems that let everyone else do their best work.",
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

export function personSkillIds(person: Person): string[] {
  return person.skills.map((s) => s.id);
}

export function getMastery(person: Person, skillId: string): MasteryLevel {
  return (person.skills.find((s) => s.id === skillId)?.level ?? 0) as MasteryLevel;
}

/** Mastery-aware readiness — counts partial progress (33%, 66%) toward the gap. */
export function getSkillGap(person: Person, role: Role) {
  const have = new Map(person.skills.map((s) => [s.id, s.level] as const));
  const required = role.requiredSkillIds
    .map((id) => skillsById[id])
    .filter(Boolean);
  const niceToHave = role.niceToHaveSkillIds
    .map((id) => skillsById[id])
    .filter(Boolean);
  const acquired = required.filter((s) => (have.get(s.id) ?? 0) > 0);
  const missing = required.filter((s) => (have.get(s.id) ?? 0) === 0);
  const niceMissing = niceToHave.filter((s) => (have.get(s.id) ?? 0) === 0);
  // Weight by mastery: Practicing=1/3, Competent=2/3, Expert=3/3
  const readiness =
    required.length === 0
      ? 1
      : required.reduce((sum, s) => sum + (have.get(s.id) ?? 0) / 3, 0) /
        required.length;
  return { acquired, missing, niceMissing, readiness };
}
