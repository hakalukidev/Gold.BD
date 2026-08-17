"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { BANGLADESH_DIVISIONS, BANGLADESH_SVG_HEIGHT, BANGLADESH_SVG_WIDTH } from "./bangladesh-geo";

// Engraves the real division outlines as a raised gold relief: a dark sunken
// shadow (light from the top-left, same as the rest of the coin face) under a
// metallic gradient fill, with a bright rim on the lit edge to sell the emboss.
function drawBangladeshMap(ctx: CanvasRenderingContext2D, cx: number, cy: number, targetHeight: number) {
  const scale = targetHeight / BANGLADESH_SVG_HEIGHT;
  const targetWidth = BANGLADESH_SVG_WIDTH * scale;
  const originX = cx - targetWidth / 2;
  const originY = cy - targetHeight / 2;

  const paths = BANGLADESH_DIVISIONS.map(({ d }) => new Path2D(d));

  ctx.save();
  ctx.translate(originX, originY);
  ctx.scale(scale, scale);

  // Sunken shadow, offset a couple of device pixels down-right regardless of scale.
  ctx.save();
  ctx.translate(2.5 / scale, 2.5 / scale);
  ctx.fillStyle = "rgba(60, 40, 12, 0.55)";
  paths.forEach((p) => ctx.fill(p));
  ctx.restore();

  // Raised gold face, lit from the same top-left direction as the coin's rim.
  const gradient = ctx.createLinearGradient(0, 0, BANGLADESH_SVG_WIDTH, BANGLADESH_SVG_HEIGHT);
  gradient.addColorStop(0, "#fdf0c4");
  gradient.addColorStop(0.45, "#e3b969");
  gradient.addColorStop(1, "#8f6c1e");

  paths.forEach((p) => {
    ctx.fillStyle = gradient;
    ctx.fill(p);
    ctx.strokeStyle = "rgba(107, 77, 24, 0.85)";
    ctx.lineWidth = 1.4 / scale;
    ctx.stroke(p);
  });

  // Bright emboss rim along the lit (top-left) edge of the whole landmass.
  ctx.save();
  ctx.translate(-1.2 / scale, -1.2 / scale);
  ctx.strokeStyle = "rgba(255, 247, 217, 0.65)";
  ctx.lineWidth = 1 / scale;
  paths.forEach((p) => ctx.stroke(p));
  ctx.restore();

  ctx.restore();
}

// Draws `text` curved along an arc so letters sit upright relative to the
// radius (top of each letter pointing outward) — the standard "coin rim
// engraving" look, used for "PURE GOLD" arcing over the top of the face.
// `centerAngle` of 0 centers the arc at the top of the circle.
function drawArcText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  radius: number,
  centerAngle: number,
  font: string,
  color: string,
  letterSpacing: number
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(centerAngle);
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const chars = [...text];
  const widths = chars.map((c) => ctx.measureText(c).width + letterSpacing);
  const totalAngle = widths.reduce((sum, w) => sum + w / radius, 0);
  let angle = -totalAngle / 2;

  for (let i = 0; i < chars.length; i++) {
    const charAngle = widths[i] / radius;
    angle += charAngle / 2;
    ctx.save();
    ctx.rotate(angle);
    ctx.translate(0, -radius);
    ctx.fillText(chars[i], 0, 0);
    ctx.restore();
    angle += charAngle / 2;
  }

  ctx.restore();
}

