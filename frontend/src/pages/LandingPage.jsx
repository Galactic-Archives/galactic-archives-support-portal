import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Pages.css'

export default function LandingPage() {
  const { user } = useAuth()

  return (
    <div className="landing-page">
      <div className="container">
        <div className="hero">
          <h1>Galactic Archives Support Portal</h1>
          <p className="hero-subtitle">
            Command center for documentation, tickets, and mission control.
          </p>

          {!user ? (
            <div className="hero-actions">
              <Link to="/login" className="btn btn-primary">
                Log In
              </Link>
              <Link to="/register" className="btn btn-secondary">
                Register
              </Link>
            </div>
          ) : (
            <div className="hero-actions">
              <Link
                to={user.role === 'student' ? '/student' : '/staff'}
                className="btn btn-primary"
              >
                Continue
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
