export const customers = [
  { id: 1, name: 'Helen Docherty', initials: 'HD', phone: '+44 7823 445190',
    job: 'radiator bleed', jobId: 'JOB-2026-0442' },
  { id: 2, name: 'Aisha Bello', initials: 'AB', phone: '+44 7700 900123',
    job: 'drain unblock', jobId: 'JOB-2026-0451' },
];

// Har customer ki chat. 'out' = hamari taraf se, 'in' = customer ki taraf se
export const initialMessages = {
  1: [
    { id: 1, from: 'out', review: true, time: '3 days ago',
      text: "Hi Helen, all done with the radiators! If you have 30 seconds, we'd love a quick Google review — it really helps a small business like ours: g.page/r/okafor-plumbing/review" },
    { id: 2, from: 'in', stars: 5, time: '3 days ago',
      text: 'Thanks so much! Really happy with the work.' },
    { id: 3, from: 'out', time: '3 days ago',
      text: 'Thank you so much for the kind words — really means a lot! 🙏' },
  ],
  2: [],
};