import { useEffect, useRef, type ReactNode } from 'react'
import { useCommand } from '../../context/CommandContext'

/**
 * CSS 3D "walk-through" room.
 *
 * Instead of a heavy WebGL/GLB room we build a sunny office out of a handful of
 * flat SVG planes placed in real CSS 3D space (floor, ceiling, two walls, a back
 * wall and a desk billboard). The browser does true perspective projection, so
 * moving the camera forward makes the walls converge just like a real corridor.
 *
 * The camera is the `.corridor__world` transform. We drive it from the shared
 * `journeyProgress` (same scroll value the old three.js rig used) but apply
 * per-frame damping, which is what the old rig was missing — so motion is smooth
 * and never snaps, and there is no geometry to clip through.
 */

// World units are CSS pixels. Entrance is z=0, the room runs back to z=-ROOM_DEPTH.
const ROOM_DEPTH = 2800
const ROOM_HALF_W = 760
const FLOOR_Y = 470
const CEIL_Y = -470

type CamKey = { t: number; z: number; yaw: number; pitch: number; x: number }

/**
 * Camera storyboard mapped to the five scroll sections.
 * z   = how far we have walked into the room (bigger = deeper)
 * yaw = heading, positive looks right (toward the window), negative left (shelf)
 * pitch = look up/down, x = lateral step.
 */
const CAM_PATH: CamKey[] = [
  { t: 0.0, z: 120, yaw: 0, pitch: 3, x: 0 }, // hero — establishing doorway shot
  { t: 0.22, z: 620, yaw: -8, pitch: 2, x: -25 }, // about — drift toward the left wall
  { t: 0.4, z: 1150, yaw: 0, pitch: 4, x: 0 }, // skills — approach the desk head-on
  { t: 0.62, z: 1420, yaw: -16, pitch: 2, x: -38 }, // experience — turn to the shelf wall
  { t: 0.82, z: 1660, yaw: 18, pitch: 1, x: 42 }, // contact — turn to the sunny window
  { t: 1.0, z: 1760, yaw: 15, pitch: 1, x: 40 }, // hold on the window
]

function smoothstep(x: number) {
  return x * x * (3 - 2 * x)
}

function sampleCam(p: number) {
  const clamped = Math.max(0, Math.min(1, p))
  let i = 0
  while (i < CAM_PATH.length - 1 && CAM_PATH[i + 1].t < clamped) i += 1
  const a = CAM_PATH[i]
  const b = CAM_PATH[Math.min(i + 1, CAM_PATH.length - 1)]
  const span = b.t - a.t
  const local = span <= 0 ? 0 : (clamped - a.t) / span
  const e = smoothstep(local)
  return {
    z: a.z + (b.z - a.z) * e,
    yaw: a.yaw + (b.yaw - a.yaw) * e,
    pitch: a.pitch + (b.pitch - a.pitch) * e,
    x: a.x + (b.x - a.x) * e,
  }
}

type PlaneSpec = {
  key: string
  w: number
  h: number
  transform: string
  className?: string
  children: ReactNode
}

