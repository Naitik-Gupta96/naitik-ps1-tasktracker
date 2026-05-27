import api from './client'

export async function getStats() {
  const response = await api.get('/stats')
  return response.data
}
