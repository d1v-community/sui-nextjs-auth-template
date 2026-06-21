import { getStorageEnv, hasStorageEnv } from './env'

type StorageResponse<T> = T & { success?: boolean; error?: string }

async function storageRequest<T>(path: string, init?: RequestInit): Promise<StorageResponse<T>> {
  if (!hasStorageEnv()) {
    throw new Error(
      'Storage is not configured. Set STORAGE_BASE_URL and STORAGE_API_KEY. Docs: https://storage.d1v.ai/docs'
    )
  }

  const env = getStorageEnv()
  const response = await fetch(`${env.baseUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env.apiKey}`,
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init?.headers ?? {}),
    },
  })

  const data = (await response.json().catch(() => null)) as StorageResponse<T> | null

  if (!response.ok || data?.success === false) {
    throw new Error(data?.error || `Storage request failed: ${response.status}`)
  }

  if (!data) {
    throw new Error('Storage returned an empty response.')
  }

  return data
}

export async function ensureFolder(name: string, parentId?: string | null) {
  const payload = await storageRequest<{
    folder: {
      id: string
      name: string
      parentId: string | null
    }
  }>('/api/folders', {
    method: 'POST',
    body: JSON.stringify({
      name,
      parentId: parentId ?? null,
    }),
  })

  return payload.folder
}

export async function uploadPrivateFile(params: {
  filename: string
  mimeType: string
  size: number
  folderId?: string
  file: Blob
}) {
  const init = await storageRequest<{
    sessionId: string
    fileId: string
    uploadUrl: string
  }>('/api/files/upload/init', {
    method: 'POST',
    body: JSON.stringify({
      filename: params.filename,
      size: params.size,
      mimeType: params.mimeType,
      visibility: 'private',
      folderId: params.folderId,
    }),
  })

  const uploadResponse = await fetch(init.uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': params.mimeType || 'application/octet-stream',
    },
    body: params.file,
  })

  if (!uploadResponse.ok) {
    throw new Error(`Storage direct upload failed: ${uploadResponse.status}`)
  }

  const completed = await storageRequest<{
    file: {
      id: string
      name: string
      size: number
      visibility: 'private' | 'public'
    }
  }>('/api/files/upload/complete', {
    method: 'POST',
    body: JSON.stringify({
      sessionId: init.sessionId,
    }),
  })

  return completed.file
}

export function buildPublicStorageUrl(fileId: string) {
  const env = getStorageEnv()
  if (!env.publicBaseUrl) return null
  return `${env.publicBaseUrl.replace(/\/+$/, '')}/${fileId}`
}
