    import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      fetchCurrentUser()
    } else {
      delete axios.defaults.headers.common.Authorization
    }
  }, [token])

  async function fetchCurrentUser() {
    try {
      const res = await axios.get(`${apiUrl}/api/v1/auth/me`)
      setUser(res.data)
    } catch {
      logout()
    }
  }

  async function register(email, password, displayName) {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post(`${apiUrl}/api/v1/auth/register`, {
        email,
        password,
        display_name: displayName,
      })
      localStorage.setItem('token', res.data.access_token)
      setToken(res.data.access_token)
      setUser(res.data.user)
      return res.data
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function login(email, password) {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post(`${apiUrl}/api/v1/auth/login`, { email, password })
      localStorage.setItem('token', res.data.access_token)
      setToken(res.data.access_token)
      setUser(res.data.user)
      return res.data
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    delete axios.defaults.headers.common.Authorization
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, error, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
