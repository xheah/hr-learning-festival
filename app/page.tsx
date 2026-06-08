"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  PartyPopper,
  RotateCcw,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { roles, getSkillGap } from "@/lib/data";
import { Person, Role, Skill } from "@/lib/types";
import { usePeople } from "@/lib/storage";
import SkillTree from "@/components/SkillTree";
import PersonPicker from "@/components/PersonPicker";
import RolePicker from "@/components/RolePicker";
import SkillSheet from "@/components/SkillSheet";
import RoadmapCard from "@/components/RoadmapCard";
import TeamBuilder from "@/components/TeamBuilder";
import ThemeToggle from "@/components/ThemeToggle";
import NewPersonForm from "@/components/NewPersonForm";
import CompareView from "@/components/CompareView";
import KioskMode from "@/components/KioskMode";
import PdfDownload from "@/components/PdfDownload";

type Mode = "explorer" | "team" | "compare";
type View = "tree" | "roadmap";

export default function Page() {
  const {
    hydrated,
    people,
    addPerson,
    removePerson,
    restoreSeed,
    hiddenCount,
  } = usePeople();

  const [mode, setMode] = useState<Mode>("explorer");
  const [view, setView] = useState<View>("tree");
  const [personId, setPersonId] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [pickingGoal, setPickingGoal] = useState(false);
  const [pickingPerson, setPickingPerson] = useState(false);
  const [creatingPerson, setCreatingPerson] = useState(false);
  const [isKiosk, setIsKiosk] = useState(false);

  // Read URL params on initial load (for QR deep links, kiosk mode).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("kiosk") === "1") setIsKiosk(true);
    const p = params.get("p");
    if (p) setPersonId(p);
    const r = params.get("r");
    if (r) {
      const found = roles.find((x) => x.id === r);
      if (found) setRole(found);
    }
    const v = params.get("view");
    if (v === "roadmap") setView("roadmap");
  }, []);

  // After hydration, pick a sensible default person if none chosen yet.
  useEffect(() => {
    if (!hydrated) return;
    if (personId && people.some((p) => p.id === personId)) return;
    if (people.length > 0) setPersonId(people[people.length - 1]!.id);
  }, [hydrated, personId, people]);

  const person: Person | null = useMemo(
    () => people.find((p) => p.id === personId) ?? null,
    [people, personId]
  );

  const gap = useMemo(
    () => (role && person ? getSkillGap(person, role) : null),
    [person, role]
  );

  if (isKiosk) {
    return <KioskMode people={people} />;
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 bg-[var(--bg)]/85 backdrop-blur border-b border-[var(--line)]">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 grid place-items-center text-white shadow">
              <Sparkles size={16} strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold leading-tight truncate">
                Skill Tree
              </div>
              <div className="text-[10px] opacity-65 leading-tight truncate">
                HR Learning Festival
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-full border border-[var(--line)] bg-[var(--bg-elev)] p-0.5 text-xs">
              <ModeTab
                active={mode === "explorer"}
                onClick={() => {
                  setMode("explorer");
                  setView("tree");
                  setSelectedSkill(null);
                }}
              >
                My Tree
              </ModeTab>
              <ModeTab
                active={mode === "compare"}
                onClick={() => {
                  setMode("compare");
                  setSelectedSkill(null);
                }}
              >
                Compare
              </ModeTab>
              <ModeTab
                active={mode === "team"}
                onClick={() => {
                  setMode("team");
                  setSelectedSkill(null);
                }}
              >
                Team
              </ModeTab>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-4">
        {mode === "explorer" && view === "tree" && person && (
          <ExplorerView
            person={person}
            role={role}
            gap={gap}
            onPickPerson={() => setPickingPerson(true)}
            onPickGoal={() => setPickingGoal(true)}
            onSelectSkill={setSelectedSkill}
            selectedSkill={selectedSkill}
            onSeeRoadmap={() => setView("roadmap")}
          />
        )}

        {mode === "explorer" && view === "roadmap" && person && role && (
          <RoadmapView
            person={person}
            role={role}
            onBack={() => setView("tree")}
          />
        )}

        {mode === "compare" && (
          <div className="animate-fade-in">
            <div className="mb-3">
              <h2 className="text-lg font-bold">Compare two people</h2>
              <p className="text-xs opacity-70 mt-0.5">
                Pick anyone on each side. See what they share, and where each
                of them is uniquely strong.
              </p>
            </div>
            <CompareView people={people} />
          </div>
        )}

        {mode === "team" && (
          <div className="animate-fade-in">
            <div className="mb-3">
              <h2 className="text-lg font-bold">Build a complementary team</h2>
              <p className="text-xs opacity-70 mt-0.5">
                Pick a role to staff. The app suggests who covers what — toggle
                people in or out to balance the squad.
              </p>
            </div>
            <TeamBuilder />
          </div>
        )}
      </main>

      {/* Modal: Person picker */}
      {pickingPerson && (
        <Sheet
          onClose={() => setPickingPerson(false)}
          title="Whose tree do you want to see?"
          size="lg"
          extra={
            hiddenCount > 0 ? (
              <button
                onClick={() => restoreSeed()}
                className="text-[11px] inline-flex items-center gap-1 opacity-70 hover:opacity-100"
              >
                <RotateCcw size={11} strokeWidth={2.5} />
                Restore {hiddenCount}
              </button>
            ) : undefined
          }
        >
          <PersonPicker
            people={people}
            selectedId={personId ?? null}
            onSelect={(p) => {
              setPersonId(p.id);
              setPickingPerson(false);
            }}
            onCreate={() => {
              setPickingPerson(false);
              setCreatingPerson(true);
            }}
            onRemove={(p) => {
              removePerson(p.id);
              if (p.id === personId) setPersonId(null);
            }}
          />
        </Sheet>
      )}

      {/* Modal: New person */}
      {creatingPerson && (
        <Sheet
          onClose={() => setCreatingPerson(false)}
          title="Build your tree"
          size="lg"
        >
          <NewPersonForm
            onCancel={() => setCreatingPerson(false)}
            onSubmit={(input) => {
              const created = addPerson(input);
              setPersonId(created.id);
              setCreatingPerson(false);
            }}
          />
        </Sheet>
      )}

      {/* Modal: Role picker */}
      {pickingGoal && (
        <Sheet onClose={() => setPickingGoal(false)} title="Where are you heading?">
          <RolePicker
            roles={roles}
            selectedId={role?.id ?? null}
            onSelect={(r) => {
              setRole(r);
              setPickingGoal(false);
            }}
          />
        </Sheet>
      )}

      {/* Bottom sheet: skill detail */}
      {person && (
        <SkillSheet
          skill={selectedSkill}
          person={person}
          role={role}
          onClose={() => setSelectedSkill(null)}
        />
      )}
    </div>
  );
}

function ModeTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full transition ${
        active ? "bg-brand-500 text-white font-semibold" : "opacity-75"
      }`}
    >
      {children}
    </button>
  );
}

interface ExplorerProps {
  person: Person;
  role: Role | null;
  gap: ReturnType<typeof getSkillGap> | null;
  onPickPerson: () => void;
  onPickGoal: () => void;
  onSelectSkill: (s: Skill | null) => void;
  selectedSkill: Skill | null;
  onSeeRoadmap: () => void;
}

function ExplorerView({
  person,
  role,
  gap,
  onPickPerson,
  onPickGoal,
  onSelectSkill,
  selectedSkill,
  onSeeRoadmap,
}: ExplorerProps) {
  const pct = gap ? Math.round(gap.readiness * 100) : null;
  const PersonIcon = person.icon;

  return (
    <div className="animate-fade-in">
      {/* Identity strip */}
      <button
        onClick={onPickPerson}
        className="w-full flex items-center gap-3 p-3 rounded-2xl border border-[var(--line)] bg-[var(--bg-elev)] mb-3 active:scale-[0.99] transition"
      >
        <div className="h-12 w-12 rounded-2xl bg-brand-500 text-white grid place-items-center">
          <PersonIcon size={24} strokeWidth={2.25} />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <div className="text-sm font-bold truncate">{person.name}</div>
          <div className="text-[11px] opacity-70 truncate">
            {person.currentRole} · {person.skills.length} skills
          </div>
        </div>
        <div className="text-[10px] uppercase tracking-wide opacity-65 px-2 py-1 rounded-full border border-[var(--line)]">
          Change
        </div>
      </button>

      {/* Goal pill */}
      <button
        onClick={onPickGoal}
        className={`w-full flex items-center gap-3 p-3 rounded-2xl border mb-3 active:scale-[0.99] transition ${
          role
            ? "border-lavender-500 bg-lavender-50 dark:bg-lavender-950"
            : "border-dashed border-[var(--line)] bg-[var(--bg-elev)]"
        }`}
      >
        <div
          className={`h-10 w-10 rounded-xl grid place-items-center ${
            role
              ? "bg-lavender-500/20 text-lavender-700 dark:text-lavender-200"
              : "bg-[var(--bg)] opacity-70"
          }`}
        >
          <Target size={20} strokeWidth={2.25} />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <div className="text-[10px] uppercase tracking-wide opacity-65">
            Career goal
          </div>
          <div className="text-sm font-semibold truncate">
            {role ? role.title : "Tap to set a career goal"}
          </div>
        </div>
        {pct !== null && (
          <div className="flex-shrink-0 text-right">
            <div className="text-base font-bold text-lavender-700 dark:text-lavender-200">
              {pct}%
            </div>
            <div className="text-[10px] opacity-65">ready</div>
          </div>
        )}
      </button>

      {/* Tree — re-key on person to re-trigger the entrance animation */}
      <div className="relative rounded-3xl border border-[var(--line)] bg-[var(--bg-elev)] overflow-hidden">
        <div className="aspect-square w-full">
          <SkillTree
            key={person.id}
            person={person}
            role={role}
            selectedSkillId={selectedSkill?.id ?? null}
            onSelectSkill={onSelectSkill}
          />
        </div>
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] opacity-75 pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />
            <span>acquired</span>
          </div>
          {role && (
            <>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full border-2 border-brand-500 border-dashed" />
                <span>still needed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--bg)] border border-[var(--line)]" />
                <span>not on path</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Gap summary + CTA */}
      {gap && role && (
        <div className="mt-3 rounded-2xl border border-[var(--line)] bg-[var(--bg-elev)] p-3 flex items-center gap-3 animate-fade-in">
          <div
            className={`h-10 w-10 rounded-xl grid place-items-center flex-shrink-0 ${
              gap.missing.length === 0
                ? "bg-brand-500/15 text-brand-600 dark:text-brand-300"
                : "bg-lavender-500/15 text-lavender-700 dark:text-lavender-200"
            }`}
          >
            {gap.missing.length === 0 ? (
              <PartyPopper size={20} strokeWidth={2.25} />
            ) : (
              <Compass size={20} strokeWidth={2.25} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold">
              {gap.missing.length === 0
                ? `Ready for ${role.title}!`
                : `${gap.missing.length} skill${gap.missing.length === 1 ? "" : "s"} to go`}
            </div>
            <div className="text-[11px] opacity-70 truncate flex items-center gap-1 flex-wrap">
              {gap.missing.length > 0 ? (
                gap.missing.slice(0, 3).map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <span key={s.id} className="inline-flex items-center gap-1">
                      {i > 0 && <span className="opacity-40">·</span>}
                      <Icon size={11} strokeWidth={2.25} />
                      <span>{s.name}</span>
                    </span>
                  );
                })
              ) : (
                <span>Next stop: that promotion.</span>
              )}
            </div>
          </div>
          <button
            onClick={onSeeRoadmap}
            className="flex-shrink-0 inline-flex items-center gap-1 rounded-full bg-brand-500 text-white text-xs font-semibold px-3 py-2 active:scale-95 transition shadow"
          >
            Roadmap
            <ArrowRight size={13} strokeWidth={2.5} />
          </button>
        </div>
      )}

      {!role && (
        <div className="mt-3 text-center text-[12px] opacity-70 px-4">
          Tap any skill on the tree to learn about it — or set a career goal
          above to light up the path.
        </div>
      )}
    </div>
  );
}

function RoadmapView({
  person,
  role,
  onBack,
}: {
  person: Person;
  role: Role;
  onBack: () => void;
}) {
  return (
    <div className="animate-fade-in space-y-4">
      <button
        onClick={onBack}
        className="text-xs opacity-70 hover:opacity-100 inline-flex items-center gap-1"
      >
        <ArrowLeft size={14} strokeWidth={2.25} />
        <span>Back to tree</span>
      </button>
      <RoadmapCard person={person} role={role} />
      <PdfDownload person={person} role={role} />
    </div>
  );
}

function Sheet({
  children,
  onClose,
  title,
  size = "md",
  extra,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
  size?: "md" | "lg";
  extra?: React.ReactNode;
}) {
  const maxWidth = size === "lg" ? "sm:max-w-lg" : "sm:max-w-md";
  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidth} bg-[var(--bg-elev)] rounded-t-3xl sm:rounded-3xl p-5 border-t sm:border border-[var(--line)] shadow-2xl animate-pop-in max-h-[85vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[var(--line)] sm:hidden" />
        <div className="flex items-center justify-between mb-3 gap-2">
          <div className="text-sm font-bold">{title}</div>
          <div className="flex items-center gap-2">
            {extra}
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full bg-[var(--bg)] grid place-items-center opacity-70 hover:opacity-100"
              aria-label="Close"
            >
              <X size={16} strokeWidth={2.25} />
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
