/**
 * Build-time: turns the twin scene (src/content/twin.yaml + zones + devices) into a compact
 * JSON payload for the 3D layer. Geometry comes from the same `parts()` as the 2D drawing,
 * so both layers always show the same room.
 */
import type { Lab } from '../lib/lab';
import { pick, type Locale } from '../i18n/ui';
import { parts } from './iso';

/** [x, y, z, w, d, h] in metres (x east, y south, z up). */
export type BoxTuple = [number, number, number, number, number, number];

export type TwinObject3D = {
  /** Device id; absent for decoration. */
  id?: string;
  name?: string;
  status: 'installed' | 'planned' | 'decor';
  applications: string[];
  boxes: BoxTuple[];
};

export type TwinData = {
  room: { width: number; depth: number; height: number; glass: boolean };
  /** Floor outline, [x, y] in metres. */
  floor: Array<[number, number]>;
  exclude: Array<{ x: number; y: number; w: number; d: number; label: string }>;
  doors: Array<{ x: number; w: number }>;
  zones: Array<{ x: number; y: number; w: number; d: number; name: string }>;
  objects: TwinObject3D[];
  /** Device ids in keyboard order (same as the 2D hotspots). */
  order: string[];
  applications: Array<{ id: string; name: string }>;
};

const r = (n: number) => Math.round(n * 1000) / 1000;

export function twinData(lab: Lab, locale: Locale, order: string[]): TwinData {
  const scene = lab.twin!;
  const { width: W, depth: D, height: H } = scene.room;
  const ex = scene.room.exclude.find((e) => Math.abs(e.x + e.w - W) < 0.01 && Math.abs(e.y + e.d - D) < 0.01);
  const floor: Array<[number, number]> = ex
    ? [[0, 0], [W, 0], [W, ex.y], [ex.x, ex.y], [ex.x, D], [0, D]]
    : [[0, 0], [W, 0], [W, D], [0, D]];

  const objects: TwinObject3D[] = [];
  for (const o of scene.objects) {
    const device = lab.deviceByTwin(o.object);
    if (device?.data.status === 'retired') continue;
    const boxes = parts(o).boxes.map((b) => [r(b.x), r(b.y), r(b.z), r(b.w), r(b.d), r(b.h)] as BoxTuple);
    objects.push(
      device
        ? {
            id: device.id,
            name: pick(device.data.name, locale),
            status: device.data.status === 'installed' ? 'installed' : 'planned',
            applications: device.data.applications.map((a) => a.id),
            boxes,
          }
        : { status: 'decor', applications: [], boxes },
    );
  }

  const used = new Set(objects.flatMap((o) => o.applications));
  return {
    room: { width: W, depth: D, height: H, glass: scene.room.back_wall === 'glass' },
    floor,
    exclude: scene.room.exclude.map((e) => ({ x: e.x, y: e.y, w: e.w, d: e.d, label: e.label ? pick(e.label, locale) : '' })),
    doors: scene.room.doors,
    zones: lab.zones.map((z) => ({ x: z.data.rect.x, y: z.data.rect.y, w: z.data.rect.width, d: z.data.rect.depth, name: pick(z.data.name, locale) })),
    objects,
    order,
    applications: lab.applications.filter((a) => used.has(a.id)).map((a) => ({ id: a.id, name: pick(a.data.name, locale) })),
  };
}
