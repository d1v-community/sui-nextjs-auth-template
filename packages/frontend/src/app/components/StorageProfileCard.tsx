'use client'

import { useCurrentAccount } from '@mysten/dapp-kit'
import { useEffect, useRef, useState } from 'react'

type WalletUser = {
  id: string
  walletAddress: string
  walletName: string | null
  avatarUrl?: string | null
}

type StorageProfileCardProps = {
  databaseEnabled: boolean
  storageEnabled: boolean
  storageDocsUrl: string
}

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export default function StorageProfileCard({
  databaseEnabled,
  storageEnabled,
  storageDocsUrl,
}: StorageProfileCardProps) {
  const currentAccount = useCurrentAccount()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [user, setUser] = useState<WalletUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const walletAddress = currentAccount?.address
    if (!walletAddress || !databaseEnabled) {
      setUser(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setError('')

    fetch(`/api/users?walletAddress=${encodeURIComponent(walletAddress)}`)
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data?.error || 'Failed to load wallet user.')
        }
        if (!cancelled) {
          setUser(data?.user ?? null)
        }
      })
      .catch((fetchError) => {
        if (!cancelled) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : 'Failed to load wallet user.'
          )
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [currentAccount?.address, databaseEnabled])

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !currentAccount?.address) return

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('walletAddress', currentAccount.address)
      formData.append('file', file)

      const response = await fetch('/api/users/avatar', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'Failed to upload avatar.')
      }

      setUser(data.user ?? null)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Failed to upload avatar.')
    } finally {
      setUploading(false)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  if (!currentAccount) {
    return null
  }

  const label = user?.walletName || shortenAddress(currentAccount.address)
  const initials = label.slice(0, 1).toUpperCase()

  return (
    <section className="mx-auto mt-6 flex w-full max-w-3xl flex-col gap-4 rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-lg font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={`${label} avatar`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              Wallet profile
            </div>
            <div className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
              {label}
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {shortenAddress(currentAccount.address)}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={!databaseEnabled || !storageEnabled || uploading || loading}
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            {uploading ? 'Uploading...' : 'Upload file'}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <a
            href={storageDocsUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-slate-500 underline-offset-4 hover:underline dark:text-slate-400"
          >
            storage.d1v.ai docs
          </a>
        </div>
      </div>

      {!databaseEnabled ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          Database is required for wallet user sync before enabling uploads.
        </div>
      ) : null}

      {databaseEnabled && !storageEnabled ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          Storage env is missing. Set <code>STORAGE_BASE_URL</code> and <code>STORAGE_API_KEY</code>. Docs: {storageDocsUrl}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      ) : null}
    </section>
  )
}