// No .glb asset — the engraving is a canvas texture mapped onto the cylinder's cap faces.
function drawCoinFace() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const cx = size / 2;
  const cy = size / 2;

  const base = ctx.createRadialGradient(cx, cy, size * 0.05, cx, cy, size * 0.5);
  base.addColorStop(0, "#ffe6a0");
  base.addColorStop(0.5, "#f0b83f");
  base.addColorStop(1, "#b87800");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = "#b87800";
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.46, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "#ffe6a0";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.43, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#b87800";
  const dots = 60;
  for (let i = 0; i < dots; i++) {
    const angle = (i / dots) * Math.PI * 2;
    const r = size * 0.39;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = "#b87800";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.29, 0, Math.PI * 2);
  ctx.stroke();

  // "PURE GOLD" arcs along the inside of the dotted rim, like a mint's rim engraving.
  drawArcText(
    ctx,
    "PURE GOLD",
    cx,
    cy,
    size * 0.345,
    0,
    "700 26px Georgia, 'Noto Serif Bengali', serif",
    "#402000",
    3
  );

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#402000";
  ctx.font = "800 108px Georgia, 'Noto Serif Bengali', serif";
  ctx.fillText("24K", cx, cy - 20);
  ctx.font = "700 46px Georgia, 'Noto Serif Bengali', serif";
  ctx.fillText("GOLD", cx, cy + 52);
  ctx.fillStyle = "#402000";
  ctx.font = "600 24px Georgia, 'Noto Serif Bengali', serif";
  ctx.fillText("999.9", cx, cy + 108);

  return canvas;
}

// Reverse face: the obverse's branding swapped out for an engraved Bangladesh
// map, since a coin only needs the country's outline on one side.
function drawCoinFaceMap() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const cx = size / 2;
  const cy = size / 2;

  const base = ctx.createRadialGradient(cx, cy, size * 0.05, cx, cy, size * 0.5);
  base.addColorStop(0, "#ffe6a0");
  base.addColorStop(0.5, "#f0b83f");
  base.addColorStop(1, "#b87800");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = "#b87800";
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.46, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "#ffe6a0";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.43, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#b87800";
  const dots = 60;
  for (let i = 0; i < dots; i++) {
    const angle = (i / dots) * Math.PI * 2;
    const r = size * 0.39;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  drawBangladeshMap(ctx, cx, cy - size * 0.05, size * 0.5);

  ctx.fillStyle = "#402000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 24px Georgia, 'Noto Serif Bengali', serif";
  ctx.fillText("BANGLADESH", cx, cy + size * 0.35);

  return canvas;
}

function drawCoinEdge() {
  const w = 256;
  const h = 32;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, "#b87800");
  gradient.addColorStop(0.5, "#ffd66a");
  gradient.addColorStop(1, "#8a5c00");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  // Reeded edge: each groove pairs a near-black shadow with a hot highlight
  // right next to it, so the ribs read as raised metal rather than flat
  // stripes — deliberately high-contrast since the edge band is thin on screen.
  const ridgeSpacing = 9;
  for (let x = 0; x < w; x += ridgeSpacing) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(x, 0, 3, h);
    ctx.fillStyle = "rgba(255, 250, 224, 0.85)";
    ctx.fillRect(x + 3, 0, 2.5, h);
  }

  return canvas;
}

function useCoinMaterials() {
  return useMemo(() => {
    const toTexture = (canvas: HTMLCanvasElement) => {
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
      return texture;
    };

    const obverse = toTexture(drawCoinFace());
    const reverse = toTexture(drawCoinFaceMap());
    const edge = toTexture(drawCoinEdge());
    edge.wrapS = THREE.RepeatWrapping;
    edge.repeat.set(14, 1);

    // The cap geometry's UVs come out rotated 90° once the coin is tipped into
    // its Math.PI/2 group rotation, so engraved text runs up the rim instead
    // of reading upright — rotate the cap textures back to compensate.
    for (const cap of [obverse, reverse]) {
      cap.center.set(0.5, 0.5);
      cap.rotation = Math.PI / 2;
    }

    // Groups map to [0] side, [1] top cap, [2] bottom cap; metalness stays under 1 since there's no env map to reflect.
    // Roughness pulled down from the original pass so the multi-light rig below reads as a hard, glinting shine.
    return [
      new THREE.MeshStandardMaterial({ map: edge, metalness: 0.9, roughness: 0.22 }),
      new THREE.MeshStandardMaterial({ map: obverse, metalness: 0.75, roughness: 0.18 }),
      new THREE.MeshStandardMaterial({ map: reverse, metalness: 0.75, roughness: 0.18 }),
    ];
  }, []);
}

