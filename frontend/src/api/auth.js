import api from './client'

export async function registerUser(payload) {
  const response = await api.post('/auth/register', payload)
  return response.data
}

export async function loginUser(payload) {
  const response = await api.post('/auth/login', payload)
  return response.data
}


export async function loginWithGoogle(credential) {
  const response = await api.post('/auth/google/login', { credential })
  return response.data
}


export async function registerWithGoogle(credential) {
  const response = await api.post('/auth/google/register', { credential })
  return response.data
}


export async function requestPasswordReset(payload) {
  const response = await api.post('/auth/forgot-password', payload)
  return response.data
}


export async function resetPassword(payload) {
  const response = await api.post('/auth/reset-password', payload)
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
