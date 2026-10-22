import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { initialRules, activeChases } from '../data/chase';
import Modal from '../components/Modal';
import ToggleSwitch from '../components/ToggleSwitch';

function PaymentChase() {
  const { invoiceId } = useParams();
  const [rules, setRules] = useState(initialRules);
  const [editing, setEditing] = useState(null); // rule jo edit ho raha hai
  const [draft, setDraft] = useState('');
  const [pausing, setPausing] = useState(null); // invoice jo pause ho raha hai
  const [paused, setPaused] = useState([]); // paused invoice ids
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  function toggleRule(id) {
    setRules(rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  }

  function openEdit(rule) {
    setEditing(rule);
    setDraft(rule.message);
  }

  function saveEdit() {
    if (draft.trim() === '') return;
    setRules(rules.map((r) => (r.id === editing.id ? { ...r, message: draft.trim() } : r)));
    setEditing(null);
    setToast({ type: 'success', text: `${editing.day} message updated ✓` });
  }

  function confirmPause() {
    setPaused([...paused, pausing.id]);
    setToast({ type: 'success', text: `Chase sequence paused for ${pausing.id} ✓` });
    setPausing(null);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <Link to="/inbox" className="mb-2 inline-block text-sm text-dim hover:text-ink">
          ← Back to inbox
        </Link>
        <h1 className="text-[22px] font-bold text-secondary">Payment chase sequence</h1>
        <p className="mt-0.5 text-xs text-dim">
          Automation rules applied to every unpaid invoice
        </p>
      </div>

      {/* 3 rule cards */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {rules.map((r) => (
          <div
            key={r.id}
            className={`rounded-lg border border-line bg-white p-4 ${
              r.enabled ? '' : 'opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="text-lg font-bold text-secondary">{r.day}</div>
              <ToggleSwitch
                on={r.enabled}
                onChange={() => toggleRule(r.id)}
                label={`${r.day} rule`}
              />
            </div>
            <div className="mb-1 text-sm font-semibold text-primary">{r.tone}</div>
            <p className="mb-3 text-xs text-dim">{r.desc}</p>
            <button
              onClick={() => openEdit(r)}
              className="rounded-lg px-3 py-2 text-sm text-dim hover:bg-surface-2"
            >
              Edit message
            </button>
          </div>
        ))}
      </div>

      {/* Currently active */}
      <div className="rounded-lg border border-line bg-white p-4">
        <h2 className="mb-3 text-[15px] font-semibold text-secondary">
          Currently active ({activeChases.length})
        </h2>
        {activeChases.map((c) => {
          const isPaused = paused.includes(c.id);
          return (
            <div
              key={c.id}
              className={`flex flex-wrap items-center justify-between gap-3 border-t border-line py-3 first:border-t-0 ${
                c.id === invoiceId ? 'bg-primary-subtle -mx-2 px-2 rounded' : ''
              }`}
            >
              <div>
                <div className="font-semibold text-secondary">
                  {c.customer} — {c.id}
                </div>
                <div className="text-[10px] text-dim">
                  £{c.amount} · {isPaused ? 'Paused' : c.info}
                </div>
              </div>
              <div className="flex gap-2">
                {!isPaused && (
                  <button
                    onClick={() => setPausing(c)}
                    className="h-9 rounded-lg px-3 text-sm text-dim hover:bg-surface-2"
                  >
                    Pause
                  </button>
                )}
                <Link
                  to={`/inbox/invoices/${c.id}`}
                  className="flex h-9 items-center rounded-lg border-[1.5px] border-line-strong px-3 text-sm font-semibold text-ink hover:bg-surface-2"
                >
                  View thread
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit message popup */}
      {editing && (
        <Modal title={`Edit ${editing.day} message`} wide onClose={() => setEditing(null)}>
          <label className="mb-2 block text-xs font-semibold text-dim">Message body</label>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="min-h-28 w-full rounded-lg border border-line px-3 py-2 focus:border-info focus:outline-none focus:ring-2 focus:ring-info/15"
          />
          {draft.trim() === '' && (
            <p className="mt-1 text-xs text-danger">Message cannot be empty</p>
          )}
          <div className="mt-6 flex justify-end gap-3 border-t border-line pt-4">
            <button
              onClick={() => setEditing(null)}
              className="h-11 rounded-lg border-[1.5px] border-line-strong bg-white px-5 font-semibold text-ink hover:bg-surface-2"
            >
              Cancel
            </button>
            <button
              onClick={saveEdit}
              className="h-11 rounded-lg bg-primary px-5 font-semibold text-white hover:bg-primary-hover"
            >
              Save message
            </button>
          </div>
        </Modal>
      )}

      {/* Pause popup */}
      {pausing && (
        <Modal title="Pause chase sequence?" onClose={() => setPausing(null)}>
          <p className="text-sm text-dim">
            Automatic reminders for {pausing.id} will stop until you resume them manually.
            Use this if you're already in direct contact with {pausing.customer} about payment.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setPausing(null)}
              className="h-11 rounded-lg border-[1.5px] border-line-strong bg-white px-5 font-semibold text-ink hover:bg-surface-2"
            >
              Cancel
            </button>
            <button
              onClick={confirmPause}
              className="h-11 rounded-lg bg-primary px-5 font-semibold text-white hover:bg-primary-hover"
            >
              Pause sequence
            </button>
          </div>
        </Modal>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-success px-4 py-3 text-sm text-white shadow-lg">
          {toast.text}
        </div>
      )}
    </div>
  );
}

export default PaymentChase;