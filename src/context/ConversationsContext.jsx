// One shared list of conversations for the whole app.
// The Inbox, the sidebar badge, the chat dropdown and the thread pages all read
// THIS list, so when a chat is read or starred, it changes everywhere at once.
// The list is loaded from the server: GET /api/conversations
// Read and star changes are also saved on the server: PATCH /api/conversations/:id/...
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const ConversationsContext = createContext(null)

export function ConversationsProvider({ children }) {
  // STATE: the list (empty until the server answers), plus loading and error info
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Asks the server for all chats. Used at start and when a save fails.
  const loadConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/conversations')
      if (!res.ok) throw new Error('Server answered with status ' + res.status)
      const data = await res.json()
      setConversations(data)
      setError('')
    } catch {
      setError('Could not load chats. Please check that the server is running.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Runs once when the app opens.
  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  // Tells the server about a change. If the server fails, we reload the real list.
  const saveOnServer = useCallback(
    async (id, action) => {
      try {
        const res = await fetch(`/api/conversations/${id}/${action}`, { method: 'PATCH' })
        if (!res.ok) throw new Error('Save failed')
      } catch {
        loadConversations()
      }
    },
    [loadConversations]
  )

  // Marks one chat as read: the screen changes first, then the server is told.
  // If it is already read we return the SAME list, so React does not redraw.
  const markRead = useCallback(
    (id) => {
      setConversations((list) =>
        list.some((c) => c.id === id && c.unread > 0)
          ? list.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
          : list
      )
      saveOnServer(id, 'read')
    },
    [saveOnServer]
  )

  // Stars or un-stars one chat: the screen changes first, then the server is told.
  const toggleStar = useCallback(
    (id) => {
      setConversations((list) =>
        list.map((c) => (c.id === id ? { ...c, starred: !c.starred } : c))
      )
      saveOnServer(id, 'star')
    },
    [saveOnServer]
  )

  return (
    <ConversationsContext.Provider
           value={{ conversations, loading, error, markRead, toggleStar, reload: loadConversations }}
    >
      {children}
    </ConversationsContext.Provider>
  )
}

// Any component can call useConversations() to get the list and the functions.
export function useConversations() {
  return useContext(ConversationsContext)
}