// DUMMY DATA on the server (in-memory). In weeks 5-6 the database will replace it.
// type    = quote | invoice | review | job | certificate
// label   = small uppercase text under the message
// unread  = number of unread messages (0 = already read)
// starred = true if the chat is starred
// rating  = optional, number of stars (reviews only)
// IMPORTANT: every id must be unique. It links the chat to its thread.
export const conversations = [
  { id: 1, customer: 'Mrs. Khan', type: 'quote', label: 'Quote sent',
    lastMessage: 'Thanks, I will think about it.', time: '10:42', unread: 1, starred: false },
  { id: 2, customer: 'Mr. Ahmed', type: 'invoice', label: 'Invoice overdue',
    lastMessage: 'I will pay this week.', time: 'Yesterday', unread: 2, starred: false },
  { id: 3, customer: 'Mrs. Shah', type: 'quote', label: 'Quote approved',
    lastMessage: 'ok, Approved.', time: 'Mon', unread: 0, starred: false },
  { id: 4, customer: 'Mr. Raza', type: 'invoice', label: 'Invoice paid',
    lastMessage: 'Payment is done, thank you.', time: 'Sun', unread: 0, starred: false },
  { id: 5, customer: 'Mrs. Bibi', type: 'review', label: 'Review request',
    lastMessage: 'Review link has been sent.', time: 'Sat', unread: 0, starred: false },
  { id: 6, customer: 'Mark Bennett', type: 'job', label: 'Job today',
    lastMessage: 'On my way, ETA 15 mins', time: '3 hours ago', unread: 0, starred: false },
  { id: 7, customer: 'Grace Thompson', type: 'job', label: 'Job',
    lastMessage: "Sounds good, I'll be in 👍", time: 'Yesterday', unread: 0, starred: false },
  { id: 8, customer: 'Priya Sharma', type: 'certificate', label: 'Certificate',
    lastMessage: 'Can you renew the CP12 before Sept?', time: '2 days ago', unread: 1, starred: false },
  { id: 9, customer: 'Helen Docherty', type: 'review', label: 'Review',
    lastMessage: 'Thanks so much!', time: '3 days ago', unread: 0, starred: true, rating: 5 },
  { id: 10, customer: 'Tom Richards', type: 'quote', label: 'Quote sent',
    lastMessage: 'Can you send the quote again?', time: '4 days ago', unread: 1, starred: false },
  { id: 11, customer: 'Emma Walsh', type: 'invoice', label: 'Invoice paid',
    lastMessage: 'Paid, thank you!', time: '5 days ago', unread: 0, starred: true },
]