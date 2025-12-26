"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function StarRingNetwork() {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // ----- Scene setup -----
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      55,
      host.clientWidth / host.clientHeight,
      0.1,
      2000
    );
    camera.position.z = 220;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.setClearColor(0x12051c, 1); // deep purple background
    host.appendChild(renderer.domElement);

    // ----- Config -----
    const STAR_COUNT = 420;
    const AREA = { w: 520, h: 320 }; // world size (x,y)
    const MAX_LINK_DIST = 34; // connect stars within this range
    const MAX_LINKS_PER_STAR = 3;

    // Cursor ring behavior
    const RING_RADIUS = 42; // pixels-ish in world units (tune with camera/AREA)
    const RING_BAND = 60; // how far the influence extends from cursor
    const RING_STRENGTH = 0.045; // pull strength toward ring
    const DAMPING = 0.90; // velocity damping

    // ----- Stars (Points) -----
    const positions = new Float32Array(STAR_COUNT * 3);
    const base = new Float32Array(STAR_COUNT * 3); // "rest" positions
    const velocity = new Float32Array(STAR_COUNT * 3);

    // random starfield in a flat plane (z small jitter)
    for (let i = 0; i < STAR_COUNT; i++) {
      const ix = i * 3;
      const x = (Math.random() - 0.5) * AREA.w;
      const y = (Math.random() - 0.5) * AREA.h;
      const z = (Math.random() - 0.5) * 6;

      positions[ix] = x;
      positions[ix + 1] = y;
      positions[ix + 2] = z;

      base[ix] = x;
      base[ix + 1] = y;
      base[ix + 2] = z;

      velocity[ix] = (Math.random() - 0.5) * 0.05;
      velocity[ix + 1] = (Math.random() - 0.5) * 0.05;
      velocity[ix + 2] = 0;
    }

    const starGeom = new THREE.BufferGeometry();
    starGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.9,
      sizeAttenuation: true,
      color: new THREE.Color(0xff5cf0),
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });

    const stars = new THREE.Points(starGeom, starMat);
    scene.add(stars);

    // subtle cyan highlight by mixing via vertex colors (optional, lightweight)
    // (kept simple: single material color, lines use gradient-ish alpha)

    // ----- Lines (dynamic) -----
    // We’ll rebuild line segments every frame (OK for ~400 points if we keep it capped)
    const lineGeom = new THREE.BufferGeometry();
    const MAX_SEGMENTS = STAR_COUNT * MAX_LINKS_PER_STAR; // capped
    const linePositions = new Float32Array(MAX_SEGMENTS * 2 * 3);
    lineGeom.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));

    const lineMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(0x5ce1ff),
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    });

    const lines = new THREE.LineSegments(lineGeom, lineMat);
    scene.add(lines);

    // ----- Cursor -> world coords -----
    const mouse = { x: 0, y: 0 };
    const cursorWorld = new THREE.Vector3(0, 0, 0);

    const ndc = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // z=0 plane

    const onMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;

      // NDC
      ndc.x = (px / rect.width) * 2 - 1;
      ndc.y = -(py / rect.height) * 2 + 1;

      raycaster.setFromCamera(ndc, camera);
      raycaster.ray.intersectPlane(plane, cursorWorld);
      mouse.x = cursorWorld.x;
      mouse.y = cursorWorld.y;
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    // ----- Helpers -----
    const tmp = new THREE.Vector2();
    const tmp2 = new THREE.Vector2();

    function rebuildLinks() {
      // Build segments with a simple nearest-neighbor-ish pass
      // capped by MAX_LINKS_PER_STAR so it doesn't explode.
      let segCount = 0;

      for (let i = 0; i < STAR_COUNT; i++) {
        const ia = i * 3;
        const ax = positions[ia];
        const ay = positions[ia + 1];
        const az = positions[ia + 2];

        // track closest neighbors
        const best = [];
        for (let j = i + 1; j < STAR_COUNT; j++) {
          const ja = j * 3;
          const dx = positions[ja] - ax;
          const dy = positions[ja + 1] - ay;
          const d2 = dx * dx + dy * dy;

          if (d2 <= MAX_LINK_DIST * MAX_LINK_DIST) {
            best.push({ j, d2 });
          }
        }

        best.sort((a, b) => a.d2 - b.d2);
        const take = Math.min(MAX_LINKS_PER_STAR, best.length);

        for (let k = 0; k < take; k++) {
          if (segCount >= MAX_SEGMENTS) break;
          const j = best[k].j;
          const ja = j * 3;

          const p = segCount * 6;
          linePositions[p] = ax;
          linePositions[p + 1] = ay;
          linePositions[p + 2] = az;

          linePositions[p + 3] = positions[ja];
          linePositions[p + 4] = positions[ja + 1];
          linePositions[p + 5] = positions[ja + 2];

          segCount++;
        }
      }

      lineGeom.setDrawRange(0, segCount * 2);
      lineGeom.attributes.position.needsUpdate = true;
    }

    // ----- Animation -----
    let raf = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const dt = Math.min(0.033, clock.getDelta());

      for (let i = 0; i < STAR_COUNT; i++) {
        const ix = i * 3;

        let x = positions[ix];
        let y = positions[ix + 1];
        const z = positions[ix + 2];

        // Restoring force (keeps the field coherent)
        const bx = base[ix];
        const by = base[ix + 1];
        velocity[ix] += (bx - x) * 0.0015;
        velocity[ix + 1] += (by - y) * 0.0015;

        // Soft drift
        velocity[ix] += (Math.random() - 0.5) * 0.002;
        velocity[ix + 1] += (Math.random() - 0.5) * 0.002;

        // ---- Ring force around cursor ----
        // Pull stars that are within a band to the ring radius (not to the center)
        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 1e-6;

        const band = RING_BAND;
        if (dist < band) {
          // desired position is on a circle at RING_RADIUS away from cursor
          const targetX = mouse.x + (dx / dist) * RING_RADIUS;
          const targetY = mouse.y + (dy / dist) * RING_RADIUS;

          // stronger near the ring band center, softer at the edges
          const t = 1 - dist / band; // 1 near center, 0 at edge
          const strength = RING_STRENGTH * (0.3 + 0.7 * t);

          velocity[ix] += (targetX - x) * strength;
          velocity[ix + 1] += (targetY - y) * strength;

          // add a tiny tangential swirl so it feels “alive”
          // tangent = rotate radial by 90°
          const tx = -dy / dist;
          const ty = dx / dist;
          velocity[ix] += tx * strength * 0.8;
          velocity[ix + 1] += ty * strength * 0.8;
        }

        // Integrate + damping
        velocity[ix] *= DAMPING;
        velocity[ix + 1] *= DAMPING;

        x += velocity[ix] * (dt * 60);
        y += velocity[ix + 1] * (dt * 60);

        // Clamp to bounds (soft)
        if (x < -AREA.w / 2) x = -AREA.w / 2;
        if (x > AREA.w / 2) x = AREA.w / 2;
        if (y < -AREA.h / 2) y = -AREA.h / 2;
        if (y > AREA.h / 2) y = AREA.h / 2;

        positions[ix] = x;
        positions[ix + 1] = y;
        positions[ix + 2] = z;
      }

      starGeom.attributes.position.needsUpdate = true;
      rebuildLinks();

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    // ----- Resize -----
    const onResize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ----- Cleanup -----
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);

      scene.remove(stars);
      scene.remove(lines);

      starGeom.dispose();
      starMat.dispose();
      lineGeom.dispose();
      lineMat.dispose();

      renderer.dispose();
      renderer.domElement?.remove();
    };
  }, []);

  return <div ref={hostRef} className="absolute inset-0 -z-20" />;
}
