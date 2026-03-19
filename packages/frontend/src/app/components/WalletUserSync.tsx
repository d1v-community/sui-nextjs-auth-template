'use client'

import { useCurrentAccount, useCurrentWallet } from '@mysten/dapp-kit'
import { useEffect, useRef } from 'react'

const WalletUserSync = ({
  databaseEnabled,
}: {
  databaseEnabled: boolean
}) => {
  const currentAccount = useCurrentAccount()
  const { currentWallet, isConnected } = useCurrentWallet()
  const lastSyncedAddressRef = useRef<string | null>(null)

  useEffect(() => {
    if (!databaseEnabled) {
      lastSyncedAddressRef.current = null
      return
    }

    if (!isConnected || !currentAccount?.address) {
      lastSyncedAddressRef.current = null
      return
    }

    const normalizedAddress = currentAccount.address.trim().toLowerCase()

    if (lastSyncedAddressRef.current === normalizedAddress) {
      return
    }

    let aborted = false

    const syncUser = async () => {
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            walletAddress: currentAccount.address,
            walletName: currentWallet?.name ?? null,
            chain: 'sui',
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to sync wallet user: ${response.status}`)
        }

        if (!aborted) {
          lastSyncedAddressRef.current = normalizedAddress
        }
      } catch (error) {
        console.error(error)
      }
    }

    syncUser()

    return () => {
      aborted = true
    }
  }, [currentAccount?.address, currentWallet?.name, databaseEnabled, isConnected])

  return null
}

export default WalletUserSync
