import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import 'dotenv/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const DB_DRIVER = (process.env.DB_DRIVER || 'sqlite').toLowerCase()
const RAW_DB_PATH = process.env.DB_PATH || path.join('backend', 'database.sqlite')
const DB_PATH = path.isAbsolute(RAW_DB_PATH) ? RAW_DB_PATH : path.resolve(repoRoot, RAW_DB_PATH)
const AREA_ID = process.env.IMPORT_AREA_ID || 'randuagung'

const rows = [
  {
    date: '2026-04-22',
    notes: 'Penarikan Kabel Saja(lanjut tgl 23/04/26 pemasangan ODP Tim 1)',
    tim1: [0, 0],
    tim2: [0, 0],
    tim3: [0, 0],
    tim4: [0, 0]
  },
  {
    date: '2026-04-23',
    notes: 'Pemasangan Tim 1:RW 1 Randuagung,Tim 2:Randutelu,Tim3 :Kunci, Tim 4:Yonkav',
    tim1: [8, 1],
    tim2: [8, 1],
    tim3: [8, 1],
    tim4: [4, 1]
  },
  {
    date: '2026-04-24',
    notes: 'Tim1 Yonkav 3AC, TIM2 Garuda Rndu Telu',
    tim1: [10, 1],
    tim2: [7, 0],
    tim3: [8, 1],
    tim4: [0, 0]
  },
  {
    date: '2026-04-25',
    notes: 'Tim 1 Lanut Yonkav 3 AC, Randuagung Rw5, Tim2 Randu telu Toscamart, Tim3 RW 6',
    tim1: [8, 0],
    tim2: [4, 0],
    tim3: [6, 1],
    tim4: [0, 0]
  },
  {
    date: '2026-04-26',
    notes: '',
    tim1: [0, 0],
    tim2: [0, 0],
    tim3: [0, 0],
    tim4: [0, 0]
  },
  {
    date: '2026-04-27',
    notes: 'Tim 1 Randuagung RW 5, Tim 2 RW 7, Tim 3 Kunci',
    tim1: [2, 1],
    tim2: [8, 1],
    tim3: [5, 1],
    tim4: [4, 0]
  },
  {
    date: '2026-04-28',
    notes: 'Tim 1 Randuagung RW 5, Tim 2 RW 7 Gondang',
    tim1: [8, 1],
    tim2: [8, 1],
    tim3: [0, 0],
    tim4: [0, 0]
  },
  {
    date: '2026-04-29',
    notes: 'Tim 2 RW7 GONDANG gg Yudistira, tim3 RW4 RW 8',
    tim1: [0, 0],
    tim2: [4, 0],
    tim3: [9, 1],
    tim4: [8, 1]
  },
  {
    date: '2026-04-30',
    notes: 'Tim1 RW 13 Duta, Tim2 Duta Garuda Lurus',
    tim1: [8, 1],
    tim2: [7, 1],
    tim3: [5, 0],
    tim4: [8, 1]
  },
  {
    date: '2026-05-01',
    notes: '',
    tim1: [0, 0],
    tim2: [0, 0],
    tim3: [0, 0],
    tim4: [0, 0]
  },
  {
    date: '2026-05-02',
    notes: 'TIM3 DUTA Garuda Lurus',
    tim1: [0, 0],
    tim2: [0, 0],
    tim3: [7, 1],
    tim4: [0, 0]
  }
]

const toTeam = ([odp, odc]) => ({ odp, odc })

const toLog = (row) => ({
  id: `${AREA_ID}-${row.date}`,
  date: row.date,
  areaId: AREA_ID,
  tim1: toTeam(row.tim1),
  tim2: toTeam(row.tim2),
  tim3: toTeam(row.tim3),
  tim4: toTeam(row.tim4),
  tim5: { odp: 0, odc: 0 },
  notes: row.notes
})

const logs = rows.map(toLog)

const ensureSqlite = async (db) => {
  await run(db, `CREATE TABLE IF NOT EXISTS daily_logs (
    id TEXT PRIMARY KEY,
    area_id TEXT NOT NULL DEFAULT 'randuagung',
    date TEXT NOT NULL,
    data TEXT NOT NULL,
    UNIQUE(area_id, date)
  )`)
}

