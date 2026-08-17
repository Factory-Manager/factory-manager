import fs from 'node:fs'
import Database from 'better-sqlite3'
import path from 'path/win32'

export function createSqliteDatabase(inboxDbPath: string): Database.Database {
  const dataDir = path.resolve('data')
  fs.mkdirSync(dataDir, { recursive: true })
  const dbPath = path.resolve(process.cwd(), inboxDbPath)
  const db = new Database(dbPath)
  db.exec(`
        CREATE TABLE IF NOT EXISTS coordinator_inbox (
        event_id TEXT PRIMARY KEY,
        topic TEXT NOT NULL,
        payload TEXT NOT NULL,
        status TEXT NOT NULL,
        attempts INTEGER NOT NULL,
        received_at TEXT NOT NULL,
        processed_at TEXT
    )`)
  return db
}
