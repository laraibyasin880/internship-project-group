// One shared list of conversations for the whole app.
// The Inbox, the sidebar badge, the chat dropdown and the thread pages all read
// THIS list, so when a chat is read or starred, it changes everywhere at once.
import { createContext, useCallback, useContext, useState } from 'react'
import { conversations as startData } from '../data/conversations'

const ConversationsContext = createContext(null)

export function ConversationsProvider({ children }) {
  // STATE: the list. It starts from the dummy data in conversations.js
  const [conversations, setConversations] = useState(startData)

  // Marks one chat as read (unread becomes 0).
  // If it is already read we return the SAME list, so React does not redraw.
  const markRead = useCallback((id) => {
    setConversations((list) =>
      list.some((c) => c.id === id && c.unread > 0)
        ? list.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
        : list
    )
  }, [])

  // Stars or un-stars one chat
  const toggleStar = useCallback((id) => {
    setConversations((list) =>
      list.map((c) => (c.id === id ? { ...c, starred: !c.starred } : c))
    )
  }, [])

  return (
    <ConversationsContext.Provider value={{ conversations, markRead, toggleStar }}>
      {children}
    </ConversationsContext.Provider>
  )
}

// Any component can call useConversations() to get the list and the two functions.
export function useConversations() {
  return useContext(ConversationsContext)
}