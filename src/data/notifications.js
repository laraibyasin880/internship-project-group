// DUMMY notifications for the bell icon. Later they will come from the backend.
// unread = true shows an orange tint and dot; "to" is the page opened on click.
export const notifications = [
  { id: 1, text: 'Mrs. Khan replied to your quote', time: '10:42', unread: true, to: '/inbox/quotes/1' },
  { id: 2, text: 'Mr. Ahmed says he will pay this week', time: 'Yesterday', unread: true, to: '/inbox/invoices/2' },
  { id: 3, text: "Priya Sharma's CP12 expires soon", time: '2 days ago', unread: true, to: '/vault' },
  { id: 4, text: 'Helen Docherty left a 5-star review', time: '3 days ago', unread: false, to: '/inbox?tab=review' },
]