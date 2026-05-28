function formatDueDate(value) {
  if (!value) {
    return 'No due date'
  }

  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function TaskCard({ task, onEdit, onStatusChange, onDelete }) {
  const nextStatus = task.status === 'done' ? 'in_progress' : 'done'
  const nextLabel = task.status === 'done' ? 'Move to in progress' : 'Mark done'
  const hasDueDate = Boolean(task.due_date)

  return (
    <article className="task-card">
      <div className="task-card-top">
        <div className="task-card-badges">
          <span className={`pill pill-${task.priority}`}>{task.priority.replace('_', ' ')}</span>
          <span className={`pill pill-status-${task.status}`}>{task.status.replace('_', ' ')}</span>
        </div>
        <button type="button" className="text-button" onClick={() => onEdit(task)}>
          Edit
        </button>
      </div>

      <h3>{task.title}</h3>
      <p>{task.description || 'No description added yet.'}</p>

      <div className="task-card-meta">
        <div className="task-meta-item">
          <span className="task-meta-label">Due</span>
          <strong className={hasDueDate ? '' : 'task-meta-muted'}>{formatDueDate(task.due_date)}</strong>
        </div>
        <div className="task-meta-item">
          <span className="task-meta-label">Last state</span>
          <strong>{task.status === 'in_progress' ? 'In progress' : task.status.replace('_', ' ')}</strong>
        </div>
      </div>

      <div className="task-card-bottom">
        <span className="task-card-footnote">Created from your personal workspace</span>
        <div className="task-actions">
          <button type="button" className="ghost-button" onClick={() => onStatusChange(task, nextStatus)}>
            {nextLabel}
          </button>
          <button type="button" className="danger-button" onClick={() => onDelete(task.id)}>
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}

export default TaskCard
