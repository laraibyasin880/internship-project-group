// One chat row (mock-up style): avatar, name, message, small uppercase label,
// time, an orange dot + tint if unread, and a star button to save the chat.
import { Link } from 'react-router-dom'
import { Star as StarIcon } from 'lucide-react'
import Avatar from './Avatar'
import UnreadDot from './UnreadDot'
import Stars from './Stars'
import { useConversations } from '../../context/ConversationsContext'

// Where to go when a chat is clicked.
// Quote/invoice/review routes are from the handout.
// Job goes to Group 1's Job Detail, certificate goes to the Vault.
export function getLink(chat) {
  if (chat.type === 'quote') return `/inbox/quotes/${chat.id}`
  if (chat.type === 'invoice') return `/inbox/invoices/${chat.id}`
  if (chat.type === 'review') return '/inbox/reviews/new'
  if (chat.type === 'job') return `/jobs/${chat.id}`
  return '/vault'
}

export default function ChatRow({ chat }) {
  const { markRead, toggleStar } = useConversations()
  const isUnread = chat.unread > 0

  return (
    // The row itself. Unread rows get a light orange tint.
    <div
      className={`flex items-center border-b border-line last:border-b-0 ${
        isUnread ? 'bg-accent-50' : 'hover:bg-navy-50'
      }`}
    >
      {/* Clicking the chat opens it and marks it as read */}
      <Link
        to={getLink(chat)}
        onClick={() => markRead(chat.id)}
        className="flex min-w-0 flex-1 items-center gap-4 py-4 pl-5 pr-2"
      >
        <Avatar name={chat.customer} />

        {/* Middle: name, message, label */}
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-ink">{chat.customer}</p>
          <p className="truncate text-sm text-ink">
            {/* Stars only appear when the chat has a rating (reviews) */}
            {chat.rating && <Stars count={chat.rating} />}
            {chat.lastMessage}
          </p>
          <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
            {chat.label}
          </p>
        </div>

        {/* Right: time, and the dot if unread */}
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="text-xs text-muted">{chat.time}</span>
          {isUnread ? <UnreadDot /> : <span className="h-2.5" />}
        </div>
      </Link>

      {/* Star button: a separate button, so tapping it does not open the chat */}
      <button
        onClick={() => toggleStar(chat.id)}
        aria-label={chat.starred ? 'Remove star' : 'Star this conversation'}
        className="mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg hover:bg-navy-50"
      >
        <StarIcon
          size={20}
          className={chat.starred ? 'fill-warning text-warning' : 'text-muted'}
        />
      </button>
    </div>
  )
}