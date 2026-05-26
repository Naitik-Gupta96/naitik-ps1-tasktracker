function TaskList({ tasks, isLoading }) {
  if (isLoading) {
    return (
      <section className="task-section">
        <div className="section-heading">
          <p className="section-kicker">Task board</p>
          <h2>Tasks</h2>
        </div>
        <p>Loading tasks...</p>
      </section>
    )
  }

  return (
    <section className="task-section">
      <div className="section-heading">
        <p className="section-kicker">Task board</p>
        <h2>Tasks</h2>
      </div>

      {tasks.length === 0 ? (
        <p className="empty-state">No tasks yet. Add the first one from the form.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className="task-item">
              <div className="task-row">
                <h3>{task.title}</h3>
                <span className={`priority-chip priority-${task.priority}`}>{task.priority}</span>
              </div>
              {task.description ? <p>{task.description}</p> : null}
              <div className="task-meta">
                <span className={`status-chip status-${task.status}`}>{task.status}</span>
                <span>Created: {new Date(task.created_at).toLocaleString()}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default TaskList
