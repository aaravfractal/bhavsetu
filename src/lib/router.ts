import { useSyncExternalStore } from 'react'

/**
 * A ~40-line history router. react-router is ~20KB gzipped and the app has
 * eleven flat routes with no nesting, no loaders and no params, so it does not
 * earn its place in a <150KB budget.
 *
 * Static hosts must fall back to index.html for unknown paths (Vite's dev
 * server and `vite preview` already do).
 */

const listeners = new Set<() => void>()

function emit() {
  for (const l of listeners) l()
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb)
  window.addEventListener('popstate', cb)
  return () => {
    listeners.delete(cb)
    window.removeEventListener('popstate', cb)
  }
}

function getPath(): string {
  return window.location.pathname
}

export function navigate(path: string, replace = false): void {
  if (path === getPath()) return
  window.history[replace ? 'replaceState' : 'pushState']({}, '', path)
  emit()
}

export function useRoute(): string {
  return useSyncExternalStore(subscribe, getPath, () => '/')
}

/** An anchor that routes in-app but still behaves like a real link. */
export function linkProps(path: string) {
  return {
    href: path,
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
      e.preventDefault()
      navigate(path)
    },
  }
}
