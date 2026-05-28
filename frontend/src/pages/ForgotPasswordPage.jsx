import { useState } from 'react'
import { Link } from 'react-router-dom'

import { requestPasswordReset } from '../api/auth'
import { getApiErrorMessage } from '../utils/apiError'


function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setError('')
    setIsSubmitting(true)

    try {
      const response = await requestPasswordReset({ email })
      setMessage(response.message)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to send a reset link right now.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div className="auth-copy">
          <p className="section-tag">Password reset</p>
          <h1>Reset your password</h1>
          <p>Enter the email you used for TaskFlow and we will send a reset link if the account exists.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>

          {error ? <p className="inline-error">{error}</p> : null}
          {message ? <p className="inline-success">{message}</p> : null}

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending link...' : 'Send reset link'}
          </button>

          <p className="auth-switch">
            Remembered it?
            {' '}
            <Link to="/login">Back to login</Link>
          </p>
        </form>
      </section>
    </main>
  )
}


export default ForgotPasswordPage
