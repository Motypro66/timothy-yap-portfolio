/**
 * Headless camera path debug — run: npm run debug:camera
 * Loads sunny-room.glb via fs + GLTFLoader.parseAsync (Node + happy-dom).
 */
import './debug-camera-env.ts'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import {
  analyzeRoomLayout,
  buildCameraPathFromLayout,
  buildSafeCameraPath,
  normalizeRoom,
} from '../src/utils/roomScene.ts'
import { collectObstacleBoxes, buildWalkVolume } from '../src/utils/cameraCollision.ts'
import { sampleJourneyPath, setRuntimeJourneyKeyframes } from '../src/data/journeyPath.ts'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const glbPath = path.join(rootDir, 'public', 'models', 'sunny-room.glb')

function fmt(v: THREE.Vector3 | [number, number, number]) {
  const a = Array.isArray(v) ? v : v.toArray()
  return a.map((n) => n.toFixed(3)).join(', ')
}

function insideObstacle(pos: THREE.Vector3, obstacles: THREE.Box3[]) {
  return obstacles.find((b) => b.containsPoint(pos)) ?? null
}

function minClear(pos: THREE.Vector3, obstacles: THREE.Box3[]) {
  let min = Infinity
  for (const box of obstacles) {
    const closest = new THREE.Vector3(
      THREE.MathUtils.clamp(pos.x, box.min.x, box.max.x),
      THREE.MathUtils.clamp(pos.y, box.min.y, box.max.y),
      THREE.MathUtils.clamp(pos.z, box.min.z, box.max.z),
    )
    min = Math.min(min, pos.distanceTo(closest))
  }
  return min
}

async function main() {
  const buf = readFileSync(glbPath)
  const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
  const loader = new GLTFLoader()
  const gltf = await loader.parseAsync(arrayBuffer, path.dirname(glbPath) + path.sep)

  const root = gltf.scene.clone(true)
  const box = normalizeRoom(root)
  const layout = analyzeRoomLayout(root, box)
  const obstacles = collectObstacleBoxes(root)
  const walk = buildWalkVolume(layout)
  const raw = buildCameraPathFromLayout(layout)
  const safe = buildSafeCameraPath(root, box)

  setRuntimeJourneyKeyframes(safe)

  console.log('\n=== sunny-room.glb camera debug ===\n')
  console.log('GLB:', glbPath)
  console.log('box min:', fmt(box.min))
  console.log('box max:', fmt(box.max))
  console.log('walk min:', fmt(walk.min))
  console.log('walk max:', fmt(walk.max))
  console.log('obstacles:', obstacles.length)
  console.log('')
  console.log('depthDir:', layout.depthDir, '| frontZ:', layout.frontZ.toFixed(3), '| backZ:', layout.backZ.toFixed(3))
  console.log('entrance:', fmt(layout.entrance))
  console.log('desk:', fmt(layout.desk))
  console.log('monitor:', fmt(layout.monitor))
  console.log('shelf:', fmt(layout.shelf))
  console.log('window:', fmt(layout.window))
  console.log('eye:', layout.eye.toFixed(3), '| look:', layout.look.toFixed(3))
  console.log('')

  const labels = ['hero', 'about', 'skills', 'experience', 'contact']
  console.log('--- RAW storyboard ---')
  raw.forEach((s, i) => {
    const p = new THREE.Vector3(...s.pos)
    const hit = insideObstacle(p, obstacles)
    console.log(
      `${i} ${labels[i] ?? '?'} | pos [${fmt(s.pos)}] fov ${s.fov} | clear ${minClear(p, obstacles).toFixed(3)}${hit ? ' INSIDE' : ''}`,
    )
    console.log(`       target [${fmt(s.target)}]`)
  })

  console.log('\n--- SAFE (after collision) ---')
  safe.forEach((s, i) => {
    const p = new THREE.Vector3(...s.pos)
    const hit = insideObstacle(p, obstacles)
    console.log(
      `${i} ${labels[i] ?? '?'} | pos [${fmt(s.pos)}] fov ${s.fov} | clear ${minClear(p, obstacles).toFixed(3)}${hit ? ' INSIDE' : ''}`,
    )
    console.log(`       target [${fmt(s.target)}]`)
  })

  console.log('\n--- Scroll samples (sampleJourneyPath) ---')
  for (const t of [0, 0.11, 0.22, 0.4, 0.62, 0.82, 1]) {
    const s = sampleJourneyPath(t)
    const hit = insideObstacle(s.position, obstacles)
    console.log(
      `t=${t.toFixed(2)} section=${s.section} | pos [${fmt(s.position)}] fov ${s.fov.toFixed(1)} | clear ${minClear(s.position, obstacles).toFixed(3)}${hit ? ' INSIDE' : ''}`,
    )
  }

  const bad = safe.filter((s) => insideObstacle(new THREE.Vector3(...s.pos), obstacles))
  console.log('')
  if (bad.length) {
    console.log(`WARN: ${bad.length} safe shot(s) still inside obstacles`)
    process.exitCode = 1
  } else {
    console.log('OK: all safe shots outside obstacle volumes')
  }
}

main().catch((err) => {
  console.error('debug:camera failed:', err)
  process.exitCode = 1
})
