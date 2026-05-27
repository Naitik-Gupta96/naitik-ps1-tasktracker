import api from './client'

export async function getTasks(params) {
  const response = await api.get('/tasks', { params })
  return response.data
}

export async function createTask(payload) {
  const response = await api.post('/tasks', payload)
  return response.data
}

export async function patchTask(taskId, payload) {
  const response = await api.patch(`/tasks/${taskId}`, payload)
  return response.data
}

export async function deleteTask(taskId) {
  await api.delete(`/tasks/${taskId}`)
}
