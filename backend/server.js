import express from 'express'
import cors from 'cors'
import sqlite3 from 'sqlite3'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import 'dotenv/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'database.sqlite')
const ADMIN_PIN = process.env.ADMIN_PIN || '1234'

app.use(cors())
app.use(express.json())

// Initialize SQLite database
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database', err.message)
  } else {
    console.log(`Connected to SQLite database at ${DB_PATH}`)
    db.run(`CREATE TABLE IF NOT EXISTS daily_logs (
      id TEXT PRIMARY KEY,
      date TEXT UNIQUE,
      data TEXT NOT NULL
    )`, (err) => {
      if (err) {
        console.error('Error creating table', err.message)
      }
    })
  }
})

// ============================================
// API Routes - Must be defined BEFORE static files
// ============================================

// PIN verification endpoint
app.post('/api/verify-pin', (req, res) => {
  const { pin } = req.body
  if (!pin) {
    return res.status(400).json({ success: false, message: 'PIN diperlukan' })
  }
  
  if (pin === ADMIN_PIN) {
    res.json({ success: true, message: 'PIN diverifikasi' })
  } else {
    res.status(401).json({ success: false, message: 'PIN salah' })
  }
})

// GET /api/logs - Fetch all logs
app.get('/api/logs', (req, res) => {
  db.all('SELECT * FROM daily_logs ORDER BY date ASC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    const logs = rows.map(row => JSON.parse(row.data))
    res.json(logs)
  })
})

// POST /api/logs - Add or update a log
app.post('/api/logs', (req, res) => {
  const log = req.body
  if (!log.id || !log.date) {
    return res.status(400).json({ error: 'Missing id or date' })
  }

  const stmt = db.prepare('INSERT OR REPLACE INTO daily_logs (id, date, data) VALUES (?, ?, ?)')
  stmt.run([log.id, log.date, JSON.stringify(log)], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json({ message: 'Log saved successfully', id: log.id })
  })
  stmt.finalize()
})

// DELETE /api/logs/:id - Delete a log
app.delete('/api/logs/:id', (req, res) => {
  const id = req.params.id
  db.run('DELETE FROM daily_logs WHERE id = ?', id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json({ message: 'Log deleted successfully', changes: this.changes })
  })
})

// ============================================
// Static File Serving (for Production)
// ============================================
const distPath = path.join(__dirname, '../dist')
if (fs.existsSync(distPath)) {
  console.log(`Serving static files from ${distPath}`)
  
  // Serve static files
  app.use(express.static(distPath))
  
  // SPA fallback - serve index.html for any unmatched routes
  // Using a middleware approach instead of wildcard route for Express 5 compatibility
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'))
    } else {
      next()
    }
  })
} else {
  console.log('Running in dev mode. Use Vite (npm run dev) to serve the frontend.')
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`)
})