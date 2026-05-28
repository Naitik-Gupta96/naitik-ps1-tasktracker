import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { resetPassword } from '../api/auth'
import { getApiErrorMessage } from '../utils/apiError'


function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const [form, setForm] = useState({ new_password: '', confirm_password: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setError('')

    if (!token) {
      setError('Reset link is missing or invalid.')
      return
    }

    if (form.new_password !== form.confirm_password) {
      setError('New passwords do not match.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await resetPassword({ token, new_password: form.new_password })
      setMessage(response.message)
      setForm({ new_password: '', confirm_password: '' })
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to reset the password.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div className="auth-copy">
          <p className="section-tag">Choose a new password</p>
          <h1>Set a fresh password</h1>
          <p>Use a password you have not used elsewhere and keep it at least eight characters long.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>New password</span>
            <input
              name="new_password"
              type="password"
              value={form.new_password}
              onChange={handleChange}
              minLength="8"
              required
            />
          </label>

          <label>
            <span>Confirm new password</span>
            <input
              name="confirm_password"
              type="password"
              value={form.confirm_password}
              onChange={handleChange}
              minLength="8"
              required
            />
          </label>

          {error ? <p className="inline-error">{error}</p> : null}
          {message ? <p className="inline-success">{message}</p> : null}

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Resetting...' : 'Reset password'}
          </button>

          <p className="auth-switch">
            Back to
            {' '}
            <Link to="/login">login</Link>
          </p>
        </form>
      </section>
    </main>
  )
}


export default ResetPasswordPage
