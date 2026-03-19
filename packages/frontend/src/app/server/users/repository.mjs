const SUI_WALLET_ADDRESS_PATTERN = /^0x[a-fA-F0-9]{1,64}$/

export function normalizeWalletAddress(walletAddress) {
  const normalized = walletAddress?.trim().toLowerCase()

  if (!normalized || !SUI_WALLET_ADDRESS_PATTERN.test(normalized)) {
    throw new Error('walletAddress must be a valid Sui address')
  }

  return normalized
}

export function normalizeWalletUserInput(input) {
  return {
    walletAddress: normalizeWalletAddress(input?.walletAddress ?? ''),
    walletName:
      typeof input?.walletName === 'string' && input.walletName.trim().length > 0
        ? input.walletName.trim()
        : null,
    chain:
      typeof input?.chain === 'string' && input.chain.trim().length > 0
        ? input.chain.trim()
        : 'sui',
  }
}

function mapUserRow(row) {
  return {
    id: String(row.id),
    walletAddress: row.wallet_address,
    walletName: row.wallet_name ?? row.display_name,
    chain: row.chain,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastSeenAt: row.last_seen_at,
  }
}

export async function findWalletUserByAddress(sql, walletAddress) {
  const normalizedAddress = normalizeWalletAddress(walletAddress)
  const rows = await sql`
    SELECT
      id,
      display_name,
      wallet_address,
      wallet_name,
      chain,
      created_at,
      updated_at,
      last_seen_at
    FROM users
    WHERE wallet_address = ${normalizedAddress}
    LIMIT 1
  `

  return rows[0] ? mapUserRow(rows[0]) : null
}

export async function upsertWalletUser(sql, input) {
  const payload = normalizeWalletUserInput(input)

  const rows = await sql`
    INSERT INTO users (
      id,
      username,
      display_name,
      wallet_address,
      wallet_name,
      chain,
      created_at,
      updated_at,
      last_seen_at
    )
    VALUES (
      ${payload.walletAddress},
      ${payload.walletAddress},
      ${payload.walletName},
      ${payload.walletAddress},
      ${payload.walletName},
      ${payload.chain},
      NOW(),
      NOW(),
      NOW()
    )
    ON CONFLICT (wallet_address)
    DO UPDATE SET
      username = EXCLUDED.username,
      display_name = EXCLUDED.display_name,
      wallet_name = EXCLUDED.wallet_name,
      chain = EXCLUDED.chain,
      updated_at = NOW(),
      last_seen_at = NOW()
    RETURNING
      id,
      display_name,
      wallet_address,
      wallet_name,
      chain,
      created_at,
      updated_at,
      last_seen_at
  `

  return mapUserRow(rows[0])
}
