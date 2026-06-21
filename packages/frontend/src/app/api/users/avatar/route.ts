import { getSqlClient, hasDatabaseUrl } from '~~/server/db/client.mjs'
import {
  findWalletUserByAddress,
  normalizeWalletAddress,
  updateWalletUserAvatar,
} from '~~/server/users/repository.mjs'
import {
  buildPublicStorageUrl,
  ensureFolder,
  uploadPrivateFile,
} from '~~/server/storage/client'
import { getStorageEnvError, hasStorageEnv } from '~~/server/storage/env'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_FILE_SIZE = 5 * 1024 * 1024

function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, init)
}

function sanitizeFilename(filename: string) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '-')
}

export async function POST(request: Request) {
  try {
    if (!hasDatabaseUrl()) {
      return json(
        {
          success: false,
          error: 'Database is not configured. Set DATABASE_URL before enabling avatar sync.',
        },
        { status: 500 }
      )
    }

    if (!hasStorageEnv()) {
      return json({ success: false, error: getStorageEnvError() }, { status: 500 })
    }

    const formData = await request.formData()
    const walletAddressValue = formData.get('walletAddress')
    const file = formData.get('file')

    if (typeof walletAddressValue !== 'string' || !walletAddressValue.trim()) {
      return json({ success: false, error: 'walletAddress is required.' }, { status: 400 })
    }

    if (!(file instanceof File)) {
      return json({ success: false, error: 'Avatar file is required.' }, { status: 400 })
    }

    if (file.size <= 0) {
      return json({ success: false, error: 'Avatar file is empty.' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return json(
        { success: false, error: 'Avatar file must be 5MB or smaller.' },
        { status: 400 }
      )
    }

    if (!file.type.startsWith('image/')) {
      return json(
        { success: false, error: 'Avatar must be an image file.' },
        { status: 400 }
      )
    }

    const walletAddress = normalizeWalletAddress(walletAddressValue)
    const sql = getSqlClient()
    const user = await findWalletUserByAddress(sql, walletAddress)

    if (!user) {
      return json(
        { success: false, error: 'Wallet user not found. Sync the user first.' },
        { status: 404 }
      )
    }

    const rootFolder = await ensureFolder('wallet-profile-assets')
    const userFolder = await ensureFolder(walletAddress, rootFolder.id)
    const uploaded = await uploadPrivateFile({
      filename: sanitizeFilename(file.name || 'avatar'),
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
      folderId: userFolder.id,
      file,
    })

    const avatarUrl = buildPublicStorageUrl(uploaded.id) ?? uploaded.id
    const updatedUser = await updateWalletUserAvatar(sql, walletAddress, avatarUrl)

    return json(
      {
        success: true,
        avatarUrl,
        fileId: uploaded.id,
        user: updatedUser,
      },
      { status: 200 }
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to upload wallet user avatar'

    return json({ success: false, error: message }, { status: 500 })
  }
}
