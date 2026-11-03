// Left navy sidebar (desktop only). Matches the mock-up.
// To change a menu item, edit the lists below.
import { NavLink } from 'react-router-dom'
import { useConversations } from '../../context/ConversationsContext'
import {
  Wrench, Home, Mic, Briefcase, CalendarDays, FileText,
   ShieldCheck, MessageCircle, Settings,
} from 'lucide-react'

// Each item: label, route (from the handout), icon, optional badge number.
const workspace = [
  { label: 'Dashboard', to: '/dashboard', icon: Home },
  { label: 'Voice Quote', to: '/quotes/record', icon: Mic },
  { label: 'Jobs', to: '/jobs', icon: Briefcase },
  { label: 'Schedule', to: '/schedule', icon: CalendarDays },
  { label: 'Invoicing', to: '/invoices', icon: FileText },
  { label: 'Certificates', to: '/vault', icon: ShieldCheck },
  { label: 'WhatsApp Inbox', to: '/inbox', icon: MessageCircle, badge: 3 },
]

const account = [{ label: 'Settings', to: '/settings', icon: Settings }]

// One menu link. NavLink tells us if this link is the current page (isActive).
function MenuItem({ item }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        `flex min-h-11 items-center gap-3 border-l-4 px-6 text-sm font-semibold ${
          isActive
            ? 'border-accent bg-white/10 text-white' // current page: orange edge
            : 'border-transparent text-white/70 hover:bg-white/5 hover:text-white'
        }`
      }
    >
      <Icon size={20} />
      <span className="flex-1">{item.label}</span>
      {/* Orange number badge, only if the item has one */}
      {item.badge > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-bold text-navy-900">
          {item.badge}
        </span>
      )}
    </NavLink>
  )
}

export default function Sidebar() {
    // The number on the WhatsApp Inbox menu is the real number of unread chats
  const { conversations } = useConversations()
  const unread = conversations.filter((c) => c.unread > 0).length
  return (
    // "hidden md:flex" = hidden on phones, visible from medium screens up
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-navy-900 md:flex">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-navy-900">
          <Wrench size={22} />
        </div>
        <span className="text-xl font-bold text-white">TradesDash</span>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        <p className="px-6 pb-2 text-xs font-semibold tracking-wider text-white/40">WORKSPACE</p>
        {workspace.map((item) => (
          <MenuItem
            key={item.to}
            item={item.to === '/inbox' ? { ...item, badge: unread } : item}
          />
        ))}

        <p className="px-6 pb-2 pt-6 text-xs font-semibold tracking-wider text-white/40">ACCOUNT</p>
        {account.map((item) => <MenuItem key={item.to} item={item} />)}
      </nav>

      {/* Business name at the bottom */}
      <div className="border-t border-white/10 px-6 py-4 text-xs text-white/50">
        <p>Okafor Plumbing &amp; Heating</p>
        <p>Gas Safe 748213 · Leeds</p>
      </div>
    </aside>
  )
}