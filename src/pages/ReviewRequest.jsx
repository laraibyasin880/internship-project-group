import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Star } from 'lucide-react';
import { customers, initialMessages } from '../data/jobs';
import { initialTemplates } from '../data/templates';
import Modal from '../components/Modal';

const REVIEW_LINK = 'g.page/r/okafor-plumbing/review';
const reviewTemplate = initialTemplates.find((t) => t.name === 'Review Request');

function buildMessage(customer) {
  const firstName = customer.name.split(' ')[0];
  return `Hi ${firstName}, all done with the ${customer.job}! ${reviewTemplate.body} ${REVIEW_LINK}`;
}

function Bubble({ m }) {
  const isOut = m.from === 'out';
  return (
    <div
      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm text-ink shadow-sm ${
        isOut ? 'self-end bg-wa-out' : 'self-start bg-white'
      }`}
    >
      {m.review && (
        <div className="mb-1 rounded border-l-4 border-whatsapp bg-black/5 px-2 py-1 text-xs font-semibold">
          ⭐ Quick favour?
        </div>
      )}
      {m.stars && <div className="mb-0.5">{'⭐'.repeat(m.stars)}</div>}
      {m.text}
      <span className="mt-1 block text-right text-[10px] text-muted">
        {m.time}
        {isOut && <span className="ml-1 text-[#53BDEB]">✓✓</span>}
      </span>
    </div>
  );
}

function ReviewRequest() {
  const [messages, setMessages] = useState(initialMessages);
  const [activeId, setActiveId] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalCustomerId, setModalCustomerId] = useState(1);
  const [input, setInput] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  const active = customers.find((c) => c.id === activeId);
  const thread = messages[activeId];
  const modalCustomer = customers.find((c) => c.id === modalCustomerId);

  function addMessage(customerId, msg) {
    setMessages({
      ...messages,
      [customerId]: [...messages[customerId], { id: Date.now(), from: 'out', time: 'Just now', ...msg }],
    });
  }

  function openModal() {
    setModalCustomerId(activeId);
    setShowModal(true);
  }

  function sendReview() {
    addMessage(modalCustomerId, { review: true, text: buildMessage(modalCustomer) });
    setActiveId(modalCustomerId);
    setShowModal(false);
    setToast(`Review request sent to ${modalCustomer.name} ✓`);
  }

  function sendManual(e) {
    e.preventDefault();
    if (input.trim() === '') return;
    addMessage(activeId, { text: input.trim() });
    setInput('');
  }

  function lastPreview(c) {
    const list = messages[c.id];
    if (list.length === 0) return 'No messages yet';
    const last = list[list.length - 1];
    return (last.stars ? '⭐⭐⭐⭐⭐ ' : '') + last.text;
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link to="/inbox" className="mb-3 inline-block text-sm text-dim hover:text-ink">
        ← Back to inbox
      </Link>

      <div className="grid overflow-hidden rounded-lg border border-line bg-white md:grid-cols-[300px_1fr]">
        {/* Left: customers */}
        <div className="border-b border-line md:border-b-0 md:border-r">
          {customers.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`flex w-full items-center gap-3 border-b border-line p-3 text-left ${
                c.id === activeId ? 'bg-primary-subtle' : 'hover:bg-surface-2'
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-white">
                {c.initials}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-secondary">{c.name}</div>
                <div className="truncate text-xs text-dim">{lastPreview(c)}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Right: chat */}
        <div className="flex h-[560px] flex-col">
          <div className="flex items-center gap-3 border-b border-line p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-white">
              {active.initials}
            </div>
            <div>
              <div className="font-semibold text-secondary">{active.name}</div>
              <div className="text-xs text-dim">{active.phone}</div>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2 overflow-y-auto bg-wa-bg p-4">
            <div className="self-center rounded bg-white/80 px-3 py-1 text-xs text-dim">
              Job {active.jobId} marked complete
            </div>
            {thread.length === 0 && (
              <p className="mt-6 text-center text-sm text-dim">
                No messages yet. Send a review request to start.
              </p>
            )}
            {thread.map((m) => (
              <Bubble key={m.id} m={m} />
            ))}
          </div>

          <div className="border-t border-line p-2">
            <button
              onClick={openModal}
              className="mb-2 flex items-center gap-1 rounded-full border border-line-strong px-3 py-1.5 text-xs font-semibold text-secondary hover:bg-surface-2"
            >
              <Star size={14} /> Send another review request
            </button>
            <form onSubmit={sendManual} className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message…"
                className="h-11 flex-1 rounded-lg border border-line px-3 focus:border-info focus:outline-none focus:ring-2 focus:ring-info/15"
              />
              <button
                type="submit"
                aria-label="Send"
                className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-white hover:bg-primary-hover"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Send review request popup */}
      {showModal && (
        <Modal title="Send review request" onClose={() => setShowModal(false)}>
          <label className="mb-2 block text-xs font-semibold text-dim">Customer</label>
          <select
            value={modalCustomerId}
            onChange={(e) => setModalCustomerId(Number(e.target.value))}
            className="mb-4 h-11 w-full rounded-lg border border-line bg-white px-3 focus:border-info focus:outline-none"
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.job} (completed)
              </option>
            ))}
          </select>

          <label className="mb-2 block text-xs font-semibold text-dim">Message preview</label>
          <div className="rounded-lg bg-wa-bg p-3">
            <div className="rounded-lg bg-wa-out px-3 py-2 text-sm text-ink shadow-sm">
              {buildMessage(modalCustomer)}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-line pt-4">
            <button
              onClick={() => setShowModal(false)}
              className="h-11 rounded-lg border-[1.5px] border-line-strong bg-white px-5 font-semibold text-ink hover:bg-surface-2"
            >
              Cancel
            </button>
            <button
              onClick={sendReview}
              className="h-11 rounded-lg bg-primary px-5 font-semibold text-white hover:bg-primary-hover"
            >
              Send request
            </button>
          </div>
        </Modal>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-success px-4 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

export default ReviewRequest;