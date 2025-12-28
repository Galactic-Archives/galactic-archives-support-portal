import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Pages.css'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [localError, setLocalError] = useState('')
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()

  function validate() {
    const nextErrors = {}

    if (!email.trim()) {
      nextErrors.email = 'Email is required'
    } else if (!emailRegex.test(email.trim())) {
      nextErrors.email = 'Enter a valid email address'
    }

    if (!password) {
      nextErrors.password = 'Password is required'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLocalError('')
    if (!validate()) return

    try {
      await login(email.trim(), password)
      navigate('/student')
    } catch {
      setLocalError('Login failed. Check your credentials.')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Mission Initiation</h2>

        {(error || localError) && (
          <div className="auth-error">{error || localError}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Explorer ID (Email)</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Access Code (Password)</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Initiating…' : 'Enter Command Console'}
          </button>
        </form>

        <div className="auth-link">
          New explorer? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  )
}
