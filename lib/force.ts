"use client";

/**
 * useForceSimulation — d3-force wrapper that drives the graph view of the
 * skill tree. The hook:
 *   1. Owns a Simulation<TreeNode> instance for the component's lifetime.
 *   2. Mutates each node's x/y/vx/vy in place on every tick.
 *   3. Calls React state updates so the render reflects the live positions.
 *   4. Exposes drag handlers that pin / re-anchor nodes.
 *
 * Architecture:
 *   - One *centre* node (the person), pinned at (0, 0). Not draggable.
 *   - One *sector* hub per category (HR, Finance, Admin), pinned at the same
 *     positions as the static label chips. Not draggable — chip ≡ hub.
 *   - One *skill* node per skill, connected to its sector hub via a link
 *     spring. Free to be dragged, pins where dropped.
 *
 * Forces:
 *   - manyBody (repel) at -220 keeps nodes apart but lets dense sectors cluster.
 *   - link force pulls connected nodes to a target distance.
 *   - faint centre (0.02) keeps drifting islands from leaving the canvas.
 *   - collide is per-kind — sector hubs are roomy enough that skills don't
 *     crash into their chip rect.
 */

import { useEffect, useRef, useState } from "react";
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  type Simulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from "d3-force";
import type { CategoryId } from "./types";

export type SectorOrCentre = CategoryId | "centre";
export type NodeKind = "skill" | "centre" | "sector";

export interface TreeNode extends SimulationNodeDatum {
  id: string;
  kind: NodeKind;
  sector: SectorOrCentre;
  // d3-force mutates these:
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface TreeLink extends SimulationLinkDatum<TreeNode> {
  source: string | TreeNode;
  target: string | TreeNode;
  distance: number;
  strength?: number;
}

/** Pinned positions for the sector hub nodes in graph mode. Pulled in to
 *  radius 280 so the cluster of skills attached to each hub stays inside
 *  the ±470 viewBox even with a 120-unit link spring. (Radial mode keeps
 *  using the static chip rects at radius 425.) */
export const SECTOR_HUB_RADIUS = 280;
export const SECTOR_HUB_POS: Record<SectorOrCentre, { x: number; y: number }> = {
  hr: { x: 0, y: -SECTOR_HUB_RADIUS },
  finance: {
    x: Math.cos((30 * Math.PI) / 180) * SECTOR_HUB_RADIUS,
    y: Math.sin((30 * Math.PI) / 180) * SECTOR_HUB_RADIUS,
  },
  admin: {
    x: Math.cos((150 * Math.PI) / 180) * SECTOR_HUB_RADIUS,
    y: Math.sin((150 * Math.PI) / 180) * SECTOR_HUB_RADIUS,
  },
  centre: { x: 0, y: 0 },
};

/** Per-node collide radius. Hubs sized to fit the 44-radius circular node
 *  plus a small buffer; skills are standard; centre is the chunky person. */
function collideRadius(n: TreeNode): number {
  if (n.kind === "sector") return 55;
  if (n.kind === "centre") return 50;
  return 36;
}

export interface ForceOptions {
  /** If true, the simulation snaps to equilibrium in a few ticks rather than
   *  animating in. Hook into prefers-reduced-motion at the caller. */
  reduceMotion?: boolean;
}

export interface ForceHandle {
  /** Re-render counter — bump on every simulation tick so consumers see
   *  updated node positions. Not used directly, just read in JSX to subscribe. */
  tick: number;
  startDrag(id: string): void;
  drag(id: string, x: number, y: number): void;
  endDrag(id: string, opts?: { pin?: boolean }): void;
  unpinAll(): void;
  /** Returns the live (mutable) node array — caller renders from this. */
  nodes(): TreeNode[];
}

export function useForceSimulation(
  initialNodes: TreeNode[],
  initialLinks: TreeLink[],
  opts: ForceOptions = {}
): ForceHandle {
  // The simulation mutates the node array in place. We keep it stable in a
  // ref so React rerenders don't recreate the d3 internal state.
  const nodesRef = useRef<TreeNode[]>(initialNodes);
  const linksRef = useRef<TreeLink[]>(initialLinks);
  const simRef = useRef<Simulation<TreeNode, TreeLink> | null>(null);
  const [tick, setTick] = useState(0);

  // (Re)build the simulation whenever the *shape* of nodes/links changes.
  // We use the joined ids as the dependency so swapping the person (which
  // changes which centre→skill links exist) reseeds the layout.
  const linkKey = initialLinks
    .map(
      (l) =>
        `${typeof l.source === "string" ? l.source : l.source.id}>${
          typeof l.target === "string" ? l.target : l.target.id
        }`
    )
    .join(",");
  const nodeKey = initialNodes.map((n) => n.id).join(",");

  useEffect(() => {
    nodesRef.current = initialNodes;
    linksRef.current = initialLinks;

    const sim = forceSimulation<TreeNode>(initialNodes)
      .force("repel", forceManyBody<TreeNode>().strength(-220))
      .force(
        "link",
        forceLink<TreeNode, TreeLink>(initialLinks)
          .id((n) => n.id)
          .distance((l) => l.distance)
          .strength((l) => l.strength ?? 0.6)
      )
      // A faint global pull keeps untethered drift in check without
      // overpowering the sector hub links.
      .force("centre", forceCenter(0, 0).strength(0.02))
      .force("collide", forceCollide<TreeNode>(collideRadius));

    if (opts.reduceMotion) {
      sim.alpha(1).alphaDecay(1).velocityDecay(1);
    } else {
      sim.alpha(0.9).alphaDecay(0.025).velocityDecay(0.35);
    }

    // Pin the centre and every sector hub so visitors can't drag them
    // and the simulation has fixed anchors to spring everything else from.
    for (const n of initialNodes) {
      if (n.kind === "centre") {
        n.fx = 0;
        n.fy = 0;
      } else if (n.kind === "sector") {
        const pos = SECTOR_HUB_POS[n.sector];
        n.fx = pos.x;
        n.fy = pos.y;
      }
    }

    sim.on("tick", () => {
      setTick((t) => t + 1);
    });

    simRef.current = sim;

    return () => {
      sim.stop();
      simRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeKey, linkKey, opts.reduceMotion]);

  const handle: ForceHandle = {
    tick,
    nodes: () => nodesRef.current,
    startDrag(id) {
      const sim = simRef.current;
      const n = nodesRef.current.find((x) => x.id === id);
      // Only skill nodes can be dragged — centre + sector hubs are pinned.
      if (!sim || !n || n.kind !== "skill") return;
      sim.alphaTarget(0.3).restart();
      n.fx = n.x;
      n.fy = n.y;
    },
    drag(id, x, y) {
      const n = nodesRef.current.find((x) => x.id === id);
      if (!n || n.kind !== "skill") return;
      n.fx = x;
      n.fy = y;
    },
    endDrag(id, { pin = true } = {}) {
      const sim = simRef.current;
      const n = nodesRef.current.find((x) => x.id === id);
      if (sim) sim.alphaTarget(0);
      if (!n || n.kind !== "skill") return;
      if (!pin) {
        n.fx = null;
        n.fy = null;
      }
    },
    unpinAll() {
      for (const n of nodesRef.current) {
        if (n.kind === "skill") {
          n.fx = null;
          n.fy = null;
        }
      }
      const sim = simRef.current;
      if (sim) sim.alpha(0.5).restart();
    },
  };

  return handle;
}
