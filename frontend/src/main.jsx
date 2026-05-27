import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { fetchCurrentUser } from './api/auth'
import { router } from './App'
import './index.css'
import { useAuthStore } from './store/authStore'
import { useTaskStore } from './store/taskStore'

function AppBootstrap() {
  const hydrate = useAuthStore((state) => state.hydrate)
  const logout = useAuthStore((state) => state.logout)
  const setUser = useAuthStore((state) => state.setUser)
  const isReady = useAuthStore((state) => state.isReady)
  const token = useAuthStore((state) => state.token)
  const resetTasks = useTaskStore((state) => state.reset)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    async function syncUser() {
      if (!token) {
        resetTasks()
        return
      }

      try {
        const user = await fetchCurrentUser()
        setUser(user)
      } catch {
        logout()
      }
    }

    if (isReady) {
      syncUser()
    }
  }, [isReady, logout, resetTasks, setUser, token])

  return <RouterProvider router={router} />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppBootstrap />
  </StrictMode>,
)
