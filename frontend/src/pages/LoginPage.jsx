import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { loginUser } from '../api/auth'
import { useAuthStore } from '../store/authStore'

function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const data = await loginUser(form)
      login(data.access_token, data.user)
      navigate('/dashboard')
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Unable to log you in.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div className="auth-copy">
          <p className="section-tag">Personal Task Tracker</p>
          <h1>Welcome back</h1>
          <p>Log in to your task dashboard and continue where you left off.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>

          <label>
            <span>Password</span>
            <input name="password" type="password" value={form.password} onChange={handleChange} required />
          </label>

          {error ? <p className="inline-error">{error}</p> : null}

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </button>

          <p className="auth-switch">
            Need an account?
            {' '}
            <Link to="/register">Create one</Link>
          </p>
        </form>
      </section>
    </main>
  )
}

export default LoginPage
