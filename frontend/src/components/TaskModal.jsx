import { useEffect, useState } from 'react'

const emptyForm = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  due_date: '',
}

function TaskModal({ isOpen, task, onClose, onSubmit, isSaving }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setError('')
    if (task) {
      setForm({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        due_date: task.due_date || '',
      })
    } else {
      setForm(emptyForm)
    }
  }, [isOpen, task])

  if (!isOpen) {
    return null
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!form.title.trim()) {
      setError('Title is required.')
      return
    }

    const result = await onSubmit({
      title: form.title.trim(),
      description: form.description.trim() || null,
      status: form.status,
      priority: form.priority,
      due_date: form.due_date || null,
    })

    if (!result.ok) {
      setError(result.message || 'Unable to save the task.')
      return
    }

    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="section-tag">{task ? 'Edit task' : 'New task'}</p>
            <h2>{task ? 'Update task details' : 'Capture the next priority'}</h2>
          </div>
          <button type="button" className="ghost-button" onClick={onClose}>
            Close
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            <span>Title</span>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Prepare API verification checklist"
              disabled={isSaving}
            />
          </label>

          <label>
            <span>Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              placeholder="Add the details you do not want to lose."
              disabled={isSaving}
            />
          </label>

          <div className="modal-grid">
            <label>
              <span>Status</span>
              <select name="status" value={form.status} onChange={handleChange} disabled={isSaving}>
                <option value="todo">Todo</option>
                <option value="in_progress">In progress</option>
                <option value="done">Done</option>
                <option value="archived">Archived</option>
              </select>
            </label>

            <label>
              <span>Priority</span>
              <select name="priority" value={form.priority} onChange={handleChange} disabled={isSaving}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </label>

            <label>
              <span>Due date</span>
              <input name="due_date" type="date" value={form.due_date} onChange={handleChange} disabled={isSaving} />
            </label>
          </div>

          {error ? <p className="inline-error">{error}</p> : null}

          <div className="modal-actions">
            <button type="button" className="ghost-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={isSaving}>
              {isSaving ? 'Saving...' : task ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskModal
