// DUMMY chat data on the server (in-memory). In weeks 5-6 the database will replace it.
// The key (1, 2, 3...) is the same id as in conversations.js.
//
// Each message:
//   from  = 'tradesperson' (right, green) | 'customer' (left, white) | 'system' (grey note in the middle)
//   ticks = 'sent' | 'delivered' | 'read' (only for my messages)
//   card  = optional quote or invoice card shown inside the bubble { title, total }
export const threads = {
  1: {
    type: 'quote',
    customer: 'Mrs. Khan',
    phone: '+44 7700 900111',
    status: 'Sent',
    messages: [
      { id: 1, from: 'tradesperson', time: '9:41 AM', ticks: 'read',
        card: { title: 'Quote QT-2026-0851', total: '£120.00' },
        text: "Hi Mrs. Khan, here's your quote for the tap replacement. Reply ACCEPT to book it in." },
      { id: 2, from: 'customer', time: '10:42 AM', text: 'Thanks, I will think about it.' },
    ],
  },
  3: {
    type: 'quote',
    customer: 'Mrs. Shah',
    phone: '+44 7700 900222',
    status: 'Approved',
    messages: [
      { id: 1, from: 'tradesperson', time: 'Mon 9:15 AM', ticks: 'read',
        card: { title: 'Quote QT-2026-0852', total: '£180.00' },
        text: "Hi Mrs. Shah, here's your quote for the new sink. Reply ACCEPT to book it in." },
      { id: 2, from: 'customer', time: 'Mon 9:40 AM', text: 'ok, Approved.' },
      { id: 3, from: 'system', text: 'Job auto-created from this quote' },
    ],
  },
  10: {
    type: 'quote',
    customer: 'Tom Richards',
    phone: '+44 7700 900333',
    status: 'Sent',
    messages: [
      { id: 1, from: 'tradesperson', time: 'Thu 2:10 PM', ticks: 'read',
        card: { title: 'Quote QT-2026-0860', total: '£320.00' },
        text: "Hi Tom, here's your quote for the radiator fitting. Reply ACCEPT to book it in." },
      { id: 2, from: 'customer', time: 'Thu 6:25 PM', text: 'Can you send the quote again?' },
    ],
  },
  2: {
    type: 'invoice',
    customer: 'Mr. Ahmed',
    phone: '+44 7700 900444',
    status: 'Overdue',
    invoice: { ref: 'INV-2026-0301', total: '£200.00', dueDate: '8 Oct 2026', daysOverdue: 14 },
    messages: [
      { id: 1, from: 'tradesperson', time: '24 Sep, 9:03 AM', ticks: 'read',
        card: { title: 'Invoice INV-2026-0301', total: '£200.00' },
        text: "Hi Mr. Ahmed, here's your invoice for the boiler repair — £200.00, due 8 Oct 2026. Tap to pay by card." },
      { id: 2, from: 'system', text: 'Day 3 automatic reminder' },
      { id: 3, from: 'tradesperson', time: '11 Oct, 9:00 AM', ticks: 'read',
        text: 'Hi Mr. Ahmed, just a friendly reminder that invoice INV-2026-0301 for £200.00 was due on 8 Oct.' },
      { id: 4, from: 'system', text: 'Day 7 automatic reminder' },
      { id: 5, from: 'tradesperson', time: '15 Oct, 9:00 AM', ticks: 'delivered',
        text: 'Hi Mr. Ahmed, invoice INV-2026-0301 (£200.00) is now 7 days overdue. Please arrange payment when you get a chance.' },
      { id: 6, from: 'customer', time: 'Yesterday, 6:20 PM', text: 'I will pay this week.' },
    ],
  },
  4: {
    type: 'invoice',
    customer: 'Mr. Raza',
    phone: '+44 7700 900555',
    status: 'Paid',
    invoice: { ref: 'INV-2026-0295', total: '£150.00', dueDate: '24 Oct 2026', paidOn: '18 Oct 2026' },
    messages: [
      { id: 1, from: 'tradesperson', time: '10 Oct, 10:20 AM', ticks: 'read',
        card: { title: 'Invoice INV-2026-0295', total: '£150.00' },
        text: "Hi Mr. Raza, here's your invoice for the radiator valve repair — £150.00, due 24 Oct 2026. Tap to pay by card." },
      { id: 2, from: 'system', text: 'Payment of £150.00 received' },
      { id: 3, from: 'customer', time: 'Sun, 4:12 PM', text: 'Payment is done, thank you.' },
    ],
  },
  11: {
    type: 'invoice',
    customer: 'Emma Walsh',
    phone: '+44 7700 900666',
    status: 'Paid',
    invoice: { ref: 'INV-2026-0290', total: '£95.00', dueDate: '26 Oct 2026', paidOn: '17 Oct 2026' },
    messages: [
      { id: 1, from: 'tradesperson', time: '12 Oct, 9:30 AM', ticks: 'read',
        card: { title: 'Invoice INV-2026-0290', total: '£95.00' },
        text: "Hi Emma, here's your invoice for the outside tap fitting — £95.00, due 26 Oct 2026. Tap to pay by card." },
      { id: 2, from: 'system', text: 'Payment of £95.00 received' },
      { id: 3, from: 'customer', time: '17 Oct, 11:05 AM', text: 'Paid, thank you!' },
    ],
  },
}