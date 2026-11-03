// The Quote Thread screen (route: /inbox/quotes/:id).
// Shows the chat of ONE quote and lets Ali reply.
// The chat comes from the server: GET /api/threads/:id (see hooks/useThread.js)
// The page itself does not scroll: header and reply box stay in place,
// only the messages area scrolls.
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useThread } from '../hooks/useThread'
import { friendlyName } from '../utils/friendlyName'
import { useConversations } from '../context/ConversationsContext'
import BackButton from '../components/BackButton'
import ThreadHeader from '../components/thread/ThreadHeader'
import MessageList from '../components/thread/MessageList'
import ReplyBox from '../components/thread/ReplyBox'
import ThreadNotFound from '../components/thread/ThreadNotFound'

// The real chat. Separate component so messages reset when another quote is opened.
function ThreadView({ id, thread }) {
  // STATE: the list of messages, starting from what the server sent
  const [messages, setMessages] = useState(thread.messages)

  // Opening the chat counts as reading it: its unread dot disappears everywhere
  const { markRead } = useConversations()
  useEffect(() => {
    markRead(Number(id))
  }, [id, markRead])

  // The quote card and the "View quote" button open Group 1's Quote Preview
  const previewLink = `/quotes/${id}/preview`

  // The amount for templates comes from the first message that has a quote card
  const amount = thread.messages.find((m) => m.card)?.card.total || ''

  // Adds Ali's new message to the end of the list (one grey tick = sent)
  // (For now it is only added on the screen. Saving it on the server comes in the next step.)
  function handleSend(text) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMessages([...messages, { id: Date.now(), from: 'tradesperson', text, time, ticks: 'sent' }])
  }

  return (
    // flex-1 = take all the height of the page area. min-h-[30rem] = on a very
    // short screen the page area scrolls instead of squashing the chat.
    <div className="flex min-h-[30rem] flex-1 flex-col p-4 sm:p-6">
      <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col">
        <div className="mb-2 shrink-0">
          <BackButton />
        </div>

        {/* The chat card: fills the rest of the height; only the messages scroll inside it */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-line bg-white shadow-sm">
          <ThreadHeader
            customer={thread.customer}
            phone={thread.phone}
            status={thread.status}
            actionLabel="View quote"
            actionTo={previewLink}
          />

          <MessageList messages={messages} cardTo={previewLink} />

          <ReplyBox
            onSend={handleSend}
            values={{ customerName: friendlyName(thread.customer), amount }}
          />
        </div>
      </div>
    </div>
  )
}

export default function QuoteThread() {
  // useParams reads the :id from the address (/inbox/quotes/1 gives id = "1")
  const { id } = useParams()
  const { thread, loading, error } = useThread(id)

  // Waiting for the server
  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="mx-auto max-w-3xl">
          <BackButton />
          <p className="mt-4 text-sm text-muted">Loading chat...</p>
        </div>
      </div>
    )
  }

  // The server is down or something went wrong
  if (error === 'failed') {
    return (
      <div className="p-4 sm:p-6">
        <div className="mx-auto max-w-3xl">
          <BackButton />
          <p role="alert" className="mt-4 text-sm font-semibold text-danger">
            Could not load this chat. Please check that the server is running.
          </p>
        </div>
      </div>
    )
  }

  // No such quote (or it is not a quote): show a friendly message
  if (!thread || thread.type !== 'quote') {
    return <ThreadNotFound message="This quote conversation was not found." />
  }

  // key={id} starts a fresh ThreadView for each quote
  return <ThreadView key={id} id={id} thread={thread} />
}