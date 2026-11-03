// The bell icon and its dropdown list of notifications.
// Clicking one notification opens its page and marks only that one as read.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import HeaderMenu from './HeaderMenu'
import { notifications as startData } from '../../data/notifications'

export default function NotificationsMenu() {
  // STATE: the list, so reading changes it
  const [items, setItems] = useState(startData)
  const unread = items.filter((n) => n.unread).length

  function markOneRead(id) {
    setItems((list) => list.map((n) => (n.id === id ? { ...n, unread: false } : n)))
  }

  function markAllRead() {
    setItems((list) => list.map((n) => ({ ...n, unread: false })))
  }

  return (
    <HeaderMenu
      icon={Bell}
      label="Notifications"
      showDot={unread > 0}
      title={unread > 0 ? `Notifications (${unread})` : 'Notifications'}
      action={
        unread > 0 && (
          <button
            onClick={markAllRead}
            className="py-2 text-xs font-semibold text-accent hover:underline"
          >
            Mark all as read
          </button>
        )
      }
    >
      {items.length === 0 ? (
        <p className="p-6 text-center text-sm text-muted">You are all caught up.</p>
      ) : (
        items.map((n) => (
          <Link
            key={n.id}
            to={n.to}
            onClick={() => markOneRead(n.id)}
            className={`flex items-start gap-3 border-b border-line px-4 py-3 last:border-b-0 ${
              n.unread ? 'bg-accent-50' : 'hover:bg-navy-50'
            }`}
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm text-ink">{n.text}</p>
              <p className="text-xs text-muted">{n.time}</p>
            </div>
            {n.unread && <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />}
          </Link>
        ))
      )}
    </HeaderMenu>
  )
}