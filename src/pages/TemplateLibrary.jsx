import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { initialTemplates } from '../data/templates';
import TemplateCard from '../components/TemplateCard';
import TemplateForm from '../components/TemplateForm';
import Modal from '../components/Modal';

function TemplateLibrary() {
  const [templates, setTemplates] = useState(initialTemplates);
  const [modal, setModal] = useState(null); // { type: 'new' | 'edit' | 'view' | 'delete', template }
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', text }

  // Toast 3 second baad khud ghayab
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  function closeModal() {
    setModal(null);
  }

  function handleCreate(data) {
    setTemplates([...templates, { id: Date.now(), status: 'pending', ...data }]);
    closeModal();
    setToast({ type: 'success', text: 'Template submitted for WhatsApp approval ✓' });
  }

  function handleEdit(data) {
    setTemplates(
      templates.map((t) => (t.id === modal.template.id ? { ...t, ...data } : t))
    );
    closeModal();
    setToast({ type: 'success', text: 'Template updated, resubmitted for approval ✓' });
  }

  function handleDelete() {
    setTemplates(templates.filter((t) => t.id !== modal.template.id));
    closeModal();
    setToast({ type: 'error', text: 'Template deleted' });
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            to="/inbox"
            className="mb-2 inline-block text-sm text-dim hover:text-ink"
          >
            ← Back to inbox
          </Link>
          <h1 className="text-[22px] font-bold text-secondary">Template library</h1>
          <p className="mt-0.5 text-xs text-dim">
            {templates.length} templates · WhatsApp Business API approval required for each
          </p>
        </div>
        <button
          onClick={() => setModal({ type: 'new' })}
          className="flex h-11 items-center gap-2 rounded-lg bg-primary px-5 font-semibold text-white hover:bg-primary-hover"
        >
          <Plus size={18} /> New template
        </button>
      </div>

      {templates.length === 0 ? (
        <p className="rounded-lg border border-line bg-white p-6 text-center text-muted">
          No templates yet. Click "New template" to create one.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {templates.map((t) => (
            <TemplateCard
              key={t.id}
              template={t}
              onView={(template) => setModal({ type: 'view', template })}
              onEdit={(template) => setModal({ type: 'edit', template })}
              onDelete={(template) => setModal({ type: 'delete', template })}
            />
          ))}
        </div>
      )}

      {/* Popups */}
      {modal?.type === 'new' && (
        <Modal title="New template" wide onClose={closeModal}>
          <TemplateForm mode="new" onSave={handleCreate} onCancel={closeModal} />
        </Modal>
      )}

      {modal?.type === 'edit' && (
        <Modal title="Edit template" wide onClose={closeModal}>
          <TemplateForm
            mode="edit"
            initial={modal.template}
            onSave={handleEdit}
            onCancel={closeModal}
          />
        </Modal>
      )}

      {modal?.type === 'view' && (
        <Modal title="Template approval status" onClose={closeModal}>
          <div className="flex flex-col gap-2 text-xs text-dim">
            <div><strong className="text-ink">Template:</strong> {modal.template.name}</div>
            <div><strong className="text-ink">WhatsApp category:</strong> {modal.template.category}</div>
            <div>
              <strong className="text-ink">Status:</strong>{' '}
              {modal.template.status === 'approved' ? 'Approved' : 'Pending approval'}
            </div>
            <div className="mt-2 rounded bg-surface-2 p-3">"{modal.template.body}"</div>
          </div>
          <div className="mt-6 flex justify-end border-t border-line pt-4">
            <button
              onClick={closeModal}
              className="h-11 rounded-lg border-[1.5px] border-line-strong bg-white px-5 font-semibold text-ink hover:bg-surface-2"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {modal?.type === 'delete' && (
        <Modal title="Delete this template?" onClose={closeModal}>
          <p className="text-sm text-dim">
            "{modal.template.name}" is still pending WhatsApp approval and isn't used in
            any active automation, so it's safe to remove.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={closeModal}
              className="h-11 rounded-lg border-[1.5px] border-line-strong bg-white px-5 font-semibold text-ink hover:bg-surface-2"
            >
              Keep template
            </button>
            <button
              onClick={handleDelete}
              className="h-11 rounded-lg bg-danger px-5 font-semibold text-white hover:opacity-90"
            >
              Delete template
            </button>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-lg px-4 py-3 text-sm text-white shadow-lg ${
            toast.type === 'error' ? 'bg-danger' : 'bg-success'
          }`}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}

export default TemplateLibrary;