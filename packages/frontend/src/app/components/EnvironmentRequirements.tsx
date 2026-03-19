import { hasDatabaseUrl } from '~~/server/db/client.mjs'

const CONTRACT_ENV_VARS = [
  'NEXT_PUBLIC_LOCALNET_CONTRACT_PACKAGE_ID',
  'NEXT_PUBLIC_DEVNET_CONTRACT_PACKAGE_ID',
  'NEXT_PUBLIC_TESTNET_CONTRACT_PACKAGE_ID',
  'NEXT_PUBLIC_MAINNET_CONTRACT_PACKAGE_ID',
] as const

const CONTRACT_PLACEHOLDER = '0xNOTDEFINED'

function getConfiguredContractEnvVars() {
  return CONTRACT_ENV_VARS.filter((key) => {
    const value = process.env[key]
    return typeof value === 'string' && value.trim() !== '' && value !== CONTRACT_PLACEHOLDER
  })
}

const EnvironmentRequirements = () => {
  const configuredContractEnvVars = getConfiguredContractEnvVars()
  const databaseEnabled = hasDatabaseUrl()

  if (configuredContractEnvVars.length > 0 && databaseEnabled) {
    return null
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-3 pt-3">
      {configuredContractEnvVars.length === 0 ? (
        <div className="rounded-2xl border border-sky-300/70 bg-sky-50/90 px-4 py-3 text-sm text-sky-950 shadow-sm dark:border-sky-400/25 dark:bg-sky-950/30 dark:text-sky-100">
          <div className="font-semibold">Contract environment variables are optional</div>
          <div className="mt-1">
            This app can still deploy and open normally without any contract package
            IDs. If none of the following variables are set, on-chain greeting
            features will stay disabled until you configure one later:
          </div>
          <div className="mt-2 font-mono text-xs leading-6">
            {CONTRACT_ENV_VARS.join('\n')}
          </div>
        </div>
      ) : null}

      {!databaseEnabled ? (
        <div className="rounded-2xl border border-slate-300/70 bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-200">
          <div className="font-semibold">Database is disabled in this environment</div>
          <div className="mt-1">
            <code>DATABASE_URL</code> is empty, so wallet login will not sync users
            to the database. The frontend will still work normally.
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default EnvironmentRequirements
