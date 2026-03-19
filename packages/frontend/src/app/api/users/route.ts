import { getSqlClient } from '~~/server/db/client.mjs'
import {
  findWalletUserByAddress,
  upsertWalletUser,
} from '~~/server/users/repository.mjs'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, init)
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('walletAddress')

    if (!walletAddress) {
      return json(
        { error: 'walletAddress query param is required' },
        { status: 400 }
      )
    }

    const user = await findWalletUserByAddress(getSqlClient(), walletAddress)

    return json({ user })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch user'

    return json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const user = await upsertWalletUser(getSqlClient(), payload)

    return json({ user }, { status: 200 })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to upsert user'
    const status =
      error instanceof Error &&
      error.message === 'walletAddress must be a valid Sui address'
        ? 400
        : 500

    return json({ error: message }, { status })
  }
}
