const statusStyles = {
  approved: { label: 'Approved', cls: 'bg-success/10 text-success' },
  pending: { label: 'Pending approval', cls: 'bg-gold/15 text-gold' },
};

function TemplateCard({ template, onView, onEdit, onDelete }) {
  const status = statusStyles[template.status];
  const isPending = template.status === 'pending';

  return (
    <div className="rounded-lg border border-line bg-white p-4">
      <div className="mb-1.5 flex items-start justify-between gap-2">
        <span className="font-semibold text-secondary">{template.name}</span>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${status.cls}`}
        >
          {status.label}
        </span>
      </div>

      <p className="mb-2 text-[10px] text-muted">Category: {template.category}</p>

      <p className="mb-2.5 rounded bg-surface-2 px-3 py-2 text-xs text-dim">
        "{template.body}"
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => onView(template)}
          className="rounded-lg px-3 py-1.5 text-sm text-dim hover:bg-surface-2"
        >
          Preview
        </button>
        {isPending ? (
          <button
            onClick={() => onDelete(template)}
            className="rounded-lg px-3 py-1.5 text-sm text-danger hover:bg-danger/10"
          >
            Delete
          </button>
        ) : (
          <button
            onClick={() => onEdit(template)}
            className="rounded-lg px-3 py-1.5 text-sm text-dim hover:bg-surface-2"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

export default TemplateCard;