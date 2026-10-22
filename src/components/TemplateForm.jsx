import { useState } from 'react';

function TemplateForm({ mode, initial, onSave, onCancel }) {
  const isEdit = mode === 'edit';
  const [name, setName] = useState(initial?.name ?? '');
  const [category, setCategory] = useState(initial?.category ?? 'Utility');
  const [body, setBody] = useState(initial?.body ?? '');
  const [errors, setErrors] = useState({});

  function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};
    if (!isEdit && name.trim() === '') newErrors.name = 'Template name is required';
    if (body.trim() === '') newErrors.body = 'Message body is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSave(
      isEdit
        ? { body: body.trim() }
        : { name: name.trim(), category, body: body.trim() }
    );
  }

  const inputBase =
    'w-full rounded-lg border bg-white px-3 focus:border-info focus:outline-none focus:ring-2 focus:ring-info/15';

  return (
    <form onSubmit={handleSubmit}>
      {isEdit ? (
        <p className="mb-4 text-sm text-dim">
          Template: <strong className="text-secondary">{initial.name}</strong>
        </p>
      ) : (
        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold text-dim">
              Template name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Job Follow-up — 1 Week"
              className={`${inputBase} h-11 ${errors.name ? 'border-danger' : 'border-line'}`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-danger">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold text-dim">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`${inputBase} h-11 border-line`}
            >
              <option>Utility</option>
              <option>Marketing</option>
              <option>Authentication</option>
            </select>
          </div>
        </div>
      )}

      <div>
        <label className="mb-2 block text-xs font-semibold text-dim">
          Message body
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Hi {{customer_name}}, just checking in about the {{job_type}}."
          className={`${inputBase} min-h-24 py-2 ${errors.body ? 'border-danger' : 'border-line'}`}
        />
        {errors.body && <p className="mt-1 text-xs text-danger">{errors.body}</p>}
        <p className="mt-1 text-[10px] text-muted">
          {isEdit
            ? 'Editing an approved template resubmits it for WhatsApp review. It keeps using the current approved version until the new one is approved.'
            : <>Use {'{{variable_name}}'} for placeholders. New templates require WhatsApp Business API approval before use, which can take up to 24 hours.</>}
        </p>
      </div>

      <div className="mt-6 flex justify-end gap-3 border-t border-line pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="h-11 rounded-lg border-[1.5px] border-line-strong bg-white px-5 font-semibold text-ink hover:bg-surface-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="h-11 rounded-lg bg-primary px-5 font-semibold text-white hover:bg-primary-hover"
        >
          {isEdit ? 'Save & resubmit' : 'Submit for approval'}
        </button>
      </div>
    </form>
  );
}

export default TemplateForm;