// The Invoice Thread screen (route: /inbox/invoices/:id).
// Shows the chat of ONE invoice, its payment status and link, and lets Ali
// send a reminder or reply.
// The page itself does not scroll: header, payment strip, buttons and reply box
// stay in place, only the messages area scrolls.
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { BellRing, Clock } from 'lucide-react'
import { threads } from '../data/threads'
import { friendlyName } from '../utils/friendlyName'
import { useConversations } from '../context/ConversationsContext'
import BackButton from '../components/BackButton'
import ThreadHeader from '../components/thread/ThreadHeader'
import PaymentSummary from '../components/thread/PaymentSummary'
import MessageList from '../components/thread/MessageList'
import ReplyBox from '../components/thread/ReplyBox'
import ThreadNotFound from '../components/thread/ThreadNotFound'

// Current time like "09:41 AM"
function nowTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// The real chat. Separate component so messages reset when another invoice is opened.
function ThreadView({ id, thread }) {
  // STATE: the list of messages, starting from the dummy data
  const [messages, setMessages] = useState(thread.messages)

  // Opening the chat counts as reading it: its unread dot disappears everywhere
  const { markRead } = useConversations()
  useEffect(() => {
    markRead(Number(id))
  }, [id, markRead])

  const invoice = thread.invoice
  const isPaid = thread.status === 'Paid'
  const name = friendlyName(thread.customer)

  // Addresses (routes from the handout)
  const detailLink = `/invoices/${id}`      // Group 1: Invoice Detail
  const payPath = `/pay/${id}`              // G2-S6: Customer Payment Portal
  const chaseLink = `/inbox/chase/${id}`    // G2-S2: Payment Chase Sequence

  // Adds Ali's own typed message (one grey tick = sent)
  function handleSend(text) {
    setMessages([
      ...messages,
      { id: Date.now(), from: 'tradesperson', text, time: nowTime(), ticks: 'sent' },
    ])
  }

  // Sends a ready-made reminder with the payment link, plus a grey note in the chat
  function handleReminder() {
    const link = `${window.location.origin}${payPath}`
    const when =
      thread.status === 'Overdue'
        ? `is overdue (it was due on ${invoice.dueDate})`
        : `is due on ${invoice.dueDate}`
    const text = `Hi ${name}, just a reminder that invoice ${invoice.ref} for ${invoice.total} ${when}. You can pay here: ${link}`

    const stamp = Date.now()
    setMessages([
      ...messages,
      { id: stamp, from: 'system', text: 'Manual reminder sent' },
      { id: stamp + 1, from: 'tradesperson', text, time: nowTime(), ticks: 'sent' },
    ])
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
            actionLabel="View invoice"
            actionTo={detailLink}
          />

          <PaymentSummary invoice={invoice} status={thread.status} payPath={payPath} />

          <MessageList messages={messages} cardTo={detailLink} />

          {/* Action buttons: reminder and chase sequence */}
          <div className="flex shrink-0 flex-wrap gap-2 border-t border-line bg-white px-3 py-3">
            <button
              onClick={handleReminder}
              disabled={isPaid}
              title={isPaid ? 'This invoice is already paid' : ''}
              className="flex min-h-11 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-semibold text-navy-700 hover:bg-navy-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <BellRing size={16} />
              Send reminder
            </button>
            <Link
              to={chaseLink}
              className="flex min-h-11 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-semibold text-navy-700 hover:bg-navy-50"
            >
              <Clock size={16} />
              Chase sequence
            </Link>
          </div>

          <ReplyBox
            onSend={handleSend}
            templateType="invoice"
            values={{ customerName: name, amount: invoice.total, dueDate: invoice.dueDate }}
          />
        </div>
      </div>
    </div>
  )
}

export default function InvoiceThread() {
  // useParams reads the :id from the address (/inbox/invoices/2 gives id = "2")
  const { id } = useParams()
  const thread = threads[id]

  // No such invoice (or it is not an invoice): show a friendly message
  if (!thread || thread.type !== 'invoice') {
    return <ThreadNotFound message="This invoice conversation was not found." />
  }

  // key={id} starts a fresh ThreadView for each invoice
  return <ThreadView key={id} id={id} thread={thread} />
}