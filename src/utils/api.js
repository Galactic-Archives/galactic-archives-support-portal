import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: apiUrl,
  headers: { 'Content-Type': 'application/json' },
})

export const kbApi = {
  list: (category, search) => {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    if (search) params.append('search', search)
    const qs = params.toString()
    return api.get(`/api/v1/kb${qs ? `?${qs}` : ''}`)
  },
  get: (slug) => api.get(`/api/v1/kb/${slug}`),
}

export const ticketsApi = {
  create: (data) => api.post('/api/v1/tickets', data),
  list: (status, category) => {
    const params = new URLSearchParams()
    if (status) params.append('status', status)
    if (category) params.append('category', category)
    const qs = params.toString()
    return api.get(`/api/v1/tickets${qs ? `?${qs}` : ''}`)
  },
}

export const docsApi = {
  list: () => api.get('/api/v1/docs'),
  get: (slug) => api.get(`/api/v1/docs/${slug}`),
}

export default api
