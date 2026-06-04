"use client";

import { useMemo, useState } from "react";
import { people, roles, getSkillGap } from "@/lib/data";
import { Person, Role, Skill } from "@/lib/types";
import SkillTree from "@/components/SkillTree";
import PersonPicker from "@/components/PersonPicker";
import RolePicker from "@/components/RolePicker";
import SkillSheet from "@/components/SkillSheet";
import RoadmapCard from "@/components/RoadmapCard";
import TeamBuilder from "@/components/TeamBuilder";
import ThemeToggle from "@/components/ThemeToggle";

type Mode = "explorer" | "team";
type View = "tree" | "roadmap";

export default function Page() {
  const [mode, setMode] = useState<Mode>("explorer");
  const [view, setView] = useState<View>("tree");
  const [person, setPerson] = useState<Person>(people[7]); // Tomás — junior, big tree to fill
  const [role, setRole] = useState<Role | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [pickingGoal, setPickingGoal] = useState(false);
  const [pickingPerson, setPickingPerson] = useState(false);

  const gap = useMemo(
    () => (role ? getSkillGap(person, role) : null),
    [person, role]
  );

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[var(--bg)]/85 backdrop-blur border-b border-[var(--line)]">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 grid place-items-center text-white text-sm font-bold shadow">
              ✦
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
              <button
                onClick={() => {
                  setMode("explorer");
                  setView("tree");
                  setSelectedSkill(null);
                }}
                className={`px-3 py-1.5 rounded-full transition ${
                  mode === "explorer"
                    ? "bg-brand-500 text-white font-semibold"
                    : "opacity-75"
                }`}
              >
                My Tree
              </button>
              <button
                onClick={() => {
                  setMode("team");
                  setSelectedSkill(null);
                }}
                className={`px-3 py-1.5 rounded-full transition ${
                  mode === "team"
                    ? "bg-brand-500 text-white font-semibold"
                    : "opacity-75"
                }`}
              >
                Team
              </button>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-4">
        {mode === "explorer" && view === "tree" && (
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

        {mode === "explorer" && view === "roadmap" && role && (
          <RoadmapView
            person={person}
            role={role}
            onBack={() => setView("tree")}
          />
        )}

        {mode === "team" && (
          <div className="animate-fade-in">
            <div className="mb-3">
              <h2 className="text-lg font-bold">Build a complementary team</h2>
              <p className="text-xs opacity-70 mt-0.5">
                Pick a role to staff. The app suggests who covers what — toggle people in
                or out to balance the squad.
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
        >
          <PersonPicker
            people={people}
            selectedId={person.id}
            onSelect={(p) => {
              setPerson(p);
              setPickingPerson(false);
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
      <SkillSheet
        skill={selectedSkill}
        person={person}
        role={role}
        onClose={() => setSelectedSkill(null)}
      />
    </div>
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

  return (
    <div className="animate-fade-in">
      {/* Identity strip */}
      <button
        onClick={onPickPerson}
        className="w-full flex items-center gap-3 p-3 rounded-2xl border border-[var(--line)] bg-[var(--bg-elev)] mb-3 active:scale-[0.99] transition"
      >
        <div className="h-12 w-12 rounded-2xl bg-brand-500 text-white grid place-items-center text-2xl">
          {person.avatar}
        </div>
        <div className="min-w-0 flex-1 text-left">
          <div className="text-sm font-bold truncate">{person.name}</div>
          <div className="text-[11px] opacity-70 truncate">
            {person.currentRole} · {person.skillIds.length} skills
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
            ? "border-brand-500 bg-brand-50 dark:bg-brand-950"
            : "border-dashed border-[var(--line)] bg-[var(--bg-elev)]"
        }`}
      >
        <div
          className={`h-10 w-10 rounded-xl grid place-items-center text-lg ${
            role ? "bg-brand-500/20 text-brand-600 dark:text-brand-200" : "bg-[var(--bg)] opacity-70"
          }`}
        >
          🎯
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
            <div className="text-base font-bold text-brand-600 dark:text-brand-300">
              {pct}%
            </div>
            <div className="text-[10px] opacity-65">ready</div>
          </div>
        )}
      </button>

      {/* Tree */}
      <div className="relative rounded-3xl border border-[var(--line)] bg-[var(--bg-elev)] overflow-hidden">
        <div className="aspect-square w-full">
          <SkillTree
            person={person}
            role={role}
            selectedSkillId={selectedSkill?.id ?? null}
            onSelectSkill={onSelectSkill}
          />
        </div>
        {/* Legend */}
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
          <div className="text-2xl">{gap.missing.length === 0 ? "🎉" : "🧭"}</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold">
              {gap.missing.length === 0
                ? `Ready for ${role.title}!`
                : `${gap.missing.length} skill${gap.missing.length === 1 ? "" : "s"} to go`}
            </div>
            <div className="text-[11px] opacity-70 truncate">
              {gap.missing
                .slice(0, 3)
                .map((s) => `${s.icon} ${s.name}`)
                .join(" · ") || "Next stop: that promotion."}
            </div>
          </div>
          <button
            onClick={onSeeRoadmap}
            className="flex-shrink-0 rounded-full bg-brand-500 text-white text-xs font-semibold px-3 py-2 active:scale-95 transition shadow"
          >
            Roadmap →
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
        className="text-xs opacity-70 hover:opacity-100 flex items-center gap-1"
      >
        ← Back to tree
      </button>
      <RoadmapCard person={person} role={role} />
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg-elev)] p-4 text-sm">
        <div className="font-semibold mb-1">📸 Take a screenshot</div>
        <p className="text-xs opacity-75 leading-relaxed">
          This card is your takeaway from the booth. Screenshot it now — it
          shows your starting point, your target role across HR, Finance, or
          Admin, and what to learn next. Then come find us at the booth to
          plan the next step.
        </p>
      </div>
    </div>
  );
}

function Sheet({
  children,
  onClose,
  title,
  size = "md",
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
  size?: "md" | "lg";
}) {
  const maxWidth = size === "lg" ? "sm:max-w-lg" : "sm:max-w-md";
  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidth} bg-[var(--bg-elev)] rounded-t-3xl sm:rounded-3xl p-5 border-t sm:border border-[var(--line)] shadow-2xl animate-pop-in max-h-[80vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[var(--line)] sm:hidden" />
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold">{title}</div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-[var(--bg)] grid place-items-center text-base opacity-70 hover:opacity-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
