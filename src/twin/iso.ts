/**
 * Build-time geometry for the 2D digital twin: isometric projection of the scene in
 * src/content/twin.yaml into SVG polygons. Each object becomes boxes (drawn in painter's
 * order) plus a silhouette used as its hotspot outline. No runtime code.
 *
 * Coordinates: metres; x right, y towards the viewer, z up. The viewer looks from the
 * (+x, +y) corner, so a box shows its top, its +y ("front") and its +x ("side") faces.
 */

export type Box = { x: number; y: number; z: number; w: number; d: number; h: number };
export type Pt = [number, number];
export type SceneObject = Box & { object?: string; kind: string; count?: number; points?: Array<[number, number]> };

const S = 46; // pixels per metre
const C = Math.cos(Math.PI / 6);
const SN = Math.sin(Math.PI / 6);

export function project(x: number, y: number, z: number): Pt {
  return [(x - y) * C * S, (x + y) * SN * S - z * S];
}

const pts = (p: Pt[]) => p.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(' ');

/** The three visible faces of a box, as SVG point lists. */
export function boxFaces(b: Box) {
  const { x, y, z, w, d, h } = b;
  const P = (dx: number, dy: number, dz: number) => project(x + dx, y + dy, z + dz);
  return {
    top: pts([P(0, 0, h), P(w, 0, h), P(w, d, h), P(0, d, h)]),
    front: pts([P(0, d, 0), P(w, d, 0), P(w, d, h), P(0, d, h)]),
    side: pts([P(w, 0, 0), P(w, d, 0), P(w, d, h), P(w, 0, h)]),
  };
}

function corners(b: Box): Pt[] {
  const out: Pt[] = [];
  for (const dx of [0, b.w]) for (const dy of [0, b.d]) for (const dz of [0, b.h]) out.push(project(b.x + dx, b.y + dy, b.z + dz));
  return out;
}

/** Convex hull (Andrew's monotone chain). */
export function hull(points: Pt[]): Pt[] {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (p.length < 3) return p;
  const cross = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: Pt[] = [];
  for (const q of p) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop();
    lower.push(q);
  }
  const upper: Pt[] = [];
  for (const q of p.reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop();
    upper.push(q);
  }
  return lower.slice(0, -1).concat(upper.slice(0, -1));
}

/** Spread `n` points evenly around a rectangle's perimeter. */
function perimeter(x: number, y: number, w: number, d: number, n: number): Array<[number, number]> {
  const len = 2 * (w + d);
  const out: Array<[number, number]> = [];
  for (let i = 0; i < n; i++) {
    let t = ((i + 0.5) / n) * len;
    if (t < w) out.push([x + t, y]);
    else if ((t -= w) < d) out.push([x + w, y + t]);
    else if ((t -= d) < w) out.push([x + w - t, y + d]);
    else out.push([x, y + d - (t - w)]);
  }
  return out;
}

/**
 * Boxes that make up one object. `groups` splits them into separate hotspot silhouettes
 * (a camera array is twelve small shapes, not one huge hull over the room).
 */
export function parts(o: SceneObject): { boxes: Box[]; groups: Box[][] } {
  const { x, y, z, w, d, h } = o;
  const one = (boxes: Box[]) => ({ boxes, groups: [boxes] });
  switch (o.kind) {
    case 'desk':
      return one(deskBoxes(o));
    case 'workstation': {
      const desk = deskBoxes(o);
      const top = z + h;
      const screens: Box[] = [
        { x: x + w * 0.18, y: y + 0.12, z: top, w: 0.62, d: 0.06, h: 0.42 },
        { x: x + w * 0.55, y: y + 0.12, z: top, w: 0.62, d: 0.06, h: 0.42 },
        { x: x + w * 0.3, y: y + d * 0.55, z: top, w: 0.5, d: 0.18, h: 0.03 },
      ];
      const tower: Box = { x: x + w + 0.05, y: y + 0.1, z, w: 0.25, d: 0.5, h: 0.55 };
      return one([...desk, tower, ...screens]);
    }
    case 'tripod': {
      const pole = 0.04;
      return one([
        { x: x + w / 2 - 0.22, y: y + d / 2 - 0.22, z, w: 0.44, d: 0.44, h: 0.02 },
        { x: x + w / 2 - pole / 2, y: y + d / 2 - pole / 2, z, w: pole, d: pole, h: h - 0.16 },
        { x, y, z: z + h - 0.16, w, d, h: 0.16 },
      ]);
    }
    case 'cart':
      return one([
        { x, y, z: z + 0.08, w, d, h: 0.04 },
        { x: x + 0.03, y: y + 0.03, z, w: 0.04, d: 0.04, h },
        { x: x + w - 0.07, y: y + d - 0.07, z, w: 0.04, d: 0.04, h },
        { x, y, z: z + h - 0.04, w, d, h: 0.04 },
        { x: x + w * 0.2, y: y + d * 0.2, z: z + h, w: w * 0.6, d: d * 0.6, h: 0.16 },
      ]);
    case 'camera-array': {
      const c = 0.2;
      // Explicit ceiling positions (from the floor plan): cameras only.
      if (o.points) {
        const cams = o.points.map(([cx, cy]) => ({ x: cx - c / 2, y: cy - c / 2, z: z - h, w: c, d: c, h }));
        return { boxes: cams, groups: cams.map((b) => [b]) };
      }
      const n = o.count ?? 8;
      const t = 0.05; // truss thickness
      const truss: Box[] = [
        { x, y, z, w, d: t, h: t },
        { x, y: y + d - t, z, w, d: t, h: t },
        { x, y, z, w: t, d, h: t },
        { x: x + w - t, y, z, w: t, d, h: t },
      ];
      const cams = perimeter(x, y, w, d, n).map(([cx, cy]) => ({ x: cx - c / 2, y: cy - c / 2, z: z - c, w: c, d: c, h: c + 0.04 }));
      return { boxes: [...truss, ...cams], groups: cams.map((b) => [b]) };
    }
    case 'pc': {
      // Two monitors side by side on the desk (the given box is the southern one) and a tower.
      const boxes: Box[] = [
        { x, y, z, w, d, h },
        { x, y: y - d - 0.04, z, w, d, h },
        // Tower on the floor between the desk and the operator's chair.
        { x: x + 0.5, y: y - 0.45, z: 0, w: 0.22, d: 0.42, h: 0.48 },
      ];
      return one(boxes);
    }
    case 'operator-desk': {
      // Desk row: legs + top, then per position a monitor (west edge, facing east) and a chair.
      const n = o.count ?? 1;
      const boxes = deskBoxes(o);
      for (let i = 0; i < n; i++) {
        const py = y + d - 0.66 - i * 0.8;
        boxes.push({ x: x + 0.1, y: py, z: z + h, w: 0.08, d: 0.36, h: 0.29 });
        boxes.push({ x: x + 0.73, y: py + 0.0, z: 0.3, w: 0.38, d: 0.4, h: 0.06 });
        boxes.push({ x: x + 0.88, y: py + 0.16, z: 0, w: 0.06, d: 0.06, h: 0.3 });
        boxes.push({ x: x + 1.05, y: py, z: 0.36, w: 0.06, d: 0.4, h: 0.4 });
      }
      return one(boxes);
    }
    case 'cabinets': {
      const n = o.count ?? 1;
      const step = d / n;
      const boxes = Array.from({ length: n }, (_, i) => ({ x, y: y + i * step + 0.02, z, w, d: step - 0.04, h }));
      return one(boxes);
    }
    case 'shelves': {
      // Open shelving units side by side along y: four corner posts and SHELF_LEVELS boards each.
      // Devices stand on the boards as their own objects (see shelfZ).
      const n = o.count ?? 1;
      const step = d / n;
      const post = 0.03;
      const boxes: Box[] = [];
      for (let i = 0; i < n; i++) {
        const uy = y + i * step + 0.02;
        const ud = step - 0.04;
        for (const [px, py] of [[x, uy], [x + w - post, uy], [x, uy + ud - post], [x + w - post, uy + ud - post]])
          boxes.push({ x: px, y: py, z, w: post, d: post, h });
        for (const bz of SHELF_LEVELS) boxes.push({ x, y: uy, z: z + bz, w, d: ud, h: 0.02 });
      }
      return one(boxes);
    }
    case 'anchors': {
      const n = o.count ?? 4;
      const a = 0.14;
      const corners4: Array<[number, number]> = [[x, y], [x + w, y], [x + w, y + d], [x, y + d]];
      const at = o.points ?? (n === 4 ? corners4 : perimeter(x, y, w, d, n));
      const boxes = at.map(([ax, ay]) => ({ x: Math.min(ax, x + w - a), y: Math.min(ay, y + d - a), z, w: a, d: a, h }));
      return { boxes, groups: boxes.map((b) => [b]) };
    }
    case 'person': {
      // A stylised participant: legs, torso, head.
      const cx = x + w / 2;
      const cy = y + d / 2;
      return one([
        { x: cx - 0.17, y: cy - 0.08, z, w: 0.13, d: 0.16, h: h * 0.48 },
        { x: cx + 0.04, y: cy - 0.08, z, w: 0.13, d: 0.16, h: h * 0.48 },
        { x: cx - 0.21, y: cy - 0.11, z: z + h * 0.48, w: 0.42, d: 0.22, h: h * 0.36 },
        { x: cx - 0.1, y: cy - 0.1, z: z + h * 0.86, w: 0.2, d: 0.2, h: h * 0.14 },
      ]);
    }
    case 'scanner':
      return one([
        { x, y, z, w, d: d * 0.35, h },
        { x: x + w * 0.2, y: y + d * 0.35, z, w: w * 0.6, d: d * 0.65, h: h * 0.45 },
      ]);
    case 'rack':
      return one([
        { x, y, z, w, d, h },
      ]);
    case 'plate':
    case 'box':
    default:
      return one([{ x, y, z, w, d, h }]);
  }
}

