import fs from 'node:fs/promises'
import path from 'node:path'

function applyEnvLine(line) {
  const trimmed = line.trim()

  if (!trimmed || trimmed.startsWith('#')) {
    return
  }

  const separatorIndex = trimmed.indexOf('=')

  if (separatorIndex === -1) {
    return
  }

  const key = trimmed.slice(0, separatorIndex).trim()

  if (!key) {
    return
  }

  const existingValue = process.env[key]

  if (existingValue !== undefined && existingValue !== '') {
    return
  }

  const rawValue = trimmed.slice(separatorIndex + 1).trim()
  const unquoted =
    (rawValue.startsWith('"') && rawValue.endsWith('"')) ||
    (rawValue.startsWith("'") && rawValue.endsWith("'"))
      ? rawValue.slice(1, -1)
      : rawValue

  process.env[key] = unquoted
}

export async function loadProjectEnv(projectRoot) {
  for (const filename of ['.env', '.env.local']) {
    const filePath = path.join(projectRoot, filename)

    try {
      const content = await fs.readFile(filePath, 'utf8')

      for (const line of content.split(/\r?\n/)) {
        applyEnvLine(line)
      }
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
        continue
      }

      throw error
    }
  }
}
