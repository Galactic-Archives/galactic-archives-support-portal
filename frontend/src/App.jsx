import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import StudentDashboard from './pages/StudentDashboard'
import StaffDashboard from './pages/StaffDashboard'
import Navigation from './components/common/Navigation'

function ProtectedRoute({ children, requiredRole }) {
  const { user, token } = useAuth()

  if (!token) return <Navigate to="/login" replace />
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return <Navigate to="/" replace />
  }
  return children
}

export default function App() {
  const { user, token } = useAuth()

  return (
    <>
      {token && <Navigation />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            !token ? (
              <LoginPage />
            ) : (
              <Navigate to={user?.role === 'student' ? '/student' : '/staff'} />
            )
          }
        />
        <Route
          path="/register"
          element={
            !token ? (
              <RegisterPage />
            ) : (
              <Navigate to={user?.role === 'student' ? '/student' : '/staff'} />
            )
          }
        />
        <Route
          path="/student/*"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/*"
          element={
            <ProtectedRoute requiredRole="staff">
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}
