import { useEffect, useState } from 'react'
import './App.css'
import { createTask, fetchTasks } from './api'
import AddTaskForm from './components/AddTaskForm'
import TaskList from './components/TaskList'

function App() {
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function loadTasks() {
    try {
      setError('')
      const data = await fetchTasks()
      setTasks(data)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  async function handleCreateTask(payload) {
    try {
      setIsSubmitting(true)
      setError('')
      const createdTask = await createTask(payload)
      setTasks((current) => [createdTask, ...current])
    } catch (requestError) {
      setError(requestError.message)
      throw requestError
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="app">
      <header className="app-header">
        <p className="eyebrow">KVGAI PS-I 2026</p>
        <h1>
          Personal tracker you will
          {' '}
          <span>actually use.</span>
        </h1>
        <p>
          Create tasks, set priority, and keep the core flow clean before we add the
          next round of features.
        </p>
      </header>

      {error ? <p className="error-text">{error}</p> : null}

      <section className="content-grid">
        <AddTaskForm onSubmit={handleCreateTask} isSubmitting={isSubmitting} />
        <TaskList tasks={tasks} isLoading={isLoading} />
      </section>
    </main>
  )
}

export default App
