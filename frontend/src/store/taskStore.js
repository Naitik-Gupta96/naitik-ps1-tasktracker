import { create } from 'zustand'

import { getStats } from '../api/stats'
import { createTask, deleteTask, getTasks, patchTask } from '../api/tasks'
import { getApiErrorMessage } from '../utils/apiError'

const defaultFilters = {
  status: '',
  search: '',
  sort_by: 'order_index',
  order: 'asc',
  limit: 20,
  offset: 0,
}

export const useTaskStore = create((set, get) => ({
  tasks: [],
  total: 0,
  isLoading: false,
  isSaving: false,
  error: '',
  stats: null,
  statsLoading: false,
  filters: defaultFilters,
  setFilters: (partial) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...partial,
        offset: partial.offset ?? 0,
      },
    })),
  fetchTasks: async () => {
    set({ isLoading: true, error: '' })
    try {
      const data = await getTasks(get().filters)
      set({ tasks: data.items, total: data.total, isLoading: false })
    } catch (error) {
      set({
        isLoading: false,
        error: getApiErrorMessage(error, 'Unable to load tasks right now.'),
      })
    }
  },
  loadStats: async () => {
    set({ statsLoading: true })
    try {
      const stats = await getStats()
      set({ stats, statsLoading: false })
    } catch {
      set({ statsLoading: false })
    }
  },
  createTask: async (payload) => {
    set({ isSaving: true, error: '' })
    try {
      const task = await createTask(payload)
      set((state) => ({
        tasks: [task, ...state.tasks],
        total: state.total + 1,
        isSaving: false,
      }))
      await get().loadStats()
      return { ok: true }
    } catch (error) {
      const message = getApiErrorMessage(error, 'Unable to create the task.')
      set({
        isSaving: false,
        error: message,
      })
      return { ok: false, message }
    }
  },
  updateTask: async (taskId, payload) => {
    set({ isSaving: true, error: '' })
    try {
      const task = await patchTask(taskId, payload)
      set((state) => ({
        tasks: state.tasks.map((item) => (item.id === taskId ? task : item)),
        isSaving: false,
      }))
      await get().loadStats()
      return { ok: true }
    } catch (error) {
      const message = getApiErrorMessage(error, 'Unable to update the task.')
      set({
        isSaving: false,
        error: message,
      })
      return { ok: false, message }
    }
  },
  removeTask: async (taskId) => {
    set({ isSaving: true, error: '' })
    try {
      await deleteTask(taskId)
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId),
        total: Math.max(state.total - 1, 0),
        isSaving: false,
      }))
      await get().loadStats()
      return { ok: true }
    } catch (error) {
      const message = getApiErrorMessage(error, 'Unable to delete the task.')
      set({
        isSaving: false,
        error: message,
      })
      return { ok: false, message }
    }
  },
  reset: () => set({ tasks: [], total: 0, error: '', stats: null, filters: defaultFilters }),
}))
