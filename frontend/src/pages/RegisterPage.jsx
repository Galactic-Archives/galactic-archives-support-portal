import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Pages.css'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD = 6

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [localError, setLocalError] = useState('')
  const { register, loading, error } = useAuth()
  const navigate = useNavigate()

  function validate() {
    const nextErrors = {}

    if (!displayName.trim()) {
      nextErrors.displayName = 'Name is required'
    }

    if (!email.trim()) {
      nextErrors.email = 'Email is required'
    } else if (!emailRegex.test(email.trim())) {
      nextErrors.email = 'Enter a valid email address'
    }

    if (!password) {
      nextErrors.password = 'Password is required'
    } else if (password.length < MIN_PASSWORD) {
      nextErrors.password = `Password must be at least ${MIN_PASSWORD} characters`
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password'
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLocalError('')
    if (!validate()) return

    try {
      await register(email.trim(), password, displayName.trim())
      navigate('/student')
    } catch {
      setLocalError('Registration failed. Try a different email.')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Begin Your Expedition</h2>

        {(error || localError) && (
          <div className="auth-error">{error || localError}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="displayName">Exploration Name</label>
            <input
              id="displayName"
              type="text"
              autoComplete="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
            />
            {errors.displayName && (
              <p className="field-error">{errors.displayName}</p>
            )}
          </div>

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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Access Code</label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="field-error">{errors.confirmPassword}</p>
            )}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Registering…' : 'Begin Exploration'}
          </button>
        </form>

        <div className="auth-link">
          Already an explorer? <Link to="/login">Log in here</Link>
        </div>
      </div>
    </div>
  )
}
