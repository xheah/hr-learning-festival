"use client";

import { useMemo, useState } from "react";
import { Check, ChevronRight, X } from "lucide-react";
import { categories, skills } from "@/lib/data";
import { AVATAR_CHOICES, NewPersonInput } from "@/lib/storage";
import {
  MASTERY_NAMES,
  MasteryLevel,
  SkillMastery,
} from "@/lib/types";

interface Props {
  onCancel: () => void;
  onSubmit: (input: NewPersonInput) => void;
}

export default function NewPersonForm({ onCancel, onSubmit }: Props) {
  const [step, setStep] = useState<0 | 1 | 2>(0);

  const [name, setName] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [yearsExperience, setYearsExperience] = useState(2);
  const [iconId, setIconId] = useState<string>(AVATAR_CHOICES[0].id);
  const [bio, setBio] = useState("");

  // mastery map — string id -> level
  const [mastery, setMastery] = useState<Record<string, MasteryLevel>>({});

  const cycleLevel = (id: string) => {
    setMastery((prev) => {
      const cur = prev[id] ?? 0;
      const next = ((cur + 1) % 4) as MasteryLevel;
      const copy = { ...prev };
      if (next === 0) delete copy[id];
      else copy[id] = next;
      return copy;
    });
  };

  const skillsByCategory = useMemo(() => {
    return categories.map((cat) => ({
      cat,
      list: skills.filter((s) => s.category === cat.id),
    }));
  }, []);

  const acquired: SkillMastery[] = Object.entries(mastery).map(([id, level]) => ({
    id,
    level: level as 1 | 2 | 3,
  }));

  const canFinish = step === 2 && name.trim().length > 0;

  return (
    <div className="space-y-4">
      <Stepper step={step} />

      {step === 0 && (
        <div className="space-y-3">
          <Field label="Your name">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={32}
              placeholder="e.g. Alex Liu"
              className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-lavender-500"
            />
          </Field>
          <Field label="Current role">
            <input
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              maxLength={48}
              placeholder="e.g. HR Coordinator"
              className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-lavender-500"
            />
          </Field>
          <Field label="Years of experience">
            <input
              type="number"
              min={0}
              max={50}
              value={yearsExperience}
              onChange={(e) => setYearsExperience(Number(e.target.value))}
              className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-lavender-500"
            />
          </Field>
          <Field label="A one-line bio (optional)">
            <input
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={80}
              placeholder="e.g. Loves spreadsheets and good coffee."
              className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-lavender-500"
            />
          </Field>
        </div>
      )}

      {step === 1 && (
        <div>
          <div className="text-xs opacity-70 mb-2">
            Pick an avatar that's a bit you.
          </div>
          <div className="grid grid-cols-4 gap-2">
            {AVATAR_CHOICES.map((a) => {
              const Icon = a.icon;
              const active = a.id === iconId;
              return (
                <button
                  key={a.id}
                  onClick={() => setIconId(a.id)}
                  title={a.label}
                  className={`h-14 grid place-items-center rounded-xl border transition ${
                    active
                      ? "border-lavender-500 bg-lavender-50 dark:bg-lavender-950 text-lavender-700 dark:text-lavender-200"
                      : "border-[var(--line)] bg-[var(--bg-elev)] hover:border-lavender-400"
                  }`}
                >
                  <Icon size={22} strokeWidth={2.25} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          <div className="text-xs opacity-70">
            Tap a skill to cycle its level: Locked → Practicing → Competent →
            Expert. <span className="font-semibold">{acquired.length}</span>{" "}
            skill{acquired.length === 1 ? "" : "s"} so far.
          </div>
          {skillsByCategory.map(({ cat, list }) => (
            <div key={cat.id}>
              <div
                className="text-[10px] uppercase tracking-wide font-bold mb-1.5 mt-2"
                style={{ color: cat.color }}
              >
                {cat.short}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {list.map((s) => {
                  const level = mastery[s.id] ?? 0;
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.id}
                      onClick={() => cycleLevel(s.id)}
                      className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 text-left transition ${
                        level > 0
                          ? "border-lavender-500 bg-lavender-50 dark:bg-lavender-950"
                          : "border-[var(--line)] bg-[var(--bg-elev)]"
                      }`}
                    >
                      <Icon size={13} strokeWidth={2.25} />
                      <span className="text-[11px] flex-1 truncate">
                        {s.name}
                      </span>
                      <MasteryDots level={level} color={cat.color} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 pt-2 border-t border-[var(--line)]">
        <button
          onClick={onCancel}
          className="flex-1 rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm font-medium"
        >
          Cancel
        </button>
        {step < 2 && (
          <button
            onClick={() => setStep((step + 1) as 0 | 1 | 2)}
            disabled={step === 0 && name.trim().length === 0}
            className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-lavender-500 text-white px-4 py-2.5 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight size={15} strokeWidth={2.5} />
          </button>
        )}
        {step === 2 && (
          <button
            onClick={() =>
              onSubmit({
                name,
                currentRole,
                yearsExperience,
                iconId,
                bio,
                skills: acquired,
              })
            }
            disabled={!canFinish}
            className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-lavender-500 text-white px-4 py-2.5 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Check size={15} strokeWidth={2.5} />
            Create
          </button>
        )}
      </div>
    </div>
  );
}

function Stepper({ step }: { step: 0 | 1 | 2 }) {
  const labels = ["About", "Avatar", "Skills"];
  return (
    <div className="flex items-center gap-1.5">
      {labels.map((label, i) => (
        <div
          key={label}
          className={`flex-1 text-center text-[10px] uppercase tracking-wide py-1 rounded-md border ${
            i === step
              ? "border-lavender-500 bg-lavender-500/15 text-lavender-700 dark:text-lavender-200 font-semibold"
              : i < step
                ? "border-lavender-300 text-lavender-700 dark:text-lavender-300"
                : "border-[var(--line)] opacity-50"
          }`}
        >
          {i + 1}. {label}
        </div>
      ))}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wide opacity-65 mb-1 block">
        {label}
      </span>
      {children}
    </label>
  );
}

function MasteryDots({ level, color }: { level: MasteryLevel; color: string }) {
  return (
    <span
      className="flex items-center gap-0.5"
      title={MASTERY_NAMES[level]}
    >
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full"
          style={{
            background: i <= level ? color : "var(--line)",
            opacity: i <= level ? 1 : 0.6,
          }}
        />
      ))}
    </span>
  );
}
