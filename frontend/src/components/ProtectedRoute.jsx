import { Navigate } from 'react-router-dom'

import { useAuthStore } from '../store/authStore'

function ProtectedRoute({ children }) {
  const { isAuthenticated, isReady } = useAuthStore()

  if (!isReady) {
    return <div className="screen-loader">Checking your workspace...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
