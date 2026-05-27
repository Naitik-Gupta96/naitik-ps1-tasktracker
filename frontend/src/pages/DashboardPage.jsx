import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'
import { useAuthStore } from '../store/authStore'
import { useTaskStore } from '../store/taskStore'

function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const {
    tasks,
    total,
    isLoading,
    isSaving,
    error,
    stats,
    statsLoading,
    filters,
    setFilters,
    fetchTasks,
    loadStats,
    createTask,
    updateTask,
    removeTask,
  } = useTaskStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  useEffect(() => {
    fetchTasks()
    loadStats()
  }, [fetchTasks, loadStats, filters.status, filters.search])

  function openNewTaskModal() {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  function openEditModal(task) {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  function closeModal() {
    setEditingTask(null)
    setIsModalOpen(false)
  }

  async function handleTaskSubmit(payload) {
    if (editingTask) {
      return updateTask(editingTask.id, payload)
    }
    return createTask(payload)
  }

  async function handleStatusChange(task, nextStatus) {
    await updateTask(task.id, { status: nextStatus })
  }

  async function handleDelete(taskId) {
    await removeTask(taskId)
  }

  return (
    <main className="dashboard-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-mark">TF</span>
          <div>
            <strong>TaskFlow</strong>
            <p>Personal task tracker</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="sidebar-link sidebar-link-active">
            Dashboard
          </Link>
          <Link to="/profile" className="sidebar-link">
            Profile
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div>
            <strong>{user?.full_name}</strong>
            <p>{user?.email}</p>
          </div>
          <button type="button" className="ghost-button" onClick={logout}>
            Log out
          </button>
        </div>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="section-tag">Dashboard</p>
            <h1>Focus on the next task that matters.</h1>
          </div>
          <button type="button" className="primary-button" onClick={openNewTaskModal}>
            New task
          </button>
        </header>

        <section className="stats-grid">
          {statsLoading ? (
            <>
              <div className="stat-card skeleton-card" />
              <div className="stat-card skeleton-card" />
              <div className="stat-card skeleton-card" />
            </>
          ) : (
            <>
              <article className="stat-card">
                <span>Total tasks</span>
                <strong>{stats?.total ?? 0}</strong>
              </article>
              <article className="stat-card">
                <span>Completed</span>
                <strong>{stats?.done ?? 0}</strong>
              </article>
              <article className="stat-card">
                <span>Completion rate</span>
                <strong>{stats?.completion_rate ?? 0}%</strong>
              </article>
            </>
          )}
        </section>

        <section className="toolbar">
          <label className="toolbar-field toolbar-search">
            <span>Search</span>
            <input
              value={filters.search}
              onChange={(event) => setFilters({ search: event.target.value })}
              placeholder="Search by title or description"
            />
          </label>

          <label className="toolbar-field">
            <span>Status</span>
            <select value={filters.status} onChange={(event) => setFilters({ status: event.target.value })}>
              <option value="">All statuses</option>
              <option value="todo">Todo</option>
              <option value="in_progress">In progress</option>
              <option value="done">Done</option>
              <option value="archived">Archived</option>
            </select>
          </label>
        </section>

        {error ? <p className="banner-error">{error}</p> : null}

        <section className="task-panel">
          <div className="panel-heading">
            <div>
              <p className="section-tag">Task list</p>
              <h2>{total} tasks in your workspace</h2>
            </div>
          </div>

          {isLoading ? (
            <div className="task-grid">
              <div className="task-card skeleton-card" />
              <div className="task-card skeleton-card" />
              <div className="task-card skeleton-card" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-panel">
              <h3>No tasks yet</h3>
              <p>Create your first task and the dashboard will start filling out.</p>
              <button type="button" className="primary-button" onClick={openNewTaskModal}>
                Add first task
              </button>
            </div>
          ) : (
            <div className="task-grid">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={openEditModal}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
      </section>

      <TaskModal
        isOpen={isModalOpen}
        task={editingTask}
        onClose={closeModal}
        onSubmit={handleTaskSubmit}
        isSaving={isSaving}
      />
    </main>
  )
}

export default DashboardPage
