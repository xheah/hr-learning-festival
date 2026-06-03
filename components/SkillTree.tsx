"use client";

import { useMemo } from "react";
import { categories, skills } from "@/lib/data";
import { Person, Role, Skill } from "@/lib/types";

interface SkillNode {
  skill: Skill;
  x: number;
  y: number;
  angle: number;
  categoryColor: string;
}

interface AnchorInfo {
  id: string;
  angle: number;
  color: string;
  name: string;
  icon: string;
}

function buildLayout(): { nodes: SkillNode[]; anchors: AnchorInfo[] } {
  const wedgeArc = 60;
  const tierRadii = [150, 238, 322];
  const nodes: SkillNode[] = [];
  const anchors: AnchorInfo[] = [];

  categories.forEach((cat, ci) => {
    const anchorAngle = -90 + 60 * ci; // start at top, go clockwise
    anchors.push({
      id: cat.id,
      angle: anchorAngle,
      color: cat.color,
      name: cat.short,
      icon: cat.icon,
    });

    const catSkills = skills.filter((s) => s.category === cat.id);
    const byTier: Record<number, Skill[]> = { 1: [], 2: [], 3: [] };
    catSkills.forEach((s) => byTier[s.tier].push(s));

    [1, 2, 3].forEach((tier) => {
      const tierSkills = byTier[tier];
      const r = tierRadii[tier - 1];
      const arcDeg = wedgeArc * (tier === 1 ? 0.55 : tier === 2 ? 0.78 : 0.88);
      tierSkills.forEach((s, i) => {
        const t = tierSkills.length === 1 ? 0.5 : i / (tierSkills.length - 1);
        const angle = anchorAngle - arcDeg / 2 + arcDeg * t;
        const rad = (angle * Math.PI) / 180;
        nodes.push({
          skill: s,
          x: Math.cos(rad) * r,
          y: Math.sin(rad) * r,
          angle,
          categoryColor: cat.color,
        });
      });
    });
  });

  return { nodes, anchors };
}

interface Props {
  person: Person;
  role?: Role | null;
  selectedSkillId?: string | null;
  onSelectSkill?: (s: Skill | null) => void;
}

