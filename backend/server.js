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
const DB_DRIVER = (process.env.DB_DRIVER || 'sqlite').toLowerCase()
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'database.sqlite')
const ADMIN_PIN = process.env.ADMIN_PIN || '1234'
const distPath = path.join(__dirname, '../dist')

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })

const getSeedCandidatePaths = () =>
  [
    process.env.LEGACY_DB_PATH,
    path.join(path.dirname(DB_PATH), '../server/database.sqlite'),
    path.join(__dirname, 'database.sqlite')
  ].filter(Boolean)

const findSeedDatabasePath = () =>
  getSeedCandidatePaths().find((candidatePath) => {
    try {
      return path.resolve(candidatePath) !== path.resolve(DB_PATH) && fs.existsSync(candidatePath)
    } catch {
      return false
    }
  })

const seedDatabaseFile = () => {
  if (fs.existsSync(DB_PATH)) return

  const sourcePath = findSeedDatabasePath()

  if (!sourcePath) return

  fs.copyFileSync(sourcePath, DB_PATH)
  console.log(`Seeded SQLite database from ${sourcePath} to ${DB_PATH}`)
}

seedDatabaseFile()

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
const parseLogData = (data) => (typeof data === 'string' ? JSON.parse(data) : data)
let db
let mariaDbPool
let resolveDatabaseReady
let rejectDatabaseReady
const databaseReady = new Promise((resolve, reject) => {
  resolveDatabaseReady = resolve
  rejectDatabaseReady = reject
})

const dbRun = (sql, params = []) =>
  DB_DRIVER === 'mariadb'
    ? mariaDbPool.execute(sql, params).then(([result]) => result)
    : new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
          if (err) reject(err)
          else resolve(this)
        })
      })

const dbAll = (sql, params = []) =>
  DB_DRIVER === 'mariadb'
    ? mariaDbPool.execute(sql, params).then(([rows]) => rows)
    : new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
          if (err) reject(err)
          else resolve(rows)
        })
      })

const dbAllFromFile = (databasePath, sql, params = []) =>
  new Promise((resolve, reject) => {
    const sourceDb = new sqlite3.Database(databasePath, sqlite3.OPEN_READONLY, (openErr) => {
      if (openErr) {
        reject(openErr)
        return
      }

      sourceDb.all(sql, params, (queryErr, rows) => {
        sourceDb.close()
        if (queryErr) reject(queryErr)
        else resolve(rows)
      })
    })
  })

const createAreaScopedDailyLogsTable = () => {
  if (DB_DRIVER === 'mariadb') {
    return dbRun(`CREATE TABLE IF NOT EXISTS daily_logs (
      id VARCHAR(128) PRIMARY KEY,
      area_id VARCHAR(64) NOT NULL DEFAULT 'randuagung',
      date DATE NOT NULL,
      data JSON NOT NULL,
      UNIQUE KEY daily_logs_area_date_unique (area_id, date)
    )`)
  }

  return dbRun(`CREATE TABLE daily_logs (
    id TEXT PRIMARY KEY,
    area_id TEXT NOT NULL DEFAULT 'randuagung',
    date TEXT NOT NULL,
    data TEXT NOT NULL,
    UNIQUE(area_id, date)
  )`)
}

const ensureDailyLogsSchema = async () => {
  if (DB_DRIVER === 'mariadb') {
    await createAreaScopedDailyLogsTable()
    return
  }

  const columns = await dbAll("PRAGMA table_info(daily_logs)")

  if (!columns.length) {
    await createAreaScopedDailyLogsTable()
    return
  }

  const hasAreaColumn = columns.some((column) => column.name === 'area_id')
  if (hasAreaColumn) return

  await dbRun('DROP TABLE IF EXISTS daily_logs_area')
  await dbRun(`CREATE TABLE daily_logs_area (
    id TEXT PRIMARY KEY,
    area_id TEXT NOT NULL DEFAULT 'randuagung',
    date TEXT NOT NULL,
    data TEXT NOT NULL,
    UNIQUE(area_id, date)
  )`)

  const rows = await dbAll('SELECT * FROM daily_logs ORDER BY date ASC')
  for (const row of rows) {
    try {
      const log = JSON.parse(row.data)
      const areaId = normalizeLogAreaId(log)
      const nextLog = {
        ...log,
        areaId,
        id: log.id || `${areaId}-${log.date}`
      }
      await dbRun(
        'INSERT OR REPLACE INTO daily_logs_area (id, area_id, date, data) VALUES (?, ?, ?, ?)',
        [nextLog.id, areaId, nextLog.date, JSON.stringify(nextLog)]
      )
    } catch (parseErr) {
      console.error(`Skipping invalid log ${row.id}`, parseErr.message)
    }
  }

  await dbRun('DROP TABLE daily_logs')
  await dbRun('ALTER TABLE daily_logs_area RENAME TO daily_logs')
  console.log('Migrated daily_logs table to area-scoped schema')
}

const normalizeImportedRow = (row) => {
  const log = parseLogData(row.data)
  const areaId = row.area_id || normalizeLogAreaId(log)
  return {
    ...log,
    areaId,
    id: log.id || row.id || `${areaId}-${log.date}`
  }
}

