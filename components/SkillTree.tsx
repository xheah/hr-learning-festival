"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { categories, categoryById, getMastery, skills } from "@/lib/data";
import { MasteryLevel, Person, Role, Skill } from "@/lib/types";
import {
  type TreeLink,
  type TreeNode,
  useForceSimulation,
} from "@/lib/force";

interface RadialNode {
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

function buildLayout(): { nodes: RadialNode[]; anchors: AnchorInfo[] } {
  const nodes: RadialNode[] = [];
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
  /** When true, skip entrance + draw-in animations (used in Compare view). */
  noEntranceAnimation?: boolean;
  /** Static radial layout (default) vs live force-directed graph. */
  layout?: "radial" | "graph";
}

const NODE_R = 28;
const NODE_R_SELECTED = 32;
const ICON_SIZE = 26;
const TOOLTIP_MARGIN = 6;
const DRAG_THRESHOLD_PX = 4;

export default function SkillTree({
  person,
  role,
  selectedSkillId,
  onSelectSkill,
  noEntranceAnimation,
  layout = "radial",
}: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const { nodes: radialNodes, anchors } = useMemo(() => buildLayout(), []);

  const radialBySkill = useMemo(() => {
    const m = new Map<string, RadialNode>();
    radialNodes.forEach((n) => m.set(n.skill.id, n));
    return m;
  }, [radialNodes]);

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

  // ─── Force simulation (graph mode) ─────────────────────────
  // Built unconditionally so React hook order is stable. Includes one
  // sector hub node per sector — pinned at the label chip position — so
  // every skill physically attaches to its sector label via a link force.
  const sectorHubId = (catId: string) => `__sector_${catId}`;

  const simNodes = useMemo<TreeNode[]>(() => {
    const out: TreeNode[] = [
      {
        id: "__centre",
        kind: "centre",
        sector: "centre",
        x: 0,
        y: 0,
        fx: 0,
        fy: 0,
      },
    ];
    // One pinned hub per sector at radius 425 along its anchor angle —
    // exactly where the chip label is rendered, so the chip *is* the hub.
    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i]!;
      const angle = (-90 + WEDGE_ARC * i) * (Math.PI / 180);
      const x = Math.cos(angle) * 425;
      const y = Math.sin(angle) * 425;
      out.push({
        id: sectorHubId(cat.id),
        kind: "sector",
        sector: cat.id,
        x,
        y,
        fx: x,
        fy: y,
      });
    }
    for (const r of radialNodes) {
      out.push({
        id: r.skill.id,
        kind: "skill",
        sector: r.skill.category,
        x: r.x,
        y: r.y,
      });
    }
    return out;
  }, [radialNodes]);

  const simLinks = useMemo<TreeLink[]>(() => {
    const out: TreeLink[] = [];
    // Sector hub → skill: the dominant spring. Every skill attaches to its
    // sector label. Distance 160 lets the cluster fan out below the chip.
    for (const r of radialNodes) {
      out.push({
        source: sectorHubId(r.skill.category),
        target: r.skill.id,
        distance: 160,
        strength: 0.55,
      });
    }
    // Prereq links — keep the within-sector dependency structure visible.
    for (const r of radialNodes) {
      for (const pid of r.skill.prerequisites ?? []) {
        out.push({
          source: pid,
          target: r.skill.id,
          distance: 70,
          strength: 0.7,
        });
      }
    }
    // Acquired skills get a subtle extra pull toward the person so they
    // float a little nearer the centre.
    for (const skillId of haveSet) {
      out.push({
        source: "__centre",
        target: skillId,
        distance: 220,
        strength: 0.12,
      });
    }
    return out;
  }, [radialNodes, haveSet]);

  const force = useForceSimulation(simNodes, simLinks);

  // ─── Drag handling (graph mode) ────────────────────────────
  const dragRef = useRef<{ id: string | null; moved: boolean; startX: number; startY: number }>(
    { id: null, moved: false, startX: 0, startY: 0 }
  );

  const svgPoint = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const p = pt.matrixTransform(ctm.inverse());
    return { x: p.x, y: p.y };
  }, []);

  // ─── Position resolver ─────────────────────────────────────
  // Reading force.tick subscribes us to simulation ticks so React re-renders
  // with the live positions.
  const _tick = force.tick;
  const getPos = (skillId: string): { x: number; y: number; angle: number } => {
    if (layout === "graph") {
      const n = force.nodes().find((x) => x.id === skillId);
      if (n) {
        const angle = (Math.atan2(n.y, n.x) * 180) / Math.PI;
        return { x: n.x, y: n.y, angle };
      }
    }
    const r = radialBySkill.get(skillId);
    return r ? { x: r.x, y: r.y, angle: r.angle } : { x: 0, y: 0, angle: 0 };
  };

  const getCentrePos = (): { x: number; y: number } => {
    if (layout === "graph") {
      const c = force.nodes().find((n) => n.id === "__centre");
      if (c) return { x: c.x, y: c.y };
    }
    return { x: 0, y: 0 };
  };

  const hovered = hoveredId
    ? (() => {
        const r = radialBySkill.get(hoveredId);
        if (!r) return null;
        const pos = getPos(hoveredId);
        return {
          skill: r.skill,
          x: pos.x,
          y: pos.y,
          angle: pos.angle,
          categoryColor: r.categoryColor,
        };
      })()
    : null;

  const PersonIcon = person.icon;
  const isGraph = layout === "graph";
  const centre = getCentrePos();

  return (
    <svg
      ref={svgRef}
      viewBox="-470 -470 940 940"
      className="w-full h-full select-none"
      preserveAspectRatio="xMidYMid meet"
      onClick={() => onSelectSkill?.(null)}
      style={{ touchAction: isGraph ? "none" : undefined }}
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

      {/* Radial-only chrome: sector wedges + tier rings */}
      {!isGraph && (
        <>
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
        </>
      )}

      {/* Sector → skill spokes in graph mode — faint hub-and-spoke lines
       *  so visitors see which label each skill belongs to. Rendered
       *  before nodes so they sit behind everything. */}
      {isGraph &&
        radialNodes.map((rn) => {
          const cat = categoryById[rn.skill.category];
          if (!cat) return null;
          const hub = anchors.find((a) => a.id === rn.skill.category);
          if (!hub) return null;
          const rad = (hub.angle * Math.PI) / 180;
          const hubX = Math.cos(rad) * 425;
          const hubY = Math.sin(rad) * 425;
          const skillPos = getPos(rn.skill.id);
          return (
            <line
              key={`spoke-${rn.skill.id}`}
              x1={hubX.toFixed(1)}
              y1={hubY.toFixed(1)}
              x2={skillPos.x.toFixed(1)}
              y2={skillPos.y.toFixed(1)}
              stroke={cat.color}
              strokeWidth={0.8}
              opacity={0.22}
            />
          );
        })}

      {/* Sector label chips — same in both layouts */}
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

      {/* Prereq edges — endpoint positions are live in graph mode */}
      {radialNodes.map((rn) => {
        if (!rn.skill.prerequisites) return null;
        return rn.skill.prerequisites.map((pid) => {
          const from = radialBySkill.get(pid);
          if (!from) return null;
          const haveBoth = haveSet.has(rn.skill.id) && haveSet.has(pid);
          const required = requiredSet.has(rn.skill.id);
          const opacity = haveBoth ? 0.7 : required ? 0.35 : 0.18;
          const a = getPos(pid);
          const b = getPos(rn.skill.id);
          const mx = (a.x + b.x) * 0.45;
          const my = (a.y + b.y) * 0.45;
          // Animation only in radial entrance — drawn-in lines would look weird
          // mid-simulation.
          const animateThis = !noEntranceAnimation && !isGraph && haveBoth;
          return (
            <path
              key={`${pid}->${rn.skill.id}`}
              d={`M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`}
              stroke={haveBoth ? rn.categoryColor : "currentColor"}
              strokeWidth={haveBoth ? 2.25 : 1}
              fill="none"
              opacity={opacity}
              strokeDasharray={haveBoth ? "" : "3 4"}
              className={animateThis ? "line-drawn" : ""}
            />
          );
        });
      })}

      {/* Person at centre — pinned in graph mode via fx/fy */}
      <g transform={`translate(${centre.x.toFixed(1)} ${centre.y.toFixed(1)})`}>
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
      {radialNodes.map((rn, idx) => {
        const level = getMastery(person, rn.skill.id);
        const have = level > 0;
        const required = requiredSet.has(rn.skill.id);
        const nice = niceSet.has(rn.skill.id);
        const isSelected = selectedSkillId === rn.skill.id;
        const isHovered = hoveredId === rn.skill.id;
        const r = isSelected || isHovered ? NODE_R_SELECTED : NODE_R;
        const opacity = have ? 1 : required ? 0.95 : nice ? 0.75 : 0.5;
        const fill = have ? rn.categoryColor : "var(--bg-elev)";
        const strokeColor =
          have || required || nice ? rn.categoryColor : "currentColor";
        const strokeWidth = required && !have ? 2.75 : have ? 2.25 : 1.5;
        const iconColor = have
          ? "#ffffff"
          : required
            ? rn.categoryColor
            : nice
              ? rn.categoryColor
              : "currentColor";
        const Icon = rn.skill.icon;
        const pos = getPos(rn.skill.id);
        const animateNode = !noEntranceAnimation && !isGraph;

        const handlePointerDown = (e: React.PointerEvent<SVGGElement>) => {
          if (!isGraph) return;
          e.stopPropagation();
          (e.currentTarget as SVGGElement).setPointerCapture(e.pointerId);
          dragRef.current = {
            id: rn.skill.id,
            moved: false,
            startX: e.clientX,
            startY: e.clientY,
          };
          force.startDrag(rn.skill.id);
        };
        const handlePointerMove = (e: React.PointerEvent<SVGGElement>) => {
          if (!isGraph) return;
          const drag = dragRef.current;
          if (drag.id !== rn.skill.id) return;
          if (
            !drag.moved &&
            Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) >
              DRAG_THRESHOLD_PX
          ) {
            drag.moved = true;
          }
          if (drag.moved) {
            const p = svgPoint(e.clientX, e.clientY);
            if (p) force.drag(rn.skill.id, p.x, p.y);
          }
        };
        const handlePointerUp = (e: React.PointerEvent<SVGGElement>) => {
          if (!isGraph) {
            // Radial mode: simple tap-to-select.
            e.stopPropagation();
            onSelectSkill?.(rn.skill);
            return;
          }
          const drag = dragRef.current;
          (e.currentTarget as SVGGElement).releasePointerCapture(e.pointerId);
          if (drag.id === rn.skill.id) {
            if (!drag.moved) {
              // No drag — treat as tap.
              onSelectSkill?.(rn.skill);
              force.endDrag(rn.skill.id, { pin: false });
            } else {
              // Pin where dropped (Obsidian-style).
              force.endDrag(rn.skill.id, { pin: true });
            }
            dragRef.current = { id: null, moved: false, startX: 0, startY: 0 };
            e.stopPropagation();
          }
        };

        return (
          <g
            key={rn.skill.id}
            transform={`translate(${pos.x.toFixed(1)} ${pos.y.toFixed(1)})`}
            opacity={opacity}
            onClick={(e) => {
              // Radial uses click for tap. Graph uses pointer up.
              if (isGraph) return;
              e.stopPropagation();
              onSelectSkill?.(rn.skill);
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onMouseEnter={() => setHoveredId(rn.skill.id)}
            onMouseLeave={() =>
              setHoveredId((curr) => (curr === rn.skill.id ? null : curr))
            }
            style={{
              cursor: isGraph ? "grab" : "pointer",
              transition: "opacity 220ms ease-in-out",
            }}
          >
            <g
              className={animateNode ? "node-in" : undefined}
              style={animateNode ? { animationDelay: `${80 + idx * 22}ms` } : undefined}
            >
              <circle r={36} fill="transparent" />
              {required && !have && (
                <circle
                  r={r + 5}
                  fill="none"
                  stroke={rn.categoryColor}
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
              {have && (
                <MasteryRing
                  r={r + 5}
                  level={level}
                  color={rn.categoryColor}
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
  const portion = level / 3;
  const offset = circumference * (1 - portion);
  return (
    <>
      <circle
        cx={0}
        cy={0}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={3}
        opacity={0.18}
      />
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
  node: {
    skill: Skill;
    x: number;
    y: number;
    angle: number;
    categoryColor: string;
  };
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