/** Heights (m) of the shelf boards in a `shelves` unit; the top board sits at the unit's full height. */
export const SHELF_LEVELS = [0.08, 0.48, 0.88, 1.28, 1.71];

function deskBoxes(o: Box): Box[] {
  const { x, y, z, w, d, h } = o;
  const leg = 0.05;
  return [
    { x: x + 0.04, y: y + 0.04, z, w: leg, d: leg, h: h - 0.04 },
    { x: x + w - 0.09, y: y + 0.04, z, w: leg, d: leg, h: h - 0.04 },
    { x: x + 0.04, y: y + d - 0.09, z, w: leg, d: leg, h: h - 0.04 },
    { x: x + w - 0.09, y: y + d - 0.09, z, w: leg, d: leg, h: h - 0.04 },
    { x, y, z: z + h - 0.04, w, d, h: 0.04 },
  ];
}

/** Painter's order: far (small x+y) and low first. */
export const depth = (b: Box) => b.x + b.w / 2 + (b.y + b.d / 2) + b.z * 0.01;

/**
 * Painter's order for isometric boxes. Sorting by centre depth alone fails for stacked
 * objects (a device on a shelf board, with another board above it), so: wherever two boxes
 * overlap on screen and are separated along an axis, the one on the far side (smaller x, y or
 * z) is drawn first. Ties and the (rare) cycles fall back to centre depth.
 */
export function paintOrder<T extends { b: Box }>(items: T[]): T[] {
  const n = items.length;
  const bb = items.map(({ b }) => {
    const c = corners(b);
    const xs = c.map((p) => p[0]);
    const ys = c.map((p) => p[1]);
    return [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  });
  const dep = items.map(({ b }) => depth(b));
  const next: number[][] = items.map(() => []);
  const indeg = new Array(n).fill(0);
  const e = 1e-6;
  const edge = (from: number, to: number) => (next[from].push(to), indeg[to]++);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const [a0, a1, a2, a3] = bb[i];
      const [b0, b1, b2, b3] = bb[j];
      if (a1 <= b0 + 0.5 || b1 <= a0 + 0.5 || a3 <= b2 + 0.5 || b3 <= a2 + 0.5) continue;
      const A = items[i].b;
      const B = items[j].b;
      if (A.x + A.w <= B.x + e) edge(i, j);
      else if (B.x + B.w <= A.x + e) edge(j, i);
      else if (A.y + A.d <= B.y + e) edge(i, j);
      else if (B.y + B.d <= A.y + e) edge(j, i);
      else if (A.z + A.h <= B.z + e) edge(i, j);
      else if (B.z + B.h <= A.z + e) edge(j, i);
    }
  }
  const done = new Array(n).fill(false);
  const out: T[] = [];
  for (let k = 0; k < n; k++) {
    let pick = -1;
    for (let i = 0; i < n; i++) if (!done[i] && indeg[i] === 0 && (pick < 0 || dep[i] < dep[pick])) pick = i;
    if (pick < 0) for (let i = 0; i < n; i++) if (!done[i] && (pick < 0 || dep[i] < dep[pick])) pick = i; // cycle
    done[pick] = true;
    out.push(items[pick]);
    for (const t of next[pick]) indeg[t]--;
  }
  return out;
}

/** Silhouette (SVG points) for a group of boxes, slightly padded. */
export function silhouette(group: Box[], pad = 4): string {
  const h = hull(group.flatMap(corners));
  const cx = h.reduce((s, p) => s + p[0], 0) / h.length;
  const cy = h.reduce((s, p) => s + p[1], 0) / h.length;
  return pts(
    h.map(([a, b]) => {
      const dx = a - cx;
      const dy = b - cy;
      const len = Math.hypot(dx, dy) || 1;
      return [a + (dx / len) * pad, b + (dy / len) * pad] as Pt;
    }),
  );
}

/** Top-centre of a group in screen space (for labels). */
export function anchor(boxes: Box[]): Pt {
  const all = boxes.flatMap(corners);
  const minY = Math.min(...all.map((p) => p[1]));
  const xs = all.map((p) => p[0]);
  return [(Math.min(...xs) + Math.max(...xs)) / 2, minY];
}

/** Floor rectangle as SVG points. */
export function floorRect(x: number, y: number, w: number, d: number, z = 0): string {
  return pts([project(x, y, z), project(x + w, y, z), project(x + w, y + d, z), project(x, y + d, z)]);
}

export { pts };
