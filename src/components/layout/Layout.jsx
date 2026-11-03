// The shared frame of the app: sidebar + top bar + page content.
// The frame is exactly as tall as the screen and never scrolls by itself.
// Only the <main> area scrolls (chat pages manage their own scrolling),
// so the sidebar and the top bar always stay in place.
// ConversationsProvider shares the chat list (read / starred) with every part of the frame.
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import BottomBar from './BottomBar'
import { ConversationsProvider } from '../../context/ConversationsContext'

export default function Layout() {
  return (
    <ConversationsProvider>
      {/* h-dvh = exactly the height of the screen; overflow-hidden = the page never scrolls */}
      <div className="flex h-dvh overflow-hidden bg-page">
        <Sidebar />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <TopBar />
          {/* The only scrolling area. pb-20 leaves room for the phone bottom bar. */}
          <main className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-20 md:pb-0">
            <Outlet />
          </main>
        </div>
        <BottomBar />
      </div>
    </ConversationsProvider>
  )
}