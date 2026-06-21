export function getStorageEnv() {
  return {
    baseUrl: process.env.STORAGE_BASE_URL?.trim() || '',
    apiKey: process.env.STORAGE_API_KEY?.trim() || '',
    publicBaseUrl: process.env.STORAGE_PUBLIC_BASE_URL?.trim() || '',
    projectId: process.env.STORAGE_PROJECT_ID?.trim() || '',
    projectEmail: process.env.STORAGE_PROJECT_EMAIL?.trim() || '',
  }
}

export function hasStorageEnv() {
  const env = getStorageEnv()
  return Boolean(env.baseUrl && env.apiKey)
}

export function getStorageEnvError() {
  if (hasStorageEnv()) return null
  return 'Storage is not configured. Set STORAGE_BASE_URL and STORAGE_API_KEY. Docs: https://storage.d1v.ai/docs'
}
