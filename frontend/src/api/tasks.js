import api from './client'

function compactParams(params) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value !== null && value !== undefined),
  )
}

export async function getTasks(params) {
  const response = await api.get('/tasks', { params: compactParams(params) })
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
