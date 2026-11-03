// A small helper (hook) that loads ONE chat from the server: GET /api/threads/:id
// It returns { thread, loading, error }
//   loading = true while the server has not answered yet
//   error   = '' (all good) | 'notfound' (server said 404) | 'failed' (server down or other problem)
import { useEffect, useState } from 'react'

export function useThread(id) {
  // We remember WHICH id the answer belongs to, so an old answer is never shown for a new chat.
  const [result, setResult] = useState({ id: null, thread: null, error: '' })

  useEffect(() => {
    let cancelled = false // ignore the answer if the page changed meanwhile

    async function load() {
      try {
        const res = await fetch(`/api/threads/${id}`)
        if (res.status === 404) {
          if (!cancelled) setResult({ id, thread: null, error: 'notfound' })
          return
        }
        if (!res.ok) throw new Error('Server answered with status ' + res.status)
        const data = await res.json()
        if (!cancelled) setResult({ id, thread: data, error: '' })
      } catch {
        if (!cancelled) setResult({ id, thread: null, error: 'failed' })
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id])

  // Still loading when the stored answer is for a different id
  const loading = result.id !== id
  return {
    thread: loading ? null : result.thread,
    loading,
    error: loading ? '' : result.error,
  }
}