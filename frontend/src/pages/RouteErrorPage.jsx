import { Link, useRouteError } from 'react-router-dom'

import { useAuthStore } from '../store/authStore'

function RouteErrorPage() {
  const error = useRouteError()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  let message = 'Something went wrong while loading this screen.'
  if (error && typeof error === 'object') {
    if ('statusText' in error && error.statusText) {
      message = error.statusText
    } else if ('message' in error && error.message) {
      message = error.message
    }
  }

  return (
    <main className="not-found-shell">
      <p className="section-tag">Application Error</p>
      <h1>Something went wrong</h1>
      <p>{message}</p>
      <div className="hero-actions">
        <button type="button" className="ghost-button" onClick={() => window.location.reload()}>
          Reload
        </button>
        <Link className="primary-button" to={isAuthenticated ? '/dashboard' : '/'}>
          {isAuthenticated ? 'Go to dashboard' : 'Go home'}
        </Link>
      </div>
    </main>
  )
}

export default RouteErrorPage
