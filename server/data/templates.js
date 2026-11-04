// Ready-made messages on the server (in-memory).
// {customer_name}, {amount} and {due_date} are placeholders:
// the React screen replaces them with the real values when a template is used.
// type = 'quote' or 'invoice' decides which chat shows the template.
// Owner of the Template Library is G2-S2. This list is only READ by the reply box.
export const templates = [
  {
    id: 1,
    type: 'quote',
    name: 'Quote follow-up ',
    text: 'Hi {customer_name}, just checking you received your quote for {amount}. Let me know if you have any questions.',
  },
  {
    id: 2,
    type: 'quote',
    name: 'Quote approved',
    text: 'Thanks {customer_name}! I will book in your job ({amount}) and confirm a date shortly.',
  },
  {
    id: 3,
    type: 'quote',
    name: 'Send quote again',
    text: 'Hi {customer_name}, here is your quote again for {amount}. Reply ACCEPT to approve it.',
  },
  {
    id: 4,
    type: 'invoice',
    name: 'Payment reminder',
    text: 'Hi {customer_name}, just a friendly reminder that your invoice for {amount} is due on {due_date}. Thank you!',
  },
  {
    id: 5,
    type: 'invoice',
    name: 'Overdue notice',
    text: 'Hi {customer_name}, your invoice for {amount} was due on {due_date} and is now overdue. Please arrange payment when you can.',
  },
  {
    id: 6,
    type: 'invoice',
    name: 'Thank you for paying',
    text: 'Thanks {customer_name}! We have received your payment of {amount}.',
  },
]