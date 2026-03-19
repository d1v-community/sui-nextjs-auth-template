import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

export const MIGRATION_FILE_PATTERN = /^(\d{5})_([a-z0-9][a-z0-9_-]*)\.sql$/

export function slugifyMigrationName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

export function formatMigrationNumber(value) {
  return String(value).padStart(5, '0')
}

export async function listMigrationFiles(migrationsDirectory) {
  const entries = await fs.readdir(migrationsDirectory, { withFileTypes: true })

  return entries
    .filter((entry) => entry.isFile() && MIGRATION_FILE_PATTERN.test(entry.name))
    .map((entry) => entry.name)
    .sort()
}

export async function getNextMigrationFilename(migrationsDirectory, name) {
  const slug = slugifyMigrationName(name)

  if (!slug) {
    throw new Error('Migration name must contain at least one alphanumeric character')
  }

  const migrationFiles = await listMigrationFiles(migrationsDirectory)
  const lastMigration = migrationFiles.at(-1)
  const nextNumber = lastMigration
    ? Number(lastMigration.slice(0, 5)) + 1
    : 1

  return `${formatMigrationNumber(nextNumber)}_${slug}.sql`
}

export async function readMigrationFile(migrationsDirectory, filename) {
  const fullPath = path.join(migrationsDirectory, filename)
  const sql = await fs.readFile(fullPath, 'utf8')
  const checksum = crypto.createHash('sha256').update(sql).digest('hex')

  return {
    filename,
    fullPath,
    sql,
    checksum,
  }
}

export async function ensureMigrationTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename TEXT PRIMARY KEY,
      checksum TEXT NOT NULL,
      executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
}

export async function getAppliedMigrations(sql) {
  await ensureMigrationTable(sql)

  const rows = await sql`
    SELECT filename, checksum
    FROM schema_migrations
    ORDER BY filename ASC
  `

  return new Map(rows.map((row) => [row.filename, row.checksum]))
}

export async function runPendingMigrations(sql, migrationsDirectory) {
  const appliedMigrations = await getAppliedMigrations(sql)
  const migrationFiles = await listMigrationFiles(migrationsDirectory)
  const applied = []

  for (const filename of migrationFiles) {
    const migration = await readMigrationFile(migrationsDirectory, filename)
    const appliedChecksum = appliedMigrations.get(filename)

    if (appliedChecksum) {
      if (appliedChecksum !== migration.checksum) {
        throw new Error(`Migration checksum mismatch for ${filename}`)
      }

      continue
    }

    await sql.begin(async (transaction) => {
      await transaction.unsafe(migration.sql)
      await transaction`
        INSERT INTO schema_migrations (
          filename,
          checksum
        )
        VALUES (
          ${migration.filename},
          ${migration.checksum}
        )
        ON CONFLICT (filename) DO NOTHING
      `
    })

    applied.push(filename)
  }

  return applied
}
