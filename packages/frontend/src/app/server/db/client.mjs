import postgres from 'postgres'

const globalKey = '__sdsSqlClient'

export function hasDatabaseUrl(databaseUrl = process.env.DATABASE_URL) {
  return typeof databaseUrl === 'string' && databaseUrl.trim().length > 0
}

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL?.trim()

  if (!hasDatabaseUrl(databaseUrl)) {
    throw new Error('DATABASE_URL is not configured')
  }

  return databaseUrl
}

export function createSqlClient(databaseUrl = getDatabaseUrl()) {
  return postgres(databaseUrl, {
    ssl: 'require',
    max: 1,
    idle_timeout: 20,
    connect_timeout: 20,
    prepare: false,
  })
}

export function getSqlClient() {
  if (!globalThis[globalKey]) {
    globalThis[globalKey] = createSqlClient()
  }

  return globalThis[globalKey]
}

export async function closeSqlClient() {
  if (!globalThis[globalKey]) {
    return
  }

  await globalThis[globalKey].end({ timeout: 5 })
  globalThis[globalKey] = undefined
}
