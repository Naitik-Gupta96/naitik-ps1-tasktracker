import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import GoogleAuthButton from '../components/GoogleAuthButton'
import { registerUser, registerWithGoogle } from '../api/auth'
import { useAuthStore } from '../store/authStore'
import { getApiErrorMessage } from '../utils/apiError'

function RegisterPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [form, setForm] = useState({ full_name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const data = await registerUser(form)
      login(data.access_token, data.user)
      navigate('/dashboard', { replace: true })
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to create the account.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleGoogleRegister(credential) {
    setError('')
    setIsSubmitting(true)

    try {
      const data = await registerWithGoogle(credential)
      login(data.access_token, data.user)
      navigate('/dashboard', { replace: true })
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to sign up with Google.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div className="auth-copy">
          <p className="section-tag">Personal Task Tracker</p>
          <h1>Create your workspace</h1>
          <p>Set up your account and move straight into the dashboard.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Full name</span>
            <input name="full_name" value={form.full_name} onChange={handleChange} required minLength="2" />
          </label>

          <label>
            <span>Email</span>
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>

          <label>
            <span>Password</span>
            <input name="password" type="password" value={form.password} onChange={handleChange} required minLength="8" />
          </label>

          {error ? <p className="inline-error">{error}</p> : null}

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>

          <div className="auth-divider"><span>or</span></div>
          <GoogleAuthButton onCredential={handleGoogleRegister} onError={setError} text="signup_with" />

          <p className="auth-switch">
            Already have an account?
            {' '}
            <Link to="/login">Log in</Link>
          </p>
        </form>
      </section>
    </main>
  )
}

export default RegisterPage