export default function SkillTree({
  person,
  role,
  selectedSkillId,
  onSelectSkill,
}: Props) {
  const { nodes, anchors } = useMemo(() => buildLayout(), []);
  const haveSet = useMemo(() => new Set(person.skillIds), [person]);
  const requiredSet = useMemo(
    () => new Set(role?.requiredSkillIds ?? []),
    [role]
  );
  const niceSet = useMemo(
    () => new Set(role?.niceToHaveSkillIds ?? []),
    [role]
  );

  const nodeMap = useMemo(() => {
    const m = new Map<string, SkillNode>();
    nodes.forEach((n) => m.set(n.skill.id, n));
    return m;
  }, [nodes]);

  return (
    <svg
      viewBox="-395 -395 790 790"
      className="w-full h-full select-none"
      preserveAspectRatio="xMidYMid meet"
      onClick={() => onSelectSkill?.(null)}
    >
      {/* Faint category wedges */}
      {anchors.map((a) => {
        const startAngle = a.angle - 30;
        const endAngle = a.angle + 30;
        const R = 360;
        const rad1 = (startAngle * Math.PI) / 180;
        const rad2 = (endAngle * Math.PI) / 180;
        return (
          <path
            key={a.id}
            d={`M 0 0 L ${(Math.cos(rad1) * R).toFixed(1)} ${(
              Math.sin(rad1) * R
            ).toFixed(1)} A ${R} ${R} 0 0 1 ${(
              Math.cos(rad2) * R
            ).toFixed(1)} ${(Math.sin(rad2) * R).toFixed(1)} Z`}
            fill={a.color}
            opacity={0.06}
          />
        );
      })}

      {/* Tier rings */}
      {[150, 238, 322].map((r) => (
        <circle
          key={r}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={0.5}
          opacity={0.12}
          strokeDasharray="2 4"
        />
      ))}

      {/* Category labels around the outer edge */}
      {anchors.map((a) => {
        const r = 365;
        const rad = (a.angle * Math.PI) / 180;
        const lx = Math.cos(rad) * r;
        const ly = Math.sin(rad) * r;
        return (
          <g key={a.id + "-label"} transform={`translate(${lx.toFixed(1)} ${ly.toFixed(1)})`}>
            <text
              textAnchor="middle"
              dy="-6"
              fontSize="22"
              opacity={0.95}
            >
              {a.icon}
            </text>
            <text
              textAnchor="middle"
              dy="18"
              fontSize="13"
              fontWeight={600}
              fill={a.color}
              opacity={0.85}
            >
              {a.name}
            </text>
          </g>
        );
      })}

      {/* Prereq edges */}
      {nodes.map((n) => {
        if (!n.skill.prerequisites) return null;
        return n.skill.prerequisites.map((pid) => {
          const from = nodeMap.get(pid);
          if (!from) return null;
          const haveBoth = haveSet.has(n.skill.id) && haveSet.has(pid);
          const required = requiredSet.has(n.skill.id);
          const opacity = haveBoth ? 0.6 : required ? 0.35 : 0.18;
          // Curve via a midpoint biased toward centre
          const mx = (from.x + n.x) * 0.45;
          const my = (from.y + n.y) * 0.45;
          return (
            <path
              key={`${pid}->${n.skill.id}`}
              d={`M ${from.x.toFixed(1)} ${from.y.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${n.x.toFixed(1)} ${n.y.toFixed(1)}`}
              stroke={haveBoth ? n.categoryColor : "currentColor"}
              strokeWidth={haveBoth ? 2 : 1}
              fill="none"
              opacity={opacity}
              strokeDasharray={haveBoth ? "" : "3 4"}
            />
          );
        });
      })}

      {/* Person at centre */}
      <g>
        <circle r={52} fill="var(--brand)" opacity={0.18} />
        <circle r={44} fill="var(--brand)" />
        <text textAnchor="middle" dy="10" fontSize="36" pointerEvents="none">
          {person.avatar}
        </text>
        <text
          textAnchor="middle"
          dy="76"
          fontSize="14"
          fontWeight={700}
          fill="currentColor"
          pointerEvents="none"
        >
          {person.name}
        </text>
        <text
          textAnchor="middle"
          dy="92"
          fontSize="11"
          fill="currentColor"
          opacity={0.7}
          pointerEvents="none"
        >
          {person.currentRole}
        </text>
      </g>

      {/* Skill nodes */}
      {nodes.map((n) => {
        const have = haveSet.has(n.skill.id);
        const required = requiredSet.has(n.skill.id);
        const nice = niceSet.has(n.skill.id);
        const isSelected = selectedSkillId === n.skill.id;
        const r = isSelected ? 28 : 24;
        const opacity = have ? 1 : required ? 0.92 : nice ? 0.7 : 0.42;
        const fill = have ? n.categoryColor : "var(--bg-elev)";
        const strokeColor =
          have || required || nice ? n.categoryColor : "currentColor";
        const strokeWidth = required && !have ? 2.5 : have ? 2 : 1.5;

        // Label position — push away from centre
        const labelDist = r + 14;
        const rad = (n.angle * Math.PI) / 180;
        const labelOffsetX = Math.cos(rad) * labelDist;
        const labelOffsetY = Math.sin(rad) * labelDist;

        return (
          <g
            key={n.skill.id}
            transform={`translate(${n.x.toFixed(1)} ${n.y.toFixed(1)})`}
            opacity={opacity}
            onClick={(e) => {
              e.stopPropagation();
              onSelectSkill?.(n.skill);
            }}
            style={{ cursor: "pointer" }}
            className="transition-all duration-200"
          >
            {/* Bigger invisible touch target */}
            <circle r={34} fill="transparent" />
            {/* Target ring animation for required-but-missing */}
            {required && !have && (
              <circle
                r={r + 5}
                fill="none"
                stroke={n.categoryColor}
                strokeWidth={1.5}
                opacity={0.55}
              >
                <animate
                  attributeName="r"
                  values={`${r + 4};${r + 9};${r + 4}`}
                  dur="2.2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.6;0.1;0.6"
                  dur="2.2s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
            <circle
              r={r}
              fill={fill}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={required && !have ? "4 3" : nice && !have ? "2 3" : ""}
              className={isSelected ? "skill-glow" : ""}
            />
            <text
              textAnchor="middle"
              dy="7"
              fontSize="20"
              pointerEvents="none"
              opacity={have ? 1 : 0.65}
            >
              {n.skill.icon}
            </text>
            {/* Label sitting outside the node, pointing away from the centre */}
            <text
              x={labelOffsetX.toFixed(1)}
              y={labelOffsetY.toFixed(1)}
              textAnchor="middle"
              fontSize="9"
              fill="currentColor"
              opacity={have ? 0.85 : 0.55}
              pointerEvents="none"
            >
              {n.skill.name}
            </text>
            {have && (
              <text
                textAnchor="middle"
                dy={-r - 4}
                fontSize="11"
                pointerEvents="none"
              >
                ✓
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
