import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionGlobalConfig } from 'framer-motion'
import { inject } from '@vercel/analytics'
import './i18n'
import App from './App'
import './index.css'

declare global {
  interface Window {
    /** Set by the build-time prerenderer (vite.config.ts → PuppeteerRenderer `inject`). */
    __PRERENDER_INJECTED?: { prerender?: boolean }
  }
}

const isPrerender = Boolean(window.__PRERENDER_INJECTED?.prerender)
const rootEl = document.getElementById('root')!
// True when this HTML came from the build-time prerender: the page already
// shows its final content, so entrance animations must not blank it out again.
const bootedFromPrerender = !isPrerender && rootEl.hasChildNodes()

if (isPrerender) {
  // 1) Every framer-motion animation completes instantly, so the snapshot
  //    captures final (visible) styles instead of `opacity: 0` initial states.
  MotionGlobalConfig.skipAnimations = true

  // 2) `whileInView` sections below the fold never intersect a headless
  //    viewport. Report every observed element as visible so they render in
  //    their final state too.
  class AlwaysVisibleObserver {
    readonly root: Element | Document | null = null
    readonly rootMargin = '0px'
    readonly thresholds: ReadonlyArray<number> = [0]
    private readonly callback: IntersectionObserverCallback
    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback
    }
    observe(target: Element) {
      const rect = target.getBoundingClientRect()
      const entry = {
        target,
        isIntersecting: true,
        intersectionRatio: 1,
        boundingClientRect: rect,
        intersectionRect: rect,
        rootBounds: null,
        time: performance.now(),
      } as IntersectionObserverEntry
      this.callback([entry], this as unknown as IntersectionObserver)
    }
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return []
    }
  }
  window.IntersectionObserver = AlwaysVisibleObserver as unknown as typeof IntersectionObserver
} else if (bootedFromPrerender) {
  // The static HTML is already painted with everything visible. Skip entrance
  // animations until the visitor first interacts (or a short grace period),
  // otherwise React's mount would snap the hero to opacity 0 and fade it back
  // in — a visible blink. Scroll-triggered animations resume afterwards.
  MotionGlobalConfig.skipAnimations = true
  const resume = () => {
    MotionGlobalConfig.skipAnimations = false
    for (const evt of resumeEvents) window.removeEventListener(evt, resume)
  }
  const resumeEvents = ['scroll', 'wheel', 'touchstart', 'pointermove', 'keydown'] as const
  for (const evt of resumeEvents) window.addEventListener(evt, resume, { passive: true, once: true })
  window.setTimeout(resume, 1500)
}

// Vercel Analytics injects a <script> into <head>; keep it out of the static
// snapshot so it is added exactly once, at runtime.
if (!isPrerender) inject()

/**
 * Tells the build-time prerenderer (vite.config.ts → renderAfterDocumentEvent)
 * that the page is ready to snapshot. Rendered as the last sibling so its
 * effect runs after the whole App subtree has committed; two frames give
 * framer-motion time to write its (instant) final values into inline styles.
 * A fallback timer guarantees the event even if frames stall.
 */
function PrerenderReady() {
  React.useEffect(() => {
    let fired = false
    const fire = () => {
      if (fired) return
      fired = true
      document.dispatchEvent(new Event('prerender-ready'))
    }
    let frames = 0
    const tick = () => (++frames >= 2 ? fire() : requestAnimationFrame(tick))
    requestAnimationFrame(tick)
    const fallback = window.setTimeout(fire, 8000)
    return () => window.clearTimeout(fallback)
  }, [])
  return null
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      {isPrerender && <PrerenderReady />}
    </BrowserRouter>
  </React.StrictMode>,
)
