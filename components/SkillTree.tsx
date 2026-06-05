"use client";

import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { categories, getMastery, skills } from "@/lib/data";
import { MasteryLevel, Person, Role, Skill } from "@/lib/types";

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
  accent: string;
  darkColor: string;
  name: string;
  icon: LucideIcon;
}

const WEDGE_ARC = 360 / categories.length;
const TIER_RADII = [150, 238, 322];

function buildLayout(): { nodes: SkillNode[]; anchors: AnchorInfo[] } {
  const nodes: SkillNode[] = [];
  const anchors: AnchorInfo[] = [];

  categories.forEach((cat, ci) => {
    const anchorAngle = -90 + WEDGE_ARC * ci;
    anchors.push({
      id: cat.id,
      angle: anchorAngle,
      color: cat.color,
      accent: cat.accent,
      darkColor: cat.darkColor,
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
  /** When true the tree skips its entrance animation (used in compact / Compare view). */
  noEntranceAnimation?: boolean;
}

const NODE_R = 28;
const NODE_R_SELECTED = 32;
const ICON_SIZE = 26;
const TOOLTIP_MARGIN = 6;

export default function SkillTree({
  person,
  role,
  selectedSkillId,
  onSelectSkill,
  noEntranceAnimation,
}: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { nodes, anchors } = useMemo(() => buildLayout(), []);

  // Mastery-aware membership: have if mastery > 0
  const haveSet = useMemo(
    () => new Set(person.skills.filter((s) => s.level > 0).map((s) => s.id)),
    [person]
  );
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

  /** Per-skill entrance delay (ms) — tier 1 first, then tier 2, then tier 3. */
  const delayMap = useMemo(() => {
    const sorted = [...nodes].sort((a, b) => a.skill.tier - b.skill.tier);
    const m = new Map<string, number>();
    sorted.forEach((n, i) => {
      m.set(n.skill.id, 80 + i * 22);
    });
    return m;
  }, [nodes]);

  const hovered = hoveredId ? nodeMap.get(hoveredId) ?? null : null;
  const PersonIcon = person.icon;

  return (
    <svg
      viewBox="-470 -470 940 940"
      className="w-full h-full select-none"
      preserveAspectRatio="xMidYMid meet"
      onClick={() => onSelectSkill?.(null)}
    >
      <defs>
        <filter id="label-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx="0"
            dy="4"
            stdDeviation="6"
            floodColor="#000000"
            floodOpacity="0.22"
          />
        </filter>
      </defs>

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

      {/* Sector label chips */}
      {anchors.map((a) => {
        const r = 425;
        const rad = (a.angle * Math.PI) / 180;
        const lx = Math.cos(rad) * r;
        const ly = Math.sin(rad) * r;
        const Icon = a.icon;
        return (
          <g
            key={a.id + "-label"}
            transform={`translate(${lx.toFixed(1)} ${ly.toFixed(1)})`}
          >
            <rect
              x={-60}
              y={-38}
              width={120}
              height={76}
              rx={18}
              ry={18}
              fill={a.accent}
              stroke={a.color}
              strokeWidth={2.75}
              filter="url(#label-shadow)"
            />
            <g transform="translate(-17 -28)" style={{ color: a.darkColor }}>
              <Icon size={34} strokeWidth={2.4} />
            </g>
            <text
              textAnchor="middle"
              dy="28"
              fontSize="17"
              fontWeight={800}
              fill={a.darkColor}
              letterSpacing={0.4}
              fontFamily="var(--font-display), var(--font-sans), system-ui, sans-serif"
            >
              {a.name}
            </text>
          </g>
        );
      })}

      {/* Prereq edges — when both endpoints are acquired, the line "draws" in
       *  with stroke-dashoffset animation timed to follow the destination node. */}
      {nodes.map((n) => {
        if (!n.skill.prerequisites) return null;
        return n.skill.prerequisites.map((pid) => {
          const from = nodeMap.get(pid);
          if (!from) return null;
          const haveBoth = haveSet.has(n.skill.id) && haveSet.has(pid);
          const required = requiredSet.has(n.skill.id);
          const opacity = haveBoth ? 0.7 : required ? 0.35 : 0.18;
          const mx = (from.x + n.x) * 0.45;
          const my = (from.y + n.y) * 0.45;
          const fromDelay = delayMap.get(from.skill.id) ?? 0;
          const toDelay = delayMap.get(n.skill.id) ?? 0;
          const lineDelay = Math.max(fromDelay, toDelay) + 200;
          return (
            <path
              key={`${pid}->${n.skill.id}`}
              d={`M ${from.x.toFixed(1)} ${from.y.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${n.x.toFixed(1)} ${n.y.toFixed(1)}`}
              stroke={haveBoth ? n.categoryColor : "currentColor"}
              strokeWidth={haveBoth ? 2.25 : 1}
              fill="none"
              opacity={opacity}
              strokeDasharray={haveBoth ? "" : "3 4"}
              className={haveBoth && !noEntranceAnimation ? "line-drawn" : ""}
              style={
                haveBoth && !noEntranceAnimation
                  ? { animationDelay: `${lineDelay}ms` }
                  : undefined
              }
            />
          );
        });
      })}

      {/* Person at centre */}
      <g>
        <circle r={52} fill="var(--brand)" opacity={0.18} />
        <circle r={44} fill="var(--brand)" />
        <g
          transform="translate(-22 -22)"
          pointerEvents="none"
          style={{ color: "#ffffff" }}
        >
          <PersonIcon size={44} strokeWidth={2} />
        </g>
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
        const level = getMastery(person, n.skill.id);
        const have = level > 0;
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
        const delay = delayMap.get(n.skill.id) ?? 0;

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
            style={{
              cursor: "pointer",
              transition: "opacity 220ms ease-in-out",
            }}
          >
            <g
              className={noEntranceAnimation ? undefined : "node-in"}
              style={
                noEntranceAnimation ? undefined : { animationDelay: `${delay}ms` }
              }
            >
              {/* Bigger invisible touch target */}
              <circle r={36} fill="transparent" />
              {/* Pulsing target ring for required-but-missing */}
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
              {/* Mastery ring — sits just outside the node circle, filling as the
               *  person progresses Practicing (33%) → Competent (66%) → Expert (100%). */}
              {have && (
                <MasteryRing
                  r={r + 5}
                  level={level}
                  color={n.categoryColor}
                />
              )}
              <circle
                r={r}
                fill={fill}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={
                  required && !have ? "4 3" : nice && !have ? "2 3" : ""
                }
                className={`skill-circle ${isSelected || isHovered ? "skill-glow" : ""}`}
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
          </g>
        );
      })}

      {/* Hover tooltip */}
      {hovered && <Tooltip node={hovered} />}
    </svg>
  );
}

