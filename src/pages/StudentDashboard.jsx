// src/pages/StudentDashboard.jsx
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import './Dashboard.css
  'import { kbApi, docsApi, ticketsApi } from '../utils/api'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

function KBView() {
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

  if (loading) return <p>Loading knowledge base...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h2>📚 Knowledge Base</h2>
      <ul>
        {articles.map(a => (
          <li key={a.id}>{a.title}</li>
        ))}
      </ul>
    </div>
  )
}

function DocsView() {
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

  if (loading) return <p>Loading documentation...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h2>📖 Documentation</h2>
      <ul>
        {docs.map(d => (
          <li key={d.id}>{d.title}</li>
        ))}
      </ul>
    </div>
  )
}

function TicketsView() {
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

  if (loading) return <p>Loading tickets...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h2>🎫 My Support Tickets</h2>
      <ul>
        {tickets.map(t => (
          <li key={t.id}>
            {t.title} - {t.status}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function StudentDashboard() {
  const location = useLocation()
  const { user, logout } = useAuth()

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1>Student Dashboard</h1>
        <div>
          <p>Welcome, {user?.email}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <aside className="dashboard-sidebar">
          <Link to="/student-dashboard/kb" className={location.pathname.includes('kb') ? 'active' : ''}>
            Knowledge Base
          </Link>
          <Link to="/student-dashboard/docs" className={location.pathname.includes('docs') ? 'active' : ''}>
            Documentation
          </Link>
          <Link to="/student-dashboard/tickets" className={location.pathname.includes('tickets') ? 'active' : ''}>
            My Tickets
          </Link>
        </aside>

        <main className="dashboard-main">
          <Routes>
            <Route path="kb" element={<KBView />} />
            <Route path="docs" element={<DocsView />} />
            <Route path="tickets" element={<TicketsView />} />
            <Route path="" element={<KBView />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
