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
const GRAFANA_LINKS_PATH = process.env.GRAFANA_LINKS_PATH || path.join(__dirname, 'grafana-links.json')
const PROMETHEUS_URL = (process.env.PROMETHEUS_URL || '').replace(/\/+$/, '')

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })
fs.mkdirSync(path.dirname(GRAFANA_LINKS_PATH), { recursive: true })

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
app.use(express.json({ limit: '10mb' }))

const normalizeLogAreaId = (log) => log.areaId || 'randuagung'
const parseLogData = (data) => (typeof data === 'string' ? JSON.parse(data) : data)
const defaultGrafanaLinks = () =>
  Array.from({ length: 4 }, (_, index) => ({
    id: index + 1,
    name: `Dashboard ${index + 1}`,
    url: '',
    dashboardJson: ''
  }))

const readGrafanaLinks = () => {
  try {
    if (!fs.existsSync(GRAFANA_LINKS_PATH)) return defaultGrafanaLinks()

    const links = JSON.parse(fs.readFileSync(GRAFANA_LINKS_PATH, 'utf8'))
    if (!Array.isArray(links)) return defaultGrafanaLinks()

    return defaultGrafanaLinks().map((slot, index) => {
      const stored = links[index] || {}
      return {
        id: slot.id,
        name: String(stored.name || slot.name).slice(0, 80),
        url: String(stored.url || '').trim(),
        dashboardJson: String(stored.dashboardJson || '').trim()
      }
    })
  } catch (err) {
    console.error('Failed to read Grafana links', err.message)
    return defaultGrafanaLinks()
  }
}

const writeGrafanaLinks = (links) => {
  const normalized = defaultGrafanaLinks().map((slot, index) => {
    const source = links[index] || {}
    return {
      id: slot.id,
      name: String(source.name || slot.name).slice(0, 80),
      url: String(source.url || '').trim(),
      dashboardJson: String(source.dashboardJson || '').trim()
    }
  })

  fs.writeFileSync(GRAFANA_LINKS_PATH, JSON.stringify(normalized, null, 2))
  return normalized
}

const summarizeGrafanaLink = (link) => ({
  id: link.id,
  name: link.name,
  url: link.url
})

const parseGrafanaUrl = (rawUrl) => {
  const parsed = new URL(rawUrl)
  const parts = parsed.pathname.split('/').filter(Boolean)
  const publicIndex = parts.indexOf('public-dashboards')
  const dashboardIndex = parts.indexOf('d')

  return {
    origin: parsed.origin,
    href: parsed.href,
    accessToken: publicIndex >= 0 ? parts[publicIndex + 1] : null,
    dashboardUid: dashboardIndex >= 0 ? parts[dashboardIndex + 1] : null
  }
}

const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      accept: 'application/json',
      ...(options.body ? { 'content-type': 'application/json' } : {}),
      ...(options.headers || {})
    }
  })
  const text = await response.text()
  let payload = null

  try {
    payload = text ? JSON.parse(text) : null
  } catch {
    payload = { raw: text.slice(0, 500) }
  }

  if (!response.ok) {
    const message = payload?.message || payload?.error || response.statusText
    throw new Error(`${response.status} ${message}`)
  }

  return payload
}

const normalizeDashboardPayload = (payload) => payload?.dashboard || payload?.spec || payload

const getDashboardFromGrafanaLink = async (link) => {
  if (link.dashboardJson?.trim()) {
    return {
      parsed: link.url ? parseGrafanaUrl(link.url) : { origin: '', href: '', accessToken: null, dashboardUid: null },
      dashboard: normalizeDashboardPayload(JSON.parse(link.dashboardJson))
    }
  }

  const parsed = parseGrafanaUrl(link.url)

  if (parsed.href.endsWith('.json')) {
    return {
      parsed,
      dashboard: normalizeDashboardPayload(await fetchJson(parsed.href))
    }
  }

  if (parsed.accessToken) {
    const payload = await fetchJson(`${parsed.origin}/api/public/dashboards/${parsed.accessToken}`)
    return {
      parsed,
      dashboard: normalizeDashboardPayload(payload)
    }
  }

  if (parsed.dashboardUid) {
    const payload = await fetchJson(`${parsed.origin}/api/dashboards/uid/${parsed.dashboardUid}`)
    return {
      parsed,
      dashboard: normalizeDashboardPayload(payload)
    }
  }

  throw new Error('URL bukan public dashboard Grafana atau dashboard JSON')
}

const relativeTimeToMs = (value, now = Date.now()) => {
  if (!value || value === 'now') return now
  if (typeof value === 'number') return value
  if (/^\d+$/.test(value)) return Number(value)

  const match = String(value).match(/^now-(\d+)([mhdw])$/)
  if (!match) {
    const parsed = Date.parse(value)
    return Number.isNaN(parsed) ? now : parsed
  }

  const amount = Number(match[1])
  const units = {
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    w: 7 * 24 * 60 * 60 * 1000
  }

  return now - amount * units[match[2]]
}

const buildQueryPayload = (dashboard, panel, range) => {
  const now = Date.now()
  const fromMs = relativeTimeToMs(range?.from || dashboard?.time?.from || 'now-6h', now)
  const toMs = relativeTimeToMs(range?.to || dashboard?.time?.to || 'now', now)
  const intervalMs = Math.max(Math.round((toMs - fromMs) / 900), 1000)
  const queries = (panel.targets || [])
    .filter((target) => !target.hide && target.expr)
    .map((target) => ({
      ...target,
      datasource: target.datasource || panel.datasource,
      intervalMs,
      maxDataPoints: 900
    }))

  return {
    dashboardUID: dashboard.uid,
    panelId: panel.id,
    range: {
      from: new Date(fromMs).toISOString(),
      to: new Date(toMs).toISOString(),
      raw: {
        from: range?.from || dashboard?.time?.from || 'now-6h',
        to: range?.to || dashboard?.time?.to || 'now'
      }
    },
    from: String(fromMs),
    to: String(toMs),
    interval: `${Math.round(intervalMs / 1000)}s`,
    intervalMs,
    maxDataPoints: 900,
    requestId: `panel-${panel.id}`,
    timezone: dashboard.timezone || 'browser',
    queries
  }
}

const formatPrometheusLegend = (legendFormat, metric = {}) => {
  if (legendFormat) {
    return legendFormat.replace(/\{\{\s*([^}\s]+)\s*\}\}/g, (_, key) => metric[key] || '')
  }

  const labels = Object.entries(metric)
    .filter(([key]) => key !== '__name__')
    .map(([key, value]) => `${key}="${value}"`)

  return metric.__name__
    ? `${metric.__name__}${labels.length ? `{${labels.join(',')}}` : ''}`
    : labels.join(', ') || 'Series'
}

const queryPrometheusPanelData = async (payload) => {
  if (!PROMETHEUS_URL) {
    return {
      payload: null,
      error: 'PROMETHEUS_URL belum diset di environment backend'
    }
  }

  const results = {}
  const start = Math.floor(new Date(payload.range.from).getTime() / 1000)
  const end = Math.floor(new Date(payload.range.to).getTime() / 1000)
  const step = Math.max(Math.round(payload.intervalMs / 1000), 1)

  for (const query of payload.queries) {
    const url = new URL(`${PROMETHEUS_URL}/api/v1/query_range`)
    url.searchParams.set('query', query.expr)
    url.searchParams.set('start', String(start))
    url.searchParams.set('end', String(end))
    url.searchParams.set('step', String(step))

    const response = await fetchJson(url.href)
    const series = (response?.data?.result || []).map((item) => ({
      name: formatPrometheusLegend(query.legendFormat, item.metric),
      datapoints: (item.values || []).map(([time, value]) => [Number(value), Number(time) * 1000])
    }))

    results[query.refId || `Q${Object.keys(results).length + 1}`] = { series }
  }

  return {
    payload: { results },
    error: null
  }
}

const queryPanelData = async (parsed, dashboard, panel, range) => {
  const payload = buildQueryPayload(dashboard, panel, range)

  if (!payload.queries.length) {
    return { payload: null, error: 'Panel tidak punya query aktif' }
  }

  if (PROMETHEUS_URL) {
    try {
      return await queryPrometheusPanelData(payload)
    } catch (err) {
      return {
        payload: null,
        error: err.message || 'Query Prometheus gagal'
      }
    }
  }

  if (!parsed.origin) {
    return {
      payload: null,
      error: 'PROMETHEUS_URL belum diset di environment backend'
    }
  }

  const endpoints = parsed.accessToken
    ? [
        `${parsed.origin}/api/public/dashboards/${parsed.accessToken}/panels/${panel.id}/query`,
        `${parsed.origin}/api/public/dashboards/${parsed.accessToken}/query`
      ]
    : [`${parsed.origin}/api/ds/query`]

  let lastError
  for (const endpoint of endpoints) {
    try {
      return {
        payload: await fetchJson(endpoint, {
          method: 'POST',
          body: JSON.stringify(payload)
        }),
        error: null
      }
    } catch (err) {
      lastError = err
    }
  }

  return {
    payload: null,
    error: lastError?.message || 'Query panel gagal'
  }
}

const normalizeTimestamp = (value) => {
  if (value == null) return null
  if (typeof value === 'string') {
    const parsed = Date.parse(value)
    return Number.isNaN(parsed) ? null : parsed
  }

  if (value > 1e15) return Math.round(value / 1e6)
  if (value > 1e12) return Math.round(value)
  if (value > 1e9) return Math.round(value * 1000)
  return null
}

const createSeriesStats = (name, points) => {
  const validPoints = points
    .map((point) => ({
      time: normalizeTimestamp(point.time),
      value: Number(point.value)
    }))
    .filter((point) => point.time && Number.isFinite(point.value))

  if (!validPoints.length) return null

  const peak = validPoints.reduce((best, point) => point.value > best.value ? point : best, validPoints[0])
  const minimum = validPoints.reduce((best, point) => point.value < best.value ? point : best, validPoints[0])
  const average = validPoints.reduce((sum, point) => sum + point.value, 0) / validPoints.length

  return {
    name,
    points: validPoints.length,
    peak,
    minimum,
    average,
    unit: 'bps',
    averageMbps: average / 1_000_000,
    peakMbps: peak.value / 1_000_000,
    minimumMbps: minimum.value / 1_000_000
  }
}