const run = (db, sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err)
      else resolve(this)
    })
  })

const all = (db, sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
  })

const importSqlite = async () => {
  const sqlite3 = await import('sqlite3')
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })
  const db = new sqlite3.default.Database(DB_PATH)

  try {
    await ensureSqlite(db)
    for (const log of logs) {
      await run(
        db,
        `INSERT INTO daily_logs (id, area_id, date, data)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(area_id, date) DO UPDATE SET id = excluded.id, data = excluded.data`,
        [log.id, AREA_ID, log.date, JSON.stringify(log)]
      )
    }

    const summary = await all(
      db,
      `SELECT date, data FROM daily_logs WHERE area_id = ? AND date BETWEEN ? AND ? ORDER BY date`,
      [AREA_ID, rows[0].date, rows.at(-1).date]
    )
    return summary.map(({ date, data }) => ({ date, ...JSON.parse(data) }))
  } finally {
    db.close()
  }
}

const importMariaDb = async () => {
  const mysql = await import('mysql2/promise')
  const pool = mysql.createPool({
    host: process.env.MARIADB_HOST || process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MARIADB_PORT || process.env.MYSQL_PORT || 3306),
    user: process.env.MARIADB_USER || process.env.MYSQL_USER || 'root',
    password: process.env.MARIADB_PASSWORD || process.env.MYSQL_PASSWORD || '',
    database: process.env.MARIADB_DATABASE || process.env.MYSQL_DATABASE || 'skynet',
    waitForConnections: true,
    connectionLimit: Number(process.env.MARIADB_CONNECTION_LIMIT || 10)
  })

  try {
    await pool.execute(`CREATE TABLE IF NOT EXISTS daily_logs (
      id VARCHAR(128) PRIMARY KEY,
      area_id VARCHAR(64) NOT NULL DEFAULT 'randuagung',
      date DATE NOT NULL,
      data JSON NOT NULL,
      UNIQUE KEY daily_logs_area_date_unique (area_id, date)
    )`)

    for (const log of logs) {
      await pool.execute(
        `INSERT INTO daily_logs (id, area_id, date, data)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE id = VALUES(id), data = VALUES(data)`,
        [log.id, AREA_ID, log.date, JSON.stringify(log)]
      )
    }

    const [summary] = await pool.execute(
      `SELECT DATE_FORMAT(date, '%Y-%m-%d') AS date, data
       FROM daily_logs
       WHERE area_id = ? AND date BETWEEN ? AND ?
       ORDER BY date`,
      [AREA_ID, rows[0].date, rows.at(-1).date]
    )
    return summary.map(({ date, data }) => ({ date, ...(typeof data === 'string' ? JSON.parse(data) : data) }))
  } finally {
    await pool.end()
  }
}

const summarize = (importedLogs) => {
  const totals = importedLogs.reduce(
    (acc, log) => {
      for (const key of ['tim1', 'tim2', 'tim3', 'tim4']) {
        acc.odp += Number(log[key]?.odp) || 0
        acc.odc += Number(log[key]?.odc) || 0
      }
      return acc
    },
    { odp: 0, odc: 0 }
  )

  console.log(`Imported ${importedLogs.length} ${AREA_ID} daily_logs rows into ${DB_DRIVER}.`)
  console.log(`Team 1-4 totals: ODP ${totals.odp}, ODC ${totals.odc}.`)
  console.log(`Date range: ${rows[0].date} to ${rows.at(-1).date}.`)
}

try {
  const importedLogs = DB_DRIVER === 'mariadb'
    ? await importMariaDb()
    : await importSqlite()
  summarize(importedLogs)
} catch (err) {
  const detail = [
    err.message,
    err.code,
    err.errno,
    err.sqlMessage,
    err.cause?.message,
    err.cause?.code
  ].filter(Boolean).join(' | ')
  console.error(`Import failed: ${detail || String(err)}`)
  process.exit(1)
}
