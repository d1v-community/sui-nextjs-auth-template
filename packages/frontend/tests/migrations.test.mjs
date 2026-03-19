import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {
  formatMigrationNumber,
  getNextMigrationFilename,
  slugifyMigrationName,
} from '../src/app/server/db/migrations.mjs'

test('slugifyMigrationName normalizes names for SQL files', () => {
  assert.equal(slugifyMigrationName('Init Users Table'), 'init_users_table')
  assert.equal(slugifyMigrationName(' add-wallet user '), 'add_wallet_user')
})

test('formatMigrationNumber pads numbers to five digits', () => {
  assert.equal(formatMigrationNumber(1), '00001')
  assert.equal(formatMigrationNumber(23), '00023')
})

test('getNextMigrationFilename increments from existing files', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'sds-migrations-'))

  await fs.writeFile(path.join(directory, '00001_init.sql'), '-- init\n', 'utf8')
  await fs.writeFile(path.join(directory, '00002_add_users.sql'), '-- users\n', 'utf8')

  const nextFilename = await getNextMigrationFilename(
    directory,
    'Add Wallet Profile'
  )

  assert.equal(nextFilename, '00003_add_wallet_profile.sql')
})
