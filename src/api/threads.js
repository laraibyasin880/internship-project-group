// Small helper functions that talk to the server about chats.

// Sends Ali's new message to the server and returns the saved message.
// Throws an error if the server says no (empty text, unknown chat, server down).
export async function postMessage(id, text) {
  const res = await fetch(`/api/threads/${id}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
  if (!res.ok) throw new Error('Server answered with status ' + res.status)
  return res.json()
}

// Sends a payment reminder for one invoice.
// The server answers with the two new chat items: [grey note, reminder message].
export async function postReminder(id, text) {
  const res = await fetch(`/api/invoices/${id}/reminder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
  if (!res.ok) throw new Error('Server answered with status ' + res.status)
  return res.json()
}