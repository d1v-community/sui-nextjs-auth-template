import postgres from 'postgres'

const globalKey = '__sdsSqlClient'

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
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