const extractFrameStats = (responsePayload) => {
  const stats = []
  const results = responsePayload?.results || responsePayload?.data?.results || {}

  for (const [refId, result] of Object.entries(results)) {
    for (const frame of result.frames || []) {
      const fields = frame.schema?.fields || []
      const values = frame.data?.values || []
      const timeIndex = fields.findIndex((field) => field.type === 'time' || /time/i.test(field.name || ''))
      const valueIndexes = fields
        .map((field, index) => ({ field, index }))
        .filter(({ field, index }) => index !== timeIndex && (field.type === 'number' || values[index]?.some((value) => Number.isFinite(Number(value)))))

      for (const { field, index } of valueIndexes) {
        const points = (values[index] || []).map((value, pointIndex) => ({
          time: values[timeIndex]?.[pointIndex],
          value
        }))
        const stat = createSeriesStats(field.config?.displayNameFromDS || field.name || refId, points)
        if (stat) stats.push(stat)
      }
    }

    for (const series of result.series || []) {
      const points = (series.datapoints || []).map(([value, time]) => ({ time, value }))
      const stat = createSeriesStats(series.name || refId, points)
      if (stat) stats.push(stat)
    }
  }

  return stats
}

const createPanelSummary = (panel, series, queryError) => {
  if (!series.length) {
    return {
      panelId: panel.id,
      title: panel.title || `Panel ${panel.id}`,
      queryError,
      series: [],
      status: queryError ? 'query_failed' : 'no_data',
      note: queryError || 'Tidak ada data time-series yang bisa dihitung'
    }
  }

  const topPeak = series.reduce((best, item) => item.peak.value > best.peak.value ? item : best, series[0])
  const avgMbps = series.reduce((sum, item) => sum + item.averageMbps, 0) / series.length
  const status = topPeak.peakMbps < 1 ? 'idle' : topPeak.minimumMbps <= 0.01 ? 'drop_seen' : 'normal'

  return {
    panelId: panel.id,
    title: panel.title || `Panel ${panel.id}`,
    queryError: null,
    series,
    status,
    note: status === 'drop_seen'
      ? 'Ada titik minimum mendekati 0 Mbps, perlu cek kemungkinan drop atau idle.'
      : status === 'idle'
        ? 'Traffic rendah selama rentang waktu ini.'
        : `Peak tertinggi ${topPeak.peakMbps.toFixed(2)} Mbps, rata-rata gabungan ${avgMbps.toFixed(2)} Mbps.`
  }
}

const analyzeGrafanaLink = async (link, range) => {
  const resultLink = summarizeGrafanaLink(link)

  if (!link.url && !link.dashboardJson?.trim()) {
    return { ...resultLink, status: 'empty', panels: [], error: 'URL/JSON belum diisi' }
  }

  try {
    const { parsed, dashboard } = await getDashboardFromGrafanaLink(link)
    const panels = (dashboard.panels || [])
      .filter((panel) => panel.type === 'timeseries' || panel.targets?.length)

    const analyzedPanels = []
    for (const panel of panels) {
      const { payload, error } = await queryPanelData(parsed, dashboard, panel, range)
      analyzedPanels.push(createPanelSummary(panel, payload ? extractFrameStats(payload) : [], error))
    }

    return {
      ...resultLink,
      status: analyzedPanels.some((panel) => panel.series.length) ? 'ok' : 'metadata_only',
      dashboardTitle: dashboard.title || link.name,
      panelCount: panels.length,
      panels: analyzedPanels,
      warning: analyzedPanels.some((panel) => panel.series.length)
        ? null
        : 'Dashboard terbaca, tapi data panel tidak bisa di-query tanpa akses publik/API.'
    }
  } catch (err) {
    return {
      ...resultLink,
      status: 'failed',
      panels: [],
      error: err.message
    }
  }
}

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

// GET /api/grafana-links - Fetch saved public Grafana dashboard links
app.get('/api/grafana-links', (req, res) => {
  res.json(readGrafanaLinks())
})

// POST /api/grafana-links - Save up to 4 public Grafana dashboard links
app.post('/api/grafana-links', (req, res) => {
  try {
    res.json(writeGrafanaLinks(req.body.links || []))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/grafana-analyze - Analyze traffic stats from saved/public Grafana dashboards
app.post('/api/grafana-analyze', async (req, res) => {
  const links = Array.isArray(req.body.links) ? req.body.links : readGrafanaLinks()
  const range = req.body.range || { from: 'now-6h', to: 'now' }

  try {
    const results = []
    for (const link of writeGrafanaLinks(links)) {
      results.push(await analyzeGrafanaLink(link, range))
    }

    res.json({
      analyzedAt: new Date().toISOString(),
      range,
      results
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

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
