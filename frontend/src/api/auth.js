import api from './client'

export async function registerUser(payload) {
  const response = await api.post('/auth/register', payload)
  return response.data
}

export async function loginUser(payload) {
  const response = await api.post('/auth/login', payload)
  return response.data
}

export async function fetchCurrentUser() {
  const response = await api.get('/auth/me')
  return response.data
}

export async function updateProfile(payload) {
  const response = await api.patch('/users/me', payload)
  return response.data
}

export async function updatePassword(payload) {
  const response = await api.patch('/users/me/password', payload)
  return response.data
}
