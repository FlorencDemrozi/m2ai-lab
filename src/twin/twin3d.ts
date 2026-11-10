/**
 * 3D digital twin (REQUIREMENTS §5, layer 2). Loaded on demand by client.ts, only when
 * WebGL works, the device looks capable and reduced motion is off. Reads the same scene
 * payload as the 2D layer (sceneData.ts) and opens the same DeviceCard popover.
 *
 * - Pointer: drag to rotate, wheel/pinch to zoom; hover glows; click opens the card.
 *   On touch screens one finger scrolls the page, two fingers rotate/zoom.
 * - Keyboard: an off-screen list of buttons in the 2D hotspot order. Focus moves the
 *   camera to the device and shows its name tag; Enter opens the card; Esc closes it.
 * - Renders on demand (no idle animation loop).
 *
 * Coordinates: scene metres (x east, y south, z up) map to Three.js (x, z, y).
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { BoxTuple, TwinData } from './sceneData';
import type { Popover } from './popover';

type Options = {
  host: HTMLElement;
  data: TwinData;
  popover: Popover;
  /** Accessible names per device id (reused from the 2D hotspots). */
  names: Map<string, string>;
  onFail: () => void;
};

type DeviceNode = {
  id: string;
  status: 'installed' | 'planned';
  applications: string[];
  mesh: THREE.Mesh;
  edges: THREE.LineSegments;
  center: THREE.Vector3;
  top: THREE.Vector3;
  tag: HTMLSpanElement;
  key: HTMLButtonElement;
};

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, z, y);

function boxGeometry([x, y, z, w, d, h]: BoxTuple) {
  const g = new THREE.BoxGeometry(w, h, d);
  g.translate(x + w / 2, z + h / 2, y + d / 2);
  return g;
}

function merged(boxes: BoxTuple[]) {
  const parts = boxes.map(boxGeometry);
  const g = parts.length === 1 ? parts[0] : mergeGeometries(parts, false)!;
  if (parts.length > 1) parts.forEach((p) => p.dispose());
  return g;
}

