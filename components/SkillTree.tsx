"use client";

import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
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
  icon: LucideIcon;
}

const WEDGE_ARC = 360 / categories.length;
const TIER_RADII = [150, 238, 322];

function buildLayout(): { nodes: SkillNode[]; anchors: AnchorInfo[] } {
  const nodes: SkillNode[] = [];
  const anchors: AnchorInfo[] = [];

  categories.forEach((cat, ci) => {
    const anchorAngle = -90 + WEDGE_ARC * ci; // start at top, go clockwise
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
      const r = TIER_RADII[tier - 1];
      const arcDeg = WEDGE_ARC * (tier === 1 ? 0.55 : tier === 2 ? 0.76 : 0.85);
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

const NODE_R = 28;
const NODE_R_SELECTED = 32;
const ICON_SIZE = 26;

export default function SkillTree({
  person,
  role,
  selectedSkillId,
  onSelectSkill,
}: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
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

  const hovered = hoveredId ? nodeMap.get(hoveredId) ?? null : null;

  return (
    <svg
      viewBox="-395 -395 790 790"
      className="w-full h-full select-none"
      preserveAspectRatio="xMidYMid meet"
      onClick={() => onSelectSkill?.(null)}
    >
      {/* Faint category wedges */}
      {anchors.map((a) => {
        const startAngle = a.angle - WEDGE_ARC / 2;
        const endAngle = a.angle + WEDGE_ARC / 2;
        const R = 360;
        const rad1 = (startAngle * Math.PI) / 180;
        const rad2 = (endAngle * Math.PI) / 180;
        const largeArc = WEDGE_ARC > 180 ? 1 : 0;
        return (
          <path
            key={a.id}
            d={`M 0 0 L ${(Math.cos(rad1) * R).toFixed(1)} ${(
              Math.sin(rad1) * R
            ).toFixed(1)} A ${R} ${R} 0 ${largeArc} 1 ${(
              Math.cos(rad2) * R
            ).toFixed(1)} ${(Math.sin(rad2) * R).toFixed(1)} Z`}
            fill={a.color}
            opacity={0.06}
          />
        );
      })}

      {/* Tier rings */}
      {TIER_RADII.map((r) => (
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
        const Icon = a.icon;
        return (
          <g
            key={a.id + "-label"}
            transform={`translate(${lx.toFixed(1)} ${ly.toFixed(1)})`}
          >
            <g
              transform="translate(-14 -28)"
              style={{ color: a.color }}
            >
              <Icon size={28} strokeWidth={2.25} />
            </g>
            <text
              textAnchor="middle"
              dy="20"
              fontSize="14"
              fontWeight={700}
              fill={a.color}
              opacity={0.9}
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
        const isHovered = hoveredId === n.skill.id;
        const r = isSelected || isHovered ? NODE_R_SELECTED : NODE_R;
        const opacity = have ? 1 : required ? 0.95 : nice ? 0.75 : 0.5;
        const fill = have ? n.categoryColor : "var(--bg-elev)";
        const strokeColor =
          have || required || nice ? n.categoryColor : "currentColor";
        const strokeWidth = required && !have ? 2.75 : have ? 2.25 : 1.5;
        const iconColor = have
          ? "#ffffff"
          : required
            ? n.categoryColor
            : nice
              ? n.categoryColor
              : "currentColor";
        const Icon = n.skill.icon;

        return (
          <g
            key={n.skill.id}
            transform={`translate(${n.x.toFixed(1)} ${n.y.toFixed(1)})`}
            opacity={opacity}
            onClick={(e) => {
              e.stopPropagation();
              onSelectSkill?.(n.skill);
            }}
            onMouseEnter={() => setHoveredId(n.skill.id)}
            onMouseLeave={() =>
              setHoveredId((curr) => (curr === n.skill.id ? null : curr))
            }
            style={{ cursor: "pointer" }}
            className="transition-all duration-150"
          >
            {/* Bigger invisible touch target */}
            <circle r={36} fill="transparent" />
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
                  values={`${r + 4};${r + 10};${r + 4}`}
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
              className={isSelected || isHovered ? "skill-glow" : ""}
            />
            <g
              transform={`translate(${-ICON_SIZE / 2} ${-ICON_SIZE / 2})`}
              pointerEvents="none"
            >
              <Icon
                size={ICON_SIZE}
                color={iconColor}
                strokeWidth={have ? 2.25 : 2}
              />
            </g>
          </g>
        );
      })}

      {/* Hover tooltip */}
      {hovered && <Tooltip node={hovered} />}
    </svg>
  );
}

interface TooltipProps {
  node: SkillNode;
}

function Tooltip({ node }: TooltipProps) {
  const name = node.skill.name;
  const charW = 7.4;
  const padX = 14;
  const width = Math.max(70, name.length * charW + padX * 2);
  const height = 30;

  // Push tooltip outward along the node's radial direction
  const rad = (node.angle * Math.PI) / 180;
  const offset = NODE_R_SELECTED + 16;
  let cx = node.x + Math.cos(rad) * offset;
  let cy = node.y + Math.sin(rad) * offset;

  // Keep tooltip inside the viewBox
  const half = width / 2;
  cx = Math.max(-395 + half + 4, Math.min(395 - half - 4, cx));
  cy = Math.max(-395 + height / 2 + 4, Math.min(395 - height / 2 - 4, cy));

  return (
    <g
      transform={`translate(${cx.toFixed(1)} ${cy.toFixed(1)})`}
      pointerEvents="none"
    >
      <rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        rx={8}
        ry={8}
        fill={node.categoryColor}
        opacity={0.96}
      />
      <text
        x={0}
        y={5}
        textAnchor="middle"
        fontSize="14"
        fontWeight={600}
        fill="#ffffff"
      >
        {name}
      </text>
    </g>
  );
}
