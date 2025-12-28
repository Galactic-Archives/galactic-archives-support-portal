import { Routes, Route, Link, useLocation } from 'react-router-dom'
import './Dashboard.css'
import { kbApi, docsApi, ticketsApi } from '../utils/api'
import { useEffect, useState } from 'react'

function KBView() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const res = await kbApi.list()
        if (!cancelled) setArticles(res.data)
      } catch {
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

  if (loading) return <p>Loading knowledge base…</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h2>📚 Knowledge Base</h2>
      {articles.length === 0 ? (
        <p>No articles yet.</p>
      ) : (
        <ul>
          {articles.map((a) => (
            <li key={a.id}>
              <strong>{a.title}</strong> – {a.category || 'General'}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function DocsView() {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const res = await docsApi.list()
        if (!cancelled) setDocs(res.data)
      } catch {
        if (!cancelled) setError('Failed to load docs')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) return <p>Loading docs…</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h2>📖 API Documentation</h2>
      {docs.length === 0 ? (
        <p>No docs yet.</p>
      ) : (
        <ul>
          {docs.map((d) => (
            <li key={d.id}>
              <strong>{d.title}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function TicketsView() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const res = await ticketsApi.list()
        if (!cancelled) setTickets(res.data)
      } catch {
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

  if (loading) return <p>Loading tickets…</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h2>🎫 Your Tickets</h2>
      {tickets.length === 0 ? (
        <p>No tickets yet.</p>
      ) : (
        <ul>
          {tickets.map((t) => (
            <li key={t.id}>
              <strong>#{t.id}</strong> {t.subject} – <em>{t.status}</em>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function StudentDashboard() {
  const location = useLocation()
  const isActive = (path) => (location.pathname === path ? 'active' : '')

  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar">
        <nav className="dashboard-menu">
          <Link to="/student/kb" className={`menu-item ${isActive('/student/kb')}`}>
            📚 Knowledge Base
          </Link>
          <Link to="/student/api" className={`menu-item ${isActive('/student/api')}`}>
            📖 API Docs
          </Link>
          <Link to="/student/tickets" className={`menu-item ${isActive('/student/tickets')}`}>
            🎫 Tickets
          </Link>
        </nav>
      </aside>

      <main className="dashboard-content">
        <Routes>
          <Route path="/kb" element={<KBView />} />
          <Route path="/api" element={<DocsView />} />
          <Route path="/tickets" element={<TicketsView />} />
          <Route path="*" element={<KBView />} />
        </Routes>
      </main>
    </div>
  )
}
