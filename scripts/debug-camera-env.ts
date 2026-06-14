/** Minimal DOM stubs so Three.js GLTFLoader can parse embedded textures in Node. */
const g = globalThis as typeof globalThis & {
  self: typeof globalThis
  window: typeof globalThis
  document: { createElement: (tag: string) => Record<string, unknown> }
  Image: new () => {
    src: string
    onload: (() => void) | null
    onerror: (() => void) | null
    setAttribute: (k: string, v: string) => void
    addEventListener: (ev: string, fn: () => void) => void
  }
}

g.self = globalThis
g.window = globalThis

class StubImage {
  src = ''
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  setAttribute(k: string, v: string) {
    if (k === 'src') this.src = v
  }
  addEventListener(ev: string, fn: () => void) {
    if (ev === 'load' || ev === 'error') queueMicrotask(fn)
  }
}

g.Image = StubImage as unknown as typeof g.Image
g.document = {
  createElement(tag: string) {
    if (tag === 'img') return new StubImage()
    return {}
  },
}