// Resting pose the coin holds from the first frame: leaned back hard on the
// X axis so the reeded edge reads clearly along the bottom-left rim — a
// stable "leaning product shot" rather than a spin. Y and Z rotation never
// change; the only rotation axis in play is X (base lean + cursor/scroll).
const BASE_TILT_X = -0.62;
const BASE_TILT_Z = -0.18;

function Coin({
  hovered,
  scrollProgress,
}: {
  hovered: boolean;
  scrollProgress: { current: number };
}) {
  const groupRef = useRef<THREE.Group>(null);
  const scaleRef = useRef(1);
  const materials = useCoinMaterials();
  const pointer = useThree((state) => state.pointer);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    // Coin holds its lean, nudged further by the cursor — X axis only.
    const targetTiltX = BASE_TILT_X + THREE.MathUtils.clamp(-pointer.y, -1, 1) * 0.12;
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetTiltX, 0.06);

    // Hover bump.
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, hovered ? 1.1 : 1, 0.1);
    group.scale.setScalar(scaleRef.current);

    // A gentle continuous float, plus the scroll-away drift (still X-axis only).
    const floatBob = Math.sin(state.clock.elapsedTime * 1.3) * 0.09;
    const progress = scrollProgress.current;
    group.position.y = THREE.MathUtils.lerp(group.position.y, progress * 1.4 + floatBob, 0.08);
    group.rotation.x += progress * 0.3;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[BASE_TILT_X, 0, BASE_TILT_Z]}>
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh material={materials} castShadow receiveShadow>
          <cylinderGeometry args={[1, 1, 0.34, 72]} />
        </mesh>
      </group>
    </group>
  );
}

function useScrollProgress(containerRef: React.RefObject<HTMLDivElement | null>) {
  const progress = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      // 0 while the hero is on screen, ramping to 1 as it scrolls past the top.
      const raw = -rect.top / Math.max(rect.height, 1);
      progress.current = THREE.MathUtils.clamp(raw, 0, 1.5);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [containerRef]);

  return progress;
}

export default function GoldCoinScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const scrollProgress = useScrollProgress(containerRef);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto aspect-square w-full select-none"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <Canvas
        camera={{ position: [0, 0, 4.3], fov: 32 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        {/* No drei <Environment>: its PMREM step crashes on software-rendered GPUs and fetches an HDR from a CDN. */}
        <ambientLight intensity={0.95} color="#6b5426" />
        <directionalLight position={[3, 4, 3]} intensity={2.9} color="#fff2d2" />
        <directionalLight position={[-3, 1, 2]} intensity={1.2} color="#ffe9b8" />
        <directionalLight position={[-2, -3, -2]} intensity={0.6} color="#4a3b1f" />
        {/* Fill light from below — the coin's steep lean exposes the underside of
            its reeded edge, which every other light in this rig sits above. Without
            this it renders pure black and reads as if the coin's been clipped. */}
        <directionalLight position={[0, -4, 2.5]} intensity={1.4} color="#c99a3f" />
        <pointLight position={[0, 0, 3]} intensity={0.7} color="#fff6dd" />
        {/* Tight hot highlight riding the upper-right rim — this is what reads as the "flare" streak on the coin's edge. */}
        <pointLight position={[1.8, 1.6, 2.2]} intensity={3.6} distance={6} decay={2} color="#fff9e6" />
        <spotLight
          position={[2.4, 2.2, 2.6]}
          angle={0.35}
          penumbra={0.6}
          intensity={4}
          distance={8}
          color="#ffe9a8"
        />
        <Coin hovered={hovered} scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
