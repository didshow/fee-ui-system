import { useEffect, useRef } from 'react'

// ─── Meiqia SDK global type ───────────────────────────────────────────────────
declare global {
  interface Window {
    _MEIQIA: ((...args: unknown[]) => void) & { a?: unknown[] }
  }
}

const ENT_ID = import.meta.env.VITE_MEIQIA_ENT_ID as string | undefined

/**
 * Loads the Meiqia Web SDK once and provides helpers to open/close the chat
 * panel and attach user metadata.
 *
 * Usage:
 *   const { openChat } = useMeiqia({ userId: 'U1001' })
 *   <button onClick={openChat}>联系客服</button>
 */
export function useMeiqia({ userId }: { userId: string | null } = { userId: null }) {
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current || !ENT_ID) return
    loaded.current = true

    // Bootstrap Meiqia queue before the script loads (official snippet pattern)
    window._MEIQIA =
      window._MEIQIA ||
      function (...args: unknown[]) {
        ;(window._MEIQIA.a = window._MEIQIA.a || []).push(args)
      }

    window._MEIQIA('entId', ENT_ID)
    window._MEIQIA('withoutBtn') // hide default floating button; we own the entry point

    const script = document.createElement('script')
    script.async = true
    script.charset = 'UTF-8'
    script.src = 'https://static.meiqia.com/widget/loader.js'
    document.head.appendChild(script)
  }, [])

  // Attach user identity whenever userId becomes available
  useEffect(() => {
    if (!ENT_ID || !userId) return
    window._MEIQIA?.('metadata', { id: userId })
  }, [userId])

  function openChat() {
    if (!ENT_ID) {
      // Dev-only warning — will not appear in production builds
      return
    }
    window._MEIQIA?.('showPanel')
  }

  function closeChat() {
    window._MEIQIA?.('hidePanel')
  }

  return { openChat, closeChat, configured: Boolean(ENT_ID) }
}
