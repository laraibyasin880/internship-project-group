// The scrolling area with the WhatsApp wallpaper that holds all the bubbles.
// It takes all the space left in the chat card, and only THIS area scrolls.
// When a new message is added, it scrolls down to the newest one.
import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'

// Props: messages = list of messages, cardTo = where quote cards open
export default function MessageList({ messages, cardTo }) {
  const boxRef = useRef(null)

  // Runs after the first draw and whenever "messages" changes
  useEffect(() => {
    const box = boxRef.current
    box.scrollTop = box.scrollHeight
  }, [messages])

  return (
    <div
      ref={boxRef}
      className="flex min-h-40 flex-1 flex-col gap-2 overflow-y-auto bg-wa-bg p-4 sm:p-5"
    >
      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} cardTo={cardTo} />
      ))}
    </div>
  )
}