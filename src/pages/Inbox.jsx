// The Inbox screen (route: /inbox), shown as "WhatsApp Hub" like the mock-up.
// The selected tab and the search text live in the address (?tab=...&q=...),
// so after opening a chat and coming Back, the same tab and search are still selected.
import { Link, useSearchParams } from 'react-router-dom'
import { FileText } from 'lucide-react'
import { useConversations } from '../context/ConversationsContext'
import FilterTabs from '../components/inbox/FilterTabs'
import ChatRow from '../components/inbox/ChatRow'
import EmptyState from '../components/inbox/EmptyState'

// Makes text easy to compare: lowercase, and removes spaces and dots.
// So "Mrs.bibi", "MRS BIBI" and "mrs. bibi" all become "mrsbibi".
function simplify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '')
}

export default function Inbox() {
  // The shared list (it changes when a chat is read or starred)
  const { conversations } = useConversations()

  const [params, setParams] = useSearchParams()
  const filter = params.get('tab') || 'all'
  const query = simplify(params.get('q') || '')

  // Called when a tab is clicked: write the new tab into the address.
  function changeTab(value) {
    const next = new URLSearchParams(params) // copy, so the search text stays
    if (value === 'all') next.delete('tab')
    else next.set('tab', value)
    setParams(next, { replace: true })
  }

  // Numbers for the heading and the tabs
  const unreadCount = conversations.filter((c) => c.unread > 0).length
  const starredCount = conversations.filter((c) => c.starred).length
  const counts = { all: conversations.length, unread: unreadCount, starred: starredCount }

  // Does this chat belong to the selected tab?
  function matchesFilter(c) {
    if (filter === 'all') return true
    if (filter === 'unread') return c.unread > 0
    if (filter === 'starred') return c.starred
    return c.type === filter // quote, invoice, review
  }

  // Does this chat match the search text (in the name or the message)?
  function matchesSearch(c) {
    if (!query) return true
    return simplify(c.customer).includes(query) || simplify(c.lastMessage).includes(query)
  }

  // A chat is shown only if it passes BOTH checks
  const shown = conversations.filter((c) => matchesFilter(c) && matchesSearch(c))

  // The text shown when the list is empty
  let emptyMessage = 'No conversations found.'
  if (query) emptyMessage = 'No conversations match your search.'
  else if (filter === 'starred') {
    emptyMessage = 'No starred conversations yet. Tap the star on any conversation to save it here.'
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">

        {/* Heading and Template library button */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy-700">WhatsApp Hub</h1>
            <p className="text-sm text-muted">
              {conversations.length} conversations · {unreadCount} unread
            </p>
          </div>

          <Link
            to="/inbox/templates"
            className="flex min-h-11 items-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-semibold text-navy-700 shadow-sm hover:bg-navy-50"
          >
            <FileText size={18} />
            Template library
          </Link>
        </div>

        <FilterTabs active={filter} onChange={changeTab} counts={counts} />

        <div className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
          {shown.length === 0 ? (
            <EmptyState message={emptyMessage} />
          ) : (
            shown.map((c) => <ChatRow key={c.id} chat={c} />)
          )}
        </div>
      </div>
    </div>
  )
}