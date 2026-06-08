"use client";

/**
 * useForceSimulation — d3-force wrapper that drives the graph view of the
 * skill tree. The hook:
 *   1. Owns a Simulation<TreeNode> instance for the component's lifetime.
 *   2. Mutates each node's x/y/vx/vy in place on every tick.
 *   3. Calls React state updates so the render reflects the live positions.
 *   4. Exposes drag handlers that pin / re-anchor nodes.
 *
 * Forces tuned for ~36 skill nodes + 1 centre node in a ±470 viewBox:
 *   - manyBody (repel) at -220 keeps nodes apart but lets dense sectors cluster.
 *   - link force pulls connected nodes to a target distance.
 *   - sector anchors (forceX / forceY) softly pull HR up, Finance down-right,
 *     Admin down-left so the tree retains its taught spatial meaning even
 *     after the simulation jostles it.
 *   - collide stops nodes from overlapping their visual circles.
 *   - centre is a tiny pull toward (0, 0) so floating islands drift back in.
 */

import { useEffect, useRef, useState } from "react";
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type Simulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from "d3-force";
import type { CategoryId } from "./types";

export type SectorOrCentre = CategoryId | "centre";

export interface TreeNode extends SimulationNodeDatum {
  id: string;
  kind: "skill" | "centre";
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

/** Soft sector anchor coordinates, matching the radial layout's anchor points
 *  so visitors recognise the same spatial mapping after switching. */
export const SECTOR_ANCHOR: Record<SectorOrCentre, { x: number; y: number }> = {
  hr: { x: 0, y: -260 },
  finance: { x: 260, y: 150 },
  admin: { x: -260, y: 150 },
  centre: { x: 0, y: 0 },
};

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
    .map((l) => `${typeof l.source === "string" ? l.source : l.source.id}>${typeof l.target === "string" ? l.target : l.target.id}`)
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
      .force("centre", forceCenter(0, 0).strength(0.04))
      .force(
        "x",
        forceX<TreeNode>((n) => SECTOR_ANCHOR[n.sector].x).strength(0.07)
      )
      .force(
        "y",
        forceY<TreeNode>((n) => SECTOR_ANCHOR[n.sector].y).strength(0.07)
      )
      .force("collide", forceCollide<TreeNode>(36));

    if (opts.reduceMotion) {
      sim.alpha(1).alphaDecay(1).velocityDecay(1);
    } else {
      sim.alpha(0.9).alphaDecay(0.025).velocityDecay(0.35);
    }

    // Pin the centre node at (0, 0) so the person never wanders.
    for (const n of initialNodes) {
      if (n.kind === "centre") {
        n.fx = 0;
        n.fy = 0;
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
      if (!sim || !n || n.kind === "centre") return;
      sim.alphaTarget(0.3).restart();
      n.fx = n.x;
      n.fy = n.y;
    },
    drag(id, x, y) {
      const n = nodesRef.current.find((x) => x.id === id);
      if (!n || n.kind === "centre") return;
      n.fx = x;
      n.fy = y;
    },
    endDrag(id, { pin = true } = {}) {
      const sim = simRef.current;
      const n = nodesRef.current.find((x) => x.id === id);
      if (sim) sim.alphaTarget(0);
      if (!n || n.kind === "centre") return;
      if (!pin) {
        n.fx = null;
        n.fy = null;
      }
    },
    unpinAll() {
      for (const n of nodesRef.current) {
        if (n.kind !== "centre") {
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