export default function CorridorScene() {
  const { journeyProgress, pointer } = useCommand()
  const worldRef = useRef<HTMLDivElement>(null)

  // Mirror the live scroll/pointer into refs so the rAF loop reads fresh values
  // without re-subscribing every frame.
  const progressRef = useRef(0)
  const pointerRef = useRef({ x: 0, y: 0 })
  progressRef.current = journeyProgress
  pointerRef.current = pointer

  useEffect(() => {
    const world = worldRef.current
    if (!world) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const cur = { z: CAM_PATH[0].z, yaw: 0, pitch: CAM_PATH[0].pitch, x: 0 }

    const apply = () => {
      // CSS rotate is the inverse of camera heading: looking right rotates world left.
      world.style.transform =
        `rotateX(${cur.pitch}deg) rotateY(${-cur.yaw}deg) ` +
        `translate3d(${cur.x}px, 0px, ${cur.z}px)`
    }

    if (reduced) {
      const s = sampleCam(progressRef.current)
      Object.assign(cur, s)
      apply()
      return
    }

    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      const target = sampleCam(progressRef.current)
      // gentle look-around parallax from the mouse
      target.yaw += pointerRef.current.x * 3.2
      target.pitch += -pointerRef.current.y * 1.8
      target.x += pointerRef.current.x * 26

      const k = 1 - Math.pow(0.0015, dt) // frame-rate independent damping
      cur.z += (target.z - cur.z) * k
      cur.yaw += (target.yaw - cur.yaw) * k
      cur.pitch += (target.pitch - cur.pitch) * k
      cur.x += (target.x - cur.x) * k

      apply()
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const planes: PlaneSpec[] = [
    {
      key: 'floor',
      w: ROOM_HALF_W * 2,
      h: ROOM_DEPTH,
      transform: `translate3d(0px, ${FLOOR_Y}px, ${-ROOM_DEPTH / 2}px) rotateX(90deg)`,
      children: <FloorArt />,
    },
    {
      key: 'ceiling',
      w: ROOM_HALF_W * 2,
      h: ROOM_DEPTH,
      transform: `translate3d(0px, ${CEIL_Y}px, ${-ROOM_DEPTH / 2}px) rotateX(-90deg)`,
      className: 'corridor__plane--ceiling',
      children: <CeilingArt />,
    },
    {
      key: 'left',
      w: ROOM_DEPTH,
      h: FLOOR_Y - CEIL_Y,
      transform: `translate3d(${-ROOM_HALF_W}px, 0px, ${-ROOM_DEPTH / 2}px) rotateY(90deg)`,
      children: <LeftWallArt />,
    },
    {
      key: 'right',
      w: ROOM_DEPTH,
      h: FLOOR_Y - CEIL_Y,
      transform: `translate3d(${ROOM_HALF_W}px, 0px, ${-ROOM_DEPTH / 2}px) rotateY(-90deg)`,
      children: <RightWallArt />,
    },
    {
      key: 'back',
      w: ROOM_HALF_W * 2,
      h: FLOOR_Y - CEIL_Y,
      transform: `translate3d(0px, 0px, ${-ROOM_DEPTH}px)`,
      children: <BackWallArt />,
    },
    {
      key: 'desk',
      w: 1000,
      h: 560,
      transform: `translate3d(0px, 175px, -1900px)`,
      className: 'corridor__plane--billboard',
      children: <DeskArt />,
    },
  ]

  return (
    <div className="corridor" aria-hidden="true">
      <div className="corridor__world" ref={worldRef}>
        {planes.map(({ key, w, h, transform, className, children }) => (
          <div
            key={key}
            className={`corridor__plane ${className ?? ''}`}
            style={{
              width: `${w}px`,
              height: `${h}px`,
              marginLeft: `${-w / 2}px`,
              marginTop: `${-h / 2}px`,
              transform,
            }}
          >
            {children}
          </div>
        ))}
      </div>
      <div className="corridor__vignette" />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Flat SVG art. Palette: warm walls + sun #f5a623 / peach #ff8c69 /   */
/* sky #5bb5e8. Kept simple so it reads as an intentional illustration. */
/* ------------------------------------------------------------------ */

function FloorArt() {
  // Bottom of the SVG is the near end (closest to the camera).
  return (
    <svg viewBox="0 0 1520 2800" preserveAspectRatio="none">
      <defs>
        <linearGradient id="floorG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#caa275" />
          <stop offset="1" stopColor="#e3c79f" />
        </linearGradient>
      </defs>
      <rect width="1520" height="2800" fill="url(#floorG)" />
      {/* plank seams running into the room */}
      {Array.from({ length: 9 }).map((_, i) => (
        <line
          key={i}
          x1={170 * i}
          y1="0"
          x2={170 * i}
          y2="2800"
          stroke="#b78a59"
          strokeOpacity="0.35"
          strokeWidth="3"
        />
      ))}
      {/* soft round rug near the desk */}
      <ellipse cx="760" cy="2050" rx="430" ry="300" fill="#ff8c69" opacity="0.22" />
      <ellipse cx="760" cy="2050" rx="330" ry="225" fill="#f5a623" opacity="0.18" />
    </svg>
  )
}

function CeilingArt() {
  return (
    <svg viewBox="0 0 1520 2800" preserveAspectRatio="none">
      <defs>
        <linearGradient id="ceilG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbf4ea" />
          <stop offset="1" stopColor="#f1e6d6" />
        </linearGradient>
        <radialGradient id="lamp" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff4d6" />
          <stop offset="1" stopColor="#fff4d6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1520" height="2800" fill="url(#ceilG)" />
      <ellipse cx="760" cy="1500" rx="520" ry="520" fill="url(#lamp)" />
      <rect x="690" y="1430" width="140" height="140" rx="20" fill="#fff2cf" />
    </svg>
  )
}

function LeftWallArt() {
  // Left edge of the SVG (x=0) is the entrance; right edge is the far wall.
  return (
    <svg viewBox="0 0 2800 940" preserveAspectRatio="none">
      <defs>
        <linearGradient id="wallL" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3e7d6" />
          <stop offset="0.62" stopColor="#ecdcc6" />
          <stop offset="1" stopColor="#e0cbb0" />
        </linearGradient>
      </defs>
      <rect width="2800" height="940" fill="url(#wallL)" />
      <rect x="0" y="780" width="2800" height="20" fill="#cdb295" opacity="0.5" />
      <rect x="0" y="800" width="2800" height="140" fill="#d9c2a3" opacity="0.45" />
      {/* framed pictures */}
      {[760, 1180, 1600].map((x, i) => (
        <g key={i}>
          <rect x={x} y={250} width="230" height="300" rx="8" fill="#fffaf1" stroke="#b98e5c" strokeWidth="10" />
          <rect
            x={x + 26}
            y={282}
            width="178"
            height="236"
            rx="4"
            fill={i === 1 ? '#5bb5e8' : i === 0 ? '#ff8c69' : '#f5a623'}
            opacity="0.55"
          />
        </g>
      ))}
      {/* a floating shelf with books */}
      <rect x="1980" y="430" width="430" height="22" rx="6" fill="#a9763f" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          x={2000 + i * 62}
          y={330 + (i % 2) * 18}
          width="40"
          height={100 - (i % 2) * 18}
          rx="4"
          fill={['#ff8c69', '#5bb5e8', '#f5a623', '#7bc47f', '#e8a838', '#ef7d57'][i]}
        />
      ))}
    </svg>
  )
}

function RightWallArt() {
  // Sunny window wall. Left edge = entrance, right edge = far wall.
  return (
    <svg viewBox="0 0 2800 940" preserveAspectRatio="none">
      <defs>
        <linearGradient id="wallR" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3e7d6" />
          <stop offset="1" stopColor="#e2cdb2" />
        </linearGradient>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe6ff" />
          <stop offset="1" stopColor="#fff0cf" />
        </linearGradient>
      </defs>
      <rect width="2800" height="940" fill="url(#wallR)" />
      <rect x="0" y="800" width="2800" height="140" fill="#d9c2a3" opacity="0.45" />
      {/* big bright window roughly mid-room */}
      <g>
        <rect x="1080" y="180" width="640" height="470" rx="14" fill="#fbf2e2" stroke="#c79a64" strokeWidth="18" />
        <rect x="1110" y="210" width="580" height="410" fill="url(#sky)" />
        {/* sun + rays */}
        <circle cx="1400" cy="350" r="70" fill="#ffd166" />
        <circle cx="1400" cy="350" r="110" fill="#ffd166" opacity="0.35" />
        {/* mullions */}
        <rect x="1396" y="210" width="10" height="410" fill="#c79a64" />
        <rect x="1110" y="410" width="580" height="10" fill="#c79a64" />
        {/* a little plant on the sill */}
        <rect x="1150" y="620" width="90" height="70" rx="10" fill="#d98c5f" />
        <path d="M1195 620 q-30 -70 -50 -90 M1195 620 q30 -80 60 -96 M1195 620 q0 -90 4 -110" stroke="#5a9e5c" strokeWidth="10" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  )
}

function BackWallArt() {
  return (
    <svg viewBox="0 0 1520 940" preserveAspectRatio="none">
      <defs>
        <linearGradient id="wallB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f1e5d3" />
          <stop offset="1" stopColor="#e1ccb1" />
        </linearGradient>
      </defs>
      <rect width="1520" height="940" fill="url(#wallB)" />
      <rect x="0" y="800" width="1520" height="140" fill="#d9c2a3" opacity="0.45" />
      {/* door */}
      <rect x="610" y="300" width="300" height="500" rx="10" fill="#d8b487" stroke="#b98e5c" strokeWidth="12" />
      <circle cx="860" cy="560" r="12" fill="#8a6334" />
      {/* tall plant beside the door */}
      <rect x="1080" y="690" width="120" height="110" rx="14" fill="#cf8557" />
      <path
        d="M1140 690 q-60 -150 -90 -200 M1140 690 q60 -170 110 -210 M1140 690 q0 -190 6 -240"
        stroke="#5a9e5c"
        strokeWidth="16"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

function DeskArt() {
  // Camera-facing focal billboard: desk + glowing monitor.
  return (
    <svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id="screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fd0f5" />
          <stop offset="1" stopColor="#3f97cf" />
        </linearGradient>
        <radialGradient id="glow" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#5bb5e8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#5bb5e8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="500" cy="300" rx="430" ry="160" fill="url(#glow)" />
      {/* desk top + legs */}
      <rect x="150" y="360" width="700" height="34" rx="8" fill="#b07c46" />
      <rect x="190" y="394" width="26" height="150" fill="#9a6a3a" />
      <rect x="784" y="394" width="26" height="150" fill="#9a6a3a" />
      {/* monitor */}
      <rect x="360" y="150" width="280" height="190" rx="12" fill="#2b2b30" />
      <rect x="380" y="168" width="240" height="150" rx="6" fill="url(#screen)" />
      <rect x="470" y="340" width="60" height="30" fill="#2b2b30" />
      <rect x="430" y="368" width="140" height="14" rx="6" fill="#3a3a40" />
      {/* keyboard + mouse */}
      <rect x="410" y="392" width="190" height="40" rx="8" fill="#e7ddcd" />
      <rect x="620" y="400" width="40" height="30" rx="10" fill="#e7ddcd" />
      {/* mug */}
      <rect x="690" y="320" width="46" height="46" rx="8" fill="#ff8c69" />
      <rect x="736" y="330" width="16" height="22" rx="8" fill="none" stroke="#ff8c69" strokeWidth="6" />
      {/* small plant */}
      <rect x="250" y="316" width="50" height="44" rx="8" fill="#cf8557" />
      <path d="M275 316 q-22 -54 -36 -70 M275 316 q22 -60 44 -72 M275 316 q0 -66 3 -82" stroke="#5a9e5c" strokeWidth="8" fill="none" strokeLinecap="round" />
    </svg>
  )
}
