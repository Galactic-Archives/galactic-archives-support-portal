// src/pages/StaffDashboard.jsx
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import '../Dashboard.css'
import { kbApi, ticketsApi, docsApi } from '../utils/api'
import { useAuth } from '../context/AuthContext'

function StaffKB() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const res = await kbApi.list()
        if (!cancelled) setArticles(res.data)
      } catch (err) {
        if (!cancelled) setError('Failed to load knowledge base')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="dashboard-section">
      <h2>Knowledge Base Management</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <ul>
          {articles.map(a => (
            <li key={a.id}>{a.title}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

function StaffTickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const res = await ticketsApi.list()
        if (!cancelled) setTickets(res.data)
      } catch (err) {
        if (!cancelled) setError('Failed to load tickets')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="dashboard-section">
      <h2>Support Tickets</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <ul>
          {tickets.map(t => (
            <li key={t.id}>
              {t.title} - {t.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function StaffDocs() {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const res = await docsApi.list()
        if (!cancelled) setDocs(res.data)
      } catch (err) {
        if (!cancelled) setError('Failed to load documentation')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="dashboard-section">
      <h2>Documentation</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <ul>
          {docs.map(d => (
            <li key={d.id}>{d.title}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function StaffDashboard() {
  const location = useLocation()
  const { user, logout } = useAuth()

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1>Staff Dashboard</h1>
        <div>
          <p>Welcome, {user?.email}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <aside className="dashboard-sidebar">
          <Link to="/staff-dashboard/kb" className={location.pathname.includes('kb') ? 'active' : ''}>
            Knowledge Base
          </Link>
          <Link to="/staff-dashboard/tickets" className={location.pathname.includes('tickets') ? 'active' : ''}>
            Support Tickets
          </Link>
          <Link to="/staff-dashboard/docs" className={location.pathname.includes('docs') ? 'active' : ''}>
            Documentation
          </Link>
        </aside>

        <main className="dashboard-main">
          <Routes>
            <Route path="kb" element={<StaffKB />} />
            <Route path="tickets" element={<StaffTickets />} />
            <Route path="docs" element={<StaffDocs />} />
            <Route path="" element={<StaffKB />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
