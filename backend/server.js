import express from 'express'
import cors from 'cors'
import sqlite3 from 'sqlite3'
import fs from 'fs'
import path from 'path'
import { spawnSync } from 'child_process'
import { fileURLToPath } from 'url'
import 'dotenv/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'database.sqlite')
const ADMIN_PIN = process.env.ADMIN_PIN || '1234'
const distPath = path.join(__dirname, '../dist')

const ensureFrontendBuild = () => {
  const indexPath = path.join(distPath, 'index.html')
  if (fs.existsSync(indexPath)) return true

  console.log('Frontend build not found. Running npm run build...')
  const result = spawnSync('npm', ['run', 'build'], {
    cwd: path.join(__dirname, '..'),
    shell: process.platform === 'win32',
    stdio: 'inherit'
  })

  if (result.status !== 0) {
    console.error('Frontend build failed. Static dashboard will not be available.')
    return false
  }

  return fs.existsSync(indexPath)
}

app.use(cors())
app.use(express.json())

const normalizeLogAreaId = (log) => log.areaId || 'randuagung'

const migrateDailyLogsTable = () => {
  db.all("PRAGMA table_info(daily_logs)", [], (err, columns) => {
    if (err) {
      console.error('Error reading daily_logs schema', err.message)
      return
    }

    const hasAreaColumn = columns.some((column) => column.name === 'area_id')
    if (hasAreaColumn) return

    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS daily_logs_area (
        id TEXT PRIMARY KEY,
        area_id TEXT NOT NULL DEFAULT 'randuagung',
        date TEXT NOT NULL,
        data TEXT NOT NULL,
        UNIQUE(area_id, date)
      )`)

      db.all('SELECT * FROM daily_logs ORDER BY date ASC', [], (selectErr, rows) => {
        if (selectErr) {
          console.error('Error reading old daily_logs data', selectErr.message)
          return
        }

        const stmt = db.prepare('INSERT OR REPLACE INTO daily_logs_area (id, area_id, date, data) VALUES (?, ?, ?, ?)')
        rows.forEach((row) => {
          try {
            const log = JSON.parse(row.data)
            const areaId = normalizeLogAreaId(log)
            const nextLog = {
              ...log,
              areaId,
              id: log.id || `${areaId}-${log.date}`
            }
            stmt.run(nextLog.id, areaId, nextLog.date, JSON.stringify(nextLog))
          } catch (parseErr) {
            console.error(`Skipping invalid log ${row.id}`, parseErr.message)
          }
        })
        stmt.finalize((finalizeErr) => {
          if (finalizeErr) {
            console.error('Error finalizing migration statement', finalizeErr.message)
            return
          }

          db.run('DROP TABLE daily_logs')
          db.run('ALTER TABLE daily_logs_area RENAME TO daily_logs', (renameErr) => {
            if (renameErr) {
              console.error('Error renaming migrated daily_logs table', renameErr.message)
            } else {
              console.log('Migrated daily_logs table to area-scoped schema')
            }
          })
        })
      })
    })
  })
}

// Initialize SQLite database
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database', err.message)
  } else {
    console.log(`Connected to SQLite database at ${DB_PATH}`)
    db.run(`CREATE TABLE IF NOT EXISTS daily_logs (
      id TEXT PRIMARY KEY,
      area_id TEXT NOT NULL DEFAULT 'randuagung',
      date TEXT NOT NULL,
      data TEXT NOT NULL,
      UNIQUE(area_id, date)
    )`, (err) => {
      if (err) {
        console.error('Error creating table', err.message)
      } else {
        migrateDailyLogsTable()
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
  db.all('SELECT * FROM daily_logs ORDER BY area_id ASC, date ASC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    const logs = rows.map(row => {
      const log = JSON.parse(row.data)
      return {
        ...log,
        areaId: normalizeLogAreaId(log)
      }
    })
    res.json(logs)
  })
})

// POST /api/logs - Add or update a log
app.post('/api/logs', (req, res) => {
  const log = req.body
  if (!log.id || !log.date) {
    return res.status(400).json({ error: 'Missing id or date' })
  }

  const areaId = normalizeLogAreaId(log)
  const nextLog = {
    ...log,
    areaId,
    id: log.id || `${areaId}-${log.date}`
  }

  const stmt = db.prepare('INSERT OR REPLACE INTO daily_logs (id, area_id, date, data) VALUES (?, ?, ?, ?)')
  stmt.run([nextLog.id, areaId, nextLog.date, JSON.stringify(nextLog)], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json({ message: 'Log saved successfully', id: nextLog.id })
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
if (ensureFrontendBuild()) {
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
  console.log('Running API only. Use Vite (npm run dev) to serve the frontend.')
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`)
})
