import { create } from 'zustand'

const STORAGE_KEY = 'taskflow-auth'

function persistAuthState(token, user) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }))
}

function clearAuthState() {
  window.localStorage.removeItem(STORAGE_KEY)
}

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isReady: false,
  login: (token, user) => {
    persistAuthState(token, user)
    set({ token, user, isAuthenticated: true })
  },
  logout: () => {
    clearAuthState()
    set({ token: null, user: null, isAuthenticated: false })
  },
  setUser: (user) => {
    set((state) => {
      persistAuthState(state.token, user)
      return { user, isAuthenticated: Boolean(state.token) }
    })
  },
  hydrate: () => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) {
        set({ isReady: true })
        return
      }

      const parsed = JSON.parse(raw)
      set({
        token: parsed.token || null,
        user: parsed.user || null,
        isAuthenticated: Boolean(parsed.token),
        isReady: true,
      })
    } catch {
      clearAuthState()
      set({ token: null, user: null, isAuthenticated: false, isReady: true })
    }
  },
}))
