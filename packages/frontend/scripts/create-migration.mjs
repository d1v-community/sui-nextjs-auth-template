import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getNextMigrationFilename } from '../src/app/server/db/migrations.mjs'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDirectory, '..')
const migrationsDirectory = path.join(projectRoot, 'db', 'migrations')
const requestedName = process.argv.slice(2).join(' ').trim()

if (!requestedName) {
  console.error('Usage: pnpm db:create-migration <name>')
  process.exit(1)
}

const filename = await getNextMigrationFilename(migrationsDirectory, requestedName)
const filePath = path.join(migrationsDirectory, filename)

await fs.writeFile(filePath, '-- Write your migration here.\n', 'utf8')

console.log(filename)
