import { useState } from 'react'

const defaultForm = {
  title: '',
  description: '',
  priority: 'medium',
}

function AddTaskForm({ onSubmit, isSubmitting }) {
  const [form, setForm] = useState(defaultForm)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!form.title.trim()) {
      return
    }

    await onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
    })

    setForm(defaultForm)
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="section-heading">
        <p className="section-kicker">Quick capture</p>
        <h2>Add a task</h2>
      </div>

      <label>
        <span>Title</span>
        <input
          name="title"
          placeholder="Set up the backend routes"
          value={form.title}
          onChange={handleChange}
          disabled={isSubmitting}
          required
        />
      </label>

      <label>
        <span>Description</span>
        <textarea
          name="description"
          placeholder="Optional notes"
          rows="4"
          value={form.description}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </label>

      <label>
        <span>Priority</span>
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          disabled={isSubmitting}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>

      <button className="primary-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Create task'}
      </button>
    </form>
  )
}

export default AddTaskForm
