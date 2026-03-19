import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadProjectEnv } from './load-env.mjs'
import { createSqlClient } from '../src/app/server/db/client.mjs'
import { runPendingMigrations } from '../src/app/server/db/migrations.mjs'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDirectory, '..')
const migrationsDirectory = path.join(projectRoot, 'db', 'migrations')

await loadProjectEnv(projectRoot)

const sql = createSqlClient()

try {
  const applied = await runPendingMigrations(sql, migrationsDirectory)

  if (applied.length === 0) {
    console.log('No pending migrations')
  } else {
    for (const filename of applied) {
      console.log(`Applied ${filename}`)
    }
  }
} finally {
  await sql.end({ timeout: 5 })
}
