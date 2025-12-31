import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  signup: (username, email, password, confirmPassword) =>
    api.post('/signup/', { username, email, password, confirm_password: confirmPassword }),
  signin: (username, password) =>
    api.post('/signin/', { username, password }),
  getUserInfo: () =>
    api.get('/user-info/'),
}

export const songsAPI = {
  list: () => api.get('/songs/'),
  get: (id) => api.get(`/songs/${id}/`),
  create: (data) => api.post('/songs/', data),
  update: (id, data) => api.put(`/songs/${id}/`, data),
  delete: (id) => api.delete(`/songs/${id}/`),
}

export const artistsAPI = {
  list: () => api.get('/artists/'),
  get: (id) => api.get(`/artists/${id}/`),
  create: (data) => api.post('/artists/', data),
  update: (id, data) => api.put(`/artists/${id}/`, data),
  delete: (id) => api.delete(`/artists/${id}/`),
}

export const albumsAPI = {
  list: () => api.get('/albums/'),
  get: (id) => api.get(`/albums/${id}/`),
  create: (data) => api.post('/albums/', data),
  update: (id, data) => api.put(`/albums/${id}/`, data),
  delete: (id) => api.delete(`/albums/${id}/`),
}

export const playlistsAPI = {
  list: () => api.get('/playlists/'),
  get: (id) => api.get(`/playlists/${id}/`),
  create: (data) => api.post('/playlists/', data),
  update: (id, data) => api.put(`/playlists/${id}/`, data),
  delete: (id) => api.delete(`/playlists/${id}/`),
  addSong: (playlistId, songId) =>
    api.post(`/playlists/${playlistId}/add_song/`, { song_id: songId }),
  removeSong: (playlistId, songId) =>
    api.post(`/playlists/${playlistId}/remove_song/`, { song_id: songId }),
}

export default api
