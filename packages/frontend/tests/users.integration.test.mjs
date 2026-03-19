import test from 'node:test'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadProjectEnv } from '../scripts/load-env.mjs'
import { createSqlClient } from '../src/app/server/db/client.mjs'
import { runPendingMigrations } from '../src/app/server/db/migrations.mjs'
import {
  findWalletUserByAddress,
  upsertWalletUser,
} from '../src/app/server/users/repository.mjs'

const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
await loadProjectEnv(projectRoot)

const databaseUrl = process.env.DATABASE_URL
const migrationsDirectory = path.join(
  projectRoot,
  'db',
  'migrations'
)

test('upsertWalletUser creates and updates a wallet user', async (t) => {
  if (!databaseUrl) {
    t.skip('DATABASE_URL is not configured')
    return
  }

  const sql = createSqlClient(databaseUrl)
  const walletAddress = `0x${crypto.randomBytes(32).toString('hex')}`

  await runPendingMigrations(sql, migrationsDirectory)

  try {
    const createdUser = await upsertWalletUser(sql, {
      walletAddress,
      walletName: 'Primary Wallet',
      chain: 'sui',
    })

    assert.equal(createdUser.walletAddress, walletAddress.toLowerCase())
    assert.equal(createdUser.walletName, 'Primary Wallet')

    const updatedUser = await upsertWalletUser(sql, {
      walletAddress,
      walletName: 'Updated Wallet',
      chain: 'sui',
    })

    assert.equal(updatedUser.id, createdUser.id)
    assert.equal(updatedUser.walletName, 'Updated Wallet')

    const fetchedUser = await findWalletUserByAddress(sql, walletAddress)

    assert.ok(fetchedUser)
    assert.equal(fetchedUser?.walletName, 'Updated Wallet')
  } finally {
    await sql`DELETE FROM users WHERE wallet_address = ${walletAddress.toLowerCase()}`
    await sql.end({ timeout: 5 })
  }
})