function MasteryRing({
  r,
  level,
  color,
}: {
  r: number;
  level: MasteryLevel;
  color: string;
}) {
  if (level <= 0) return null;
  const circumference = 2 * Math.PI * r;
  const portion = level / 3; // 1 → 33%, 2 → 66%, 3 → 100%
  const offset = circumference * (1 - portion);
  return (
    <>
      {/* Background ring (full circle, faint) */}
      <circle
        cx={0}
        cy={0}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={3}
        opacity={0.18}
      />
      {/* Mastery progress */}
      <circle
        cx={0}
        cy={0}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90)"
        style={{
          transition:
            "stroke-dashoffset 360ms ease-in-out, stroke 240ms ease-in-out",
        }}
      />
    </>
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
  const halfW = width / 2;
  const halfH = height / 2;

  const placeAbove = node.y < 0;
  const dy =
    (NODE_R_SELECTED + TOOLTIP_MARGIN + halfH) * (placeAbove ? -1 : 1);
  let cx = node.x;
  const cy = node.y + dy;

  const PAD = 4;
  cx = Math.max(-470 + halfW + PAD, Math.min(470 - halfW - PAD, cx));

  return (
    <g
      transform={`translate(${cx.toFixed(1)} ${cy.toFixed(1)})`}
      pointerEvents="none"
    >
      <g className="tooltip-pop">
        <rect
          x={-halfW}
          y={-halfH}
          width={width}
          height={height}
          rx={8}
          ry={8}
          fill={node.categoryColor}
          opacity={0.97}
        />
        {/* Dark legible text — using #1a1310 keeps contrast ≥ 4:1 on every
         *  sector colour (white was unreadable over the Finance teal and
         *  Admin honey hues). */}
        <text
          x={0}
          y={5}
          textAnchor="middle"
          fontSize="14"
          fontWeight={700}
          fill="#1a1310"
          letterSpacing={0.2}
        >
          {name}
        </text>
      </g>
    </g>
  );
}