const importSeedRowsIfEmpty = async () => {
  const [{ total }] = await dbAll('SELECT COUNT(*) AS total FROM daily_logs')
  if (Number(total) > 0) return

  const sourcePath = findSeedDatabasePath()
  if (!sourcePath) {
    console.log('SQLite database is empty and no legacy database was found to import')
    return
  }

  let sourceRows = []
  try {
    sourceRows = await dbAllFromFile(sourcePath, 'SELECT id, area_id, date, data FROM daily_logs ORDER BY date ASC')
  } catch {
    sourceRows = await dbAllFromFile(sourcePath, 'SELECT id, date, data FROM daily_logs ORDER BY date ASC')
  }

  let imported = 0
  for (const row of sourceRows) {
    try {
      const nextLog = normalizeImportedRow(row)
      const sql = DB_DRIVER === 'mariadb'
        ? `INSERT INTO daily_logs (id, area_id, date, data)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE id = VALUES(id), data = VALUES(data)`
        : 'INSERT OR REPLACE INTO daily_logs (id, area_id, date, data) VALUES (?, ?, ?, ?)'
      await dbRun(sql, [nextLog.id, nextLog.areaId, nextLog.date, JSON.stringify(nextLog)])
      imported += 1
    } catch (importErr) {
      console.error(`Skipping legacy log ${row.id}`, importErr.message)
    }
  }

  console.log(`Imported ${imported} daily_logs rows from ${sourcePath}`)
}

const logDatabaseSnapshot = async () => {
  const rows = await dbAll(
    'SELECT id, area_id, date FROM daily_logs ORDER BY date DESC, area_id ASC LIMIT 5'
  )
  const [{ total }] = await dbAll('SELECT COUNT(*) AS total FROM daily_logs')
  console.log(`${DB_DRIVER} daily_logs rows: ${total}`)
  console.log(`${DB_DRIVER} latest rows: ${JSON.stringify(rows)}`)
}

const waitForDatabase = async (req, res, next) => {
  try {
    await databaseReady
    next()
  } catch (err) {
    res.status(500).json({ error: `Database initialization failed: ${err.message}` })
  }
}

const fetchDailyLogs = async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM daily_logs ORDER BY area_id ASC, date ASC')
    const logs = rows.map(row => {
      const log = parseLogData(row.data)
      return {
        ...log,
        areaId: normalizeLogAreaId(log)
      }
    })
    res.json(logs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const initializeMariaDb = async () => {
  const mysql = await import('mysql2/promise')
  mariaDbPool = mysql.createPool({
    host: process.env.MARIADB_HOST || process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MARIADB_PORT || process.env.MYSQL_PORT || 3306),
    user: process.env.MARIADB_USER || process.env.MYSQL_USER || 'root',
    password: process.env.MARIADB_PASSWORD || process.env.MYSQL_PASSWORD || '',
    database: process.env.MARIADB_DATABASE || process.env.MYSQL_DATABASE || 'skynet',
    waitForConnections: true,
    connectionLimit: Number(process.env.MARIADB_CONNECTION_LIMIT || 10)
  })

  await mariaDbPool.query('SELECT 1')
  console.log(`Connected to MariaDB at ${process.env.MARIADB_HOST || process.env.MYSQL_HOST || 'localhost'}:${process.env.MARIADB_PORT || process.env.MYSQL_PORT || 3306}`)
  await ensureDailyLogsSchema()
  await importSeedRowsIfEmpty()
  await logDatabaseSnapshot()
}

const initializeSqlite = () => new Promise((resolve, reject) => {
  db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      reject(err)
      return
    }

    console.log(`Connected to SQLite database at ${DB_PATH}`)
    resolve()
  })
})

const initializeDatabase = async () => {
  if (DB_DRIVER === 'mariadb') {
    await initializeMariaDb()
    return
  }

  await initializeSqlite()
  await ensureDailyLogsSchema()
  await importSeedRowsIfEmpty()
  await logDatabaseSnapshot()
}

initializeDatabase()
  .then(resolveDatabaseReady)
  .catch((err) => {
  if (err) {
    console.error('Error initializing database', err.message)
    rejectDatabaseReady(err)
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
app.get('/api/logs', waitForDatabase, fetchDailyLogs)

// POST /api/logs - Add or update a log
app.post('/api/logs', waitForDatabase, async (req, res) => {
  const log = req.body
  if (!log.date) {
    return res.status(400).json({ error: 'Missing date' })
  }

  const areaId = normalizeLogAreaId(log)
  const nextLog = {
    ...log,
    areaId,
    id: log.id || `${areaId}-${log.date}`
  }

  try {
    const sql = DB_DRIVER === 'mariadb'
      ? `INSERT INTO daily_logs (id, area_id, date, data)
          VALUES (?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE id = VALUES(id), data = VALUES(data)`
      : 'INSERT OR REPLACE INTO daily_logs (id, area_id, date, data) VALUES (?, ?, ?, ?)'
    await dbRun(sql, [nextLog.id, areaId, nextLog.date, JSON.stringify(nextLog)])
    res.json({ message: 'Log saved successfully', id: nextLog.id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/logs/:id - Delete a log
app.delete('/api/logs/:id', waitForDatabase, async (req, res) => {
  const id = req.params.id
  try {
    const result = await dbRun('DELETE FROM daily_logs WHERE id = ?', [id])
    res.json({ message: 'Log deleted successfully', changes: result.changes || result.affectedRows || 0 })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
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
