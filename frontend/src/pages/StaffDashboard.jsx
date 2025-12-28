// src/pages/StaffDashboard.jsx
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './Dashboard.css'
import { kbApi, ticketsApi, docsApi } from '../utils/api'

function StaffKB() {
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

  if (loading) return <p>Loading knowledge base…</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h2>📚 Knowledge Base (Staff)</h2>
      {articles.length === 0 ? (
        <p>No articles yet.</p>
      ) : (
        <ul>
          {articles.map((a) => (
            <li key={a.id}>
              <strong>{a.title}</strong> {a.is_published ? '(published)' : '(draft)'}
            </li>
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

  if (loading) return <p>Loading tickets…</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h2>🎫 Tickets (Mission Control)</h2>
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

function StaffDocs() {
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
      } catch (err) {
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
      <h2>📖 API Documentation (Staff)</h2>
      {docs.length === 0 ? (
        <p>No docs yet.</p>
      ) : (
        <ul>
          {docs.map((d) => (
            <li key={d.id}>
              <strong>{d.title}</strong> {d.is_published ? '(published)' : '(draft)'}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function StaffDashboard() {
  const location = useLocation()
  const isActive = (path) => (location.pathname === path ? 'active' : '')

  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar">
        <nav className="dashboard-menu">
          <Link to="/staff/kb" className={`menu-item ${isActive('/staff/kb')}`}>
            📚 Knowledge Base
          </Link>
          <Link to="/staff/tickets" className={`menu-item ${isActive('/staff/tickets')}`}>
            🎫 Tickets
          </Link>
          <Link to="/staff/docs" className={`menu-item ${isActive('/staff/docs')}`}>
            📖 API Docs
          </Link>
        </nav>
      </aside>

      <main className="dashboard-content">
        <Routes>
          <Route path="/kb" element={<StaffKB />} />
          <Route path="/tickets" element={<StaffTickets />} />
          <Route path="/docs" element={<StaffDocs />} />
          <Route path="*" element={<StaffTickets />} />
        </Routes>
      </main>
    </div>
  )
}
s