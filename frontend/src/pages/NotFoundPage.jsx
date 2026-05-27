import { Link } from 'react-router-dom'

import { useAuthStore } from '../store/authStore'

function NotFoundPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <main className="not-found-shell">
      <p className="section-tag">404</p>
      <h1>Page not found</h1>
      <p>This page does not exist or has been moved.</p>
      <Link className="primary-button" to={isAuthenticated ? '/dashboard' : '/'}>
        {isAuthenticated ? 'Go to dashboard' : 'Go home'}
      </Link>
    </main>
  )
}

export default NotFoundPage