export function mount3D({ host, data, popover, names, onFail }: Options) {
  const css = getComputedStyle(host);
  const color = (name: string, fallback: string) => new THREE.Color(css.getPropertyValue(name).trim() || fallback);
  const C = {
    bg: color('--bg', '#05080f'),
    raised: color('--bg-raised', '#0c1322'),
    line: color('--line', '#233049'),
    lineStrong: color('--line-strong', '#6a7a99'),
    ink: color('--ink-soft', '#a3aec2'),
    accent: color('--accent', '#4fe0d2'),
    glow: color('--glow', '#4fe0d2'),
    planned: color('--status-planned', '#b3b7ff'),
  };

  // ---- renderer / camera / controls -------------------------------------------------
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch {
    onFail();
    return null;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    onFail();
  });
  host.prepend(canvas);

  const { width: W, depth: D, height: H } = data.room;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  const home = { target: V(W / 2, D / 2, 0.6), offset: new THREE.Vector3(7.5, 8.5, 10.5) };
  camera.position.copy(home.target).add(home.offset);

  const controls = new OrbitControls(camera, canvas);
  controls.target.copy(home.target);
  controls.enableDamping = true;
  controls.dampingFactor = 0.12;
  controls.minDistance = 4;
  controls.maxDistance = 24;
  controls.minPolarAngle = 0.15;
  controls.maxPolarAngle = 1.42;
  controls.screenSpacePanning = false;
  // Touch: one finger scrolls the page; two fingers rotate and zoom.
  controls.touches = { ONE: null as unknown as THREE.TOUCH, TWO: THREE.TOUCH.DOLLY_ROTATE };
  canvas.style.touchAction = 'pan-y';

  scene.add(new THREE.HemisphereLight(0xdfe9ff, 0x0a0f1a, 1.6));
  const sun = new THREE.DirectionalLight(0xffffff, 1.6);
  sun.position.set(W + 4, 10, D + 6);
  scene.add(sun);

  // ---- room -------------------------------------------------------------------------
  const shape = new THREE.Shape(data.floor.map(([x, y]) => new THREE.Vector2(x, y)));
  const floorGeo = new THREE.ShapeGeometry(shape);
  floorGeo.rotateX(Math.PI / 2);
  const floor = new THREE.Mesh(floorGeo, new THREE.MeshStandardMaterial({ color: C.raised, roughness: 0.95, side: THREE.DoubleSide }));
  scene.add(floor);

  const ex = data.exclude[0];
  const gridPts: THREE.Vector3[] = [];
  for (let gx = 1; gx < W; gx++) gridPts.push(V(gx, 0, 0.002), V(gx, ex && gx > ex.x ? ex.y : D, 0.002));
  for (let gy = 1; gy < D; gy++) gridPts.push(V(0, gy, 0.002), V(ex && gy > ex.y ? ex.x : W, gy, 0.002));
  scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(gridPts), new THREE.LineBasicMaterial({ color: C.line, transparent: true, opacity: 0.6 })));

  const wallMat = (glass: boolean) =>
    new THREE.MeshStandardMaterial({
      color: glass ? C.accent : C.lineStrong,
      transparent: true,
      opacity: glass ? 0.1 : 0.22,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  const backWall = new THREE.Mesh(boxGeometry([0, -0.06, 0, W, 0.06, H]), wallMat(data.room.glass));
  const westWall = new THREE.Mesh(boxGeometry([-0.08, 0, 0, 0.08, D, H]), wallMat(false));
  scene.add(backWall, westWall);
  const doorMat = new THREE.MeshStandardMaterial({ color: C.ink, transparent: true, opacity: 0.35, depthWrite: false });
  for (const d of data.doors) {
    const door = new THREE.Mesh(boxGeometry([d.x, -0.05, 0, d.w, 0.04, Math.min(2.1, H)]), doorMat);
    backWall.add(door);
  }
  for (const e of data.exclude) {
    scene.add(new THREE.Mesh(boxGeometry([e.x, e.y, 0, e.w, e.d, 0.3]), new THREE.MeshStandardMaterial({ color: C.line, roughness: 1 })));
  }

  const zones = new THREE.Group();
  for (const z of data.zones) {
    const plane = new THREE.Mesh(
      boxGeometry([z.x, z.y, 0.004, z.w, z.d, 0.002]),
      new THREE.MeshBasicMaterial({ color: C.glow, transparent: true, opacity: 0.12, depthWrite: false }),
    );
    const outline = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints([V(z.x, z.y, 0.01), V(z.x + z.w, z.y, 0.01), V(z.x + z.w, z.y + z.d, 0.01), V(z.x, z.y + z.d, 0.01)]),
      new THREE.LineDashedMaterial({ color: C.accent, dashSize: 0.25, gapSize: 0.15 }),
    );
    outline.computeLineDistances();
    zones.add(plane, outline);
  }
  scene.add(zones);

  // ---- objects ----------------------------------------------------------------------
  const decorBoxes = data.objects.filter((o) => o.status === 'decor').flatMap((o) => o.boxes);
  if (decorBoxes.length) {
    scene.add(new THREE.Mesh(merged(decorBoxes), new THREE.MeshStandardMaterial({ color: C.lineStrong, roughness: 0.8, metalness: 0.05 })));
  }

  const tags = document.createElement('div');
  tags.className = 'tags3d';
  tags.setAttribute('aria-hidden', 'true');
  const keys = document.createElement('div');
  keys.className = 'keys3d';
  host.append(tags, keys);

  const nodes = new Map<string, DeviceNode>();
  for (const o of data.objects) {
    if (!o.id) continue;
    const planned = o.status === 'planned';
    const geo = merged(o.boxes);
    geo.computeBoundingBox();
    const bb = geo.boundingBox!;
    const mat = new THREE.MeshStandardMaterial({
      color: planned ? C.planned : C.accent,
      roughness: 0.55,
      metalness: 0.1,
      transparent: planned,
      opacity: planned ? 0.18 : 1,
      depthWrite: !planned,
      emissive: C.glow,
      emissiveIntensity: 0,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.userData.id = o.id;
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo, 25),
      planned
        ? new THREE.LineDashedMaterial({ color: C.planned, dashSize: 0.06, gapSize: 0.05 })
        : new THREE.LineBasicMaterial({ color: C.glow, transparent: true, opacity: 0 }),
    );
    if (planned) edges.computeLineDistances();
    mesh.add(edges);
    scene.add(mesh);

    const tag = document.createElement('span');
    tag.className = `tag3d s-${o.status}`;
    tag.textContent = o.name ?? o.id;
    tags.append(tag);

    nodes.set(o.id, {
      id: o.id,
      status: planned ? 'planned' : 'installed',
      applications: o.applications,
      mesh,
      edges,
      center: bb.getCenter(new THREE.Vector3()),
      top: new THREE.Vector3((bb.min.x + bb.max.x) / 2, bb.max.y, (bb.min.z + bb.max.z) / 2),
      tag,
      key: document.createElement('button'),
    });
  }

  // Keyboard buttons, in the same logical order as the 2D hotspots.
  for (const id of data.order) {
    const n = nodes.get(id);
    if (!n) continue;
    const b = n.key;
    b.type = 'button';
    b.className = 'key3d';
    b.dataset.device = id;
    b.textContent = names.get(id) ?? id;
    b.addEventListener('focus', () => {
      focused = id;
      // Move half-way towards the device so it comes to the centre but the room stays in view.
      flyTo(home.target.clone().lerp(n.center, 0.5));
      refresh();
    });
    b.addEventListener('blur', (e) => {
      if (focused === id) focused = null;
      const next = e.relatedTarget as Element | null;
      if (!next?.closest?.('.keys3d, [data-pop]')) flyTo(home.target);
      refresh();
    });
    b.addEventListener('click', () => openCard(id, b));
    keys.append(b);
  }

  // ---- state & highlighting ---------------------------------------------------------
  let hovered: string | null = null;
  let focused: string | null = null;
  let app: string | null = null;
  let showLabels = false;
  let showPlanned = true;

  function refresh() {
    const active = popover.current;
    for (const n of nodes.values()) {
      const visible = showPlanned || n.status !== 'planned';
      n.mesh.visible = visible;
      n.key.hidden = !visible;
      const lit = n.id === hovered || n.id === focused || n.id === active;
      const inApp = !app || n.applications.includes(app);
      const m = n.mesh.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = lit ? 0.85 : app && inApp ? 0.35 : 0;
      if (n.status === 'installed') {
        if (m.transparent === inApp) m.needsUpdate = true; // switching blending needs a shader update
        m.transparent = !inApp;
        m.opacity = inApp ? 1 : 0.14;
        m.depthWrite = inApp;
        (n.edges.material as THREE.LineBasicMaterial).opacity = lit ? 1 : 0;
      } else {
        m.opacity = lit ? 0.4 : inApp ? 0.18 : 0.06;
      }
      n.tag.classList.toggle('on', visible && (showLabels || lit));
      n.tag.classList.toggle('focus', n.id === focused);
    }
    canvas.style.cursor = hovered ? 'pointer' : '';
    invalidate();
  }

  // ---- camera fly-to ----------------------------------------------------------------
  let flyTarget: THREE.Vector3 | null = null;
  function flyTo(p: THREE.Vector3) {
    flyTarget = p.clone();
    invalidate();
  }
  function stepFly() {
    if (!flyTarget) return false;
    const delta = flyTarget.clone().sub(controls.target).multiplyScalar(0.14);
    controls.target.add(delta);
    camera.position.add(delta);
    if (delta.lengthSq() < 1e-6) flyTarget = null;
    return true;
  }

  // ---- rendering --------------------------------------------------------------------
  let raf = 0;
  const tmp = new THREE.Vector3();
  function updateTags() {
    const r = canvas.getBoundingClientRect();
    for (const n of nodes.values()) {
      if (!n.tag.classList.contains('on')) continue;
      tmp.copy(n.top).project(camera);
      const behind = tmp.z > 1;
      n.tag.style.transform = `translate(${((tmp.x + 1) / 2) * r.width}px, ${((1 - tmp.y) / 2) * r.height}px) translate(-50%, -130%)`;
      n.tag.style.visibility = behind ? 'hidden' : '';
    }
  }
  function frame() {
    raf = 0;
    const flying = stepFly();
    const moving = controls.update();
    // Hide the walls that would block the view from where the camera is.
    backWall.visible = camera.position.z > 0;
    westWall.visible = camera.position.x > 0;
    renderer.render(scene, camera);
    updateTags();
    if (flying || moving) invalidate();
  }
  function invalidate() {
    if (!raf) raf = requestAnimationFrame(frame);
  }
  controls.addEventListener('change', invalidate);

  const ro = new ResizeObserver(() => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Fit the room to the stage's aspect ratio (portrait phones need to step back less than width alone suggests).
    camera.zoom = Math.min(1, Math.max(0.62, camera.aspect / 1.3));
    camera.updateProjectionMatrix();
    invalidate();
  });
  ro.observe(host);

  // ---- picking ----------------------------------------------------------------------
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  function pick(e: PointerEvent): string | null {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const meshes = [...nodes.values()].filter((n) => n.mesh.visible).map((n) => n.mesh);
    const hit = ray.intersectObjects(meshes, false)[0];
    return (hit?.object.userData.id as string) ?? null;
  }
  let down: { x: number; y: number } | null = null;
  canvas.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || e.buttons) return;
    const id = pick(e);
    if (id !== hovered) {
      hovered = id;
      refresh();
    }
  });
  canvas.addEventListener('pointerleave', () => {
    if (hovered) {
      hovered = null;
      refresh();
    }
  });
  canvas.addEventListener('pointerdown', (e) => (down = { x: e.clientX, y: e.clientY }));
  canvas.addEventListener('pointerup', (e) => {
    if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) return (down = null);
    down = null;
    const id = pick(e);
    if (id) openCard(id, nodes.get(id)!.key);
    else popover.close(false);
  });

  function openCard(id: string, from: HTMLElement) {
    const n = nodes.get(id)!;
    if (popover.current === id) return popover.close();
    tmp.copy(n.center).project(camera);
    const r = canvas.getBoundingClientRect();
    const x = r.left + ((tmp.x + 1) / 2) * r.width;
    const y = r.top + ((1 - tmp.y) / 2) * r.height;
    popover.open(id, { left: x - 20, top: y - 20, width: 40, height: 40 }, from, names.get(id) ?? id);
  }
  popover.onChange(refresh);

  refresh();

  return {
    setLabels(on: boolean) {
      showLabels = on;
      refresh();
    },
    setPlanned(on: boolean) {
      showPlanned = on;
      if (!on && popover.current && nodes.get(popover.current)?.status === 'planned') popover.close(false);
      refresh();
    },
    setVolume(on: boolean) {
      zones.visible = on;
      invalidate();
    },
    setApplication(id: string | null) {
      app = id;
      refresh();
    },
    resetView() {
      flyTarget = null;
      controls.target.copy(home.target);
      camera.position.copy(home.target).add(home.offset);
      invalidate();
    },
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => x.dispose());
      });
      renderer.dispose();
      canvas.remove();
      tags.remove();
      keys.remove();
    },
  };
}
export type Twin3D = NonNullable<ReturnType<typeof mount3D>>;
