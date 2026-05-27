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

  return (
    <article className="task-card">
      <div className="task-card-top">
        <div>
          <span className={`pill pill-${task.priority}`}>{task.priority.replace('_', ' ')}</span>
          <span className={`pill pill-status-${task.status}`}>{task.status.replace('_', ' ')}</span>
        </div>
        <button type="button" className="text-button" onClick={() => onEdit(task)}>
          Edit
        </button>
      </div>

      <h3>{task.title}</h3>
      <p>{task.description || 'No description added yet.'}</p>

      <div className="task-card-bottom">
        <span>{formatDueDate(task.due_date)}</span>
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
