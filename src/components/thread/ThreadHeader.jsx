// Top part of a chat (like the mock-up): avatar, name, phone number,
// status badge and an action button. Used by Quote Thread and Invoice Thread.
import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import Avatar from '../inbox/Avatar'
import StatusBadge from '../StatusBadge'

// Props: customer, phone, status = what to show
//        actionLabel / actionTo = the button on the right (e.g. "View quote")
export default function ThreadHeader({ customer, phone, status, actionLabel, actionTo }) {
  return (
    // shrink-0 = this part never gets squashed when the chat is short
    <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-line bg-white px-4 py-3 sm:px-5">
      <Avatar name={customer} />

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-ink">{customer}</p>
        <p className="text-xs text-muted">{phone}</p>
      </div>

      <StatusBadge status={status} />

      <Link
        to={actionTo}
        className="flex min-h-11 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-semibold text-navy-700 hover:bg-navy-50"
      >
        <ExternalLink size={16} />
        {actionLabel}
      </Link>
    </div>
  )
}