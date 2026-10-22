export const initialRules = [
  { id: 'day3', day: 'Day 3', tone: 'Polite reminder', enabled: true,
    desc: 'Friendly nudge, assumes oversight, includes payment link.',
    message: 'Hi {{customer_name}}, just a friendly reminder that invoice {{invoice_id}} is due. Pay here: {{payment_link}}' },
  { id: 'day7', day: 'Day 7', tone: 'Firmer follow-up', enabled: true,
    desc: 'Direct tone, restates amount and due date clearly.',
    message: 'Hi {{customer_name}}, invoice {{invoice_id}} for £{{amount}} was due on {{due_date}} and is still unpaid. Please arrange payment.' },
  { id: 'day14', day: 'Day 14', tone: 'Final notice', enabled: true,
    desc: 'Firm, final tone before considering next steps.',
    message: 'Hi {{customer_name}}, this is a final notice for invoice {{invoice_id}}. Please pay within 48 hours.' },
];

export const activeChases = [
  { id: 'INV-1001', customer: 'Mr Khan', amount: '85.00', info: 'Day 9 · next stage: Day 14 in 5 days' },
  { id: 'INV-1002', customer: 'Mrs Smith', amount: '90.00', info: 'Day 4 · next stage: Day 7 in 3 days' },
];