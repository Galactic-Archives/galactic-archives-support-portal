import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Navigation.css'

export default function Navigation() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="navbar-brand">
          🚀 Galactic Archives
        </Link>
        <div className="nav-right">
          <span className="nav-user">{user?.display_name}</span>
          <span className="nav-role">{user?.role}</span>
          <button className="btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
