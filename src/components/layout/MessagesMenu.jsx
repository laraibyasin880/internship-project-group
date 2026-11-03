// The chat icon and its dropdown showing the chats (unread ones first).
// It reads the same shared list as the Inbox, so both always agree.
// Clicking a chat opens it and marks it as read, so its dot disappears.
import { Link } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
import HeaderMenu from './HeaderMenu'
import Avatar from '../inbox/Avatar'
import UnreadDot from '../inbox/UnreadDot'
import { getLink } from '../inbox/ChatRow'
import { useConversations } from '../../context/ConversationsContext'

export default function MessagesMenu() {
  const { conversations, markRead } = useConversations()
  const unread = conversations.filter((c) => c.unread > 0).length

  // Unread chats first (sort keeps the original order inside each group), then take 5
  const latest = [...conversations]
    .sort((a, b) => (b.unread > 0) - (a.unread > 0))
    .slice(0, 5)

  return (
    <HeaderMenu
      icon={MessageSquare}
      label="Messages"
      showDot={unread > 0}
      title={unread > 0 ? `Messages (${unread} unread)` : 'Messages'}
    >
      {latest.map((c) => (
        <Link
          key={c.id}
          to={getLink(c)}
          onClick={() => markRead(c.id)}
          className={`flex items-center gap-3 border-b border-line px-4 py-3 ${
            c.unread > 0 ? 'bg-accent-50' : 'hover:bg-navy-50'
          }`}
        >
          <Avatar name={c.customer} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{c.customer}</p>
            <p className="truncate text-sm text-muted">{c.lastMessage}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <span className="text-xs text-muted">{c.time}</span>
            {c.unread > 0 ? <UnreadDot /> : <span className="h-2.5" />}
          </div>
        </Link>
      ))}

      {/* Link to the full Inbox */}
      <Link
        to="/inbox"
        className="flex min-h-11 items-center justify-center text-sm font-semibold text-navy-700 hover:bg-navy-50"
      >
        Open WhatsApp Hub
      </Link>
    </HeaderMenu>
  )
}