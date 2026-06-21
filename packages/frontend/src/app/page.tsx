import EnvironmentRequirements from './components/EnvironmentRequirements'
import GreetingForm from '~~/dapp/components/GreetingForm'
import NetworkSupportChecker from './components/NetworkSupportChecker'
import StorageProfileCard from './components/StorageProfileCard'
import { hasDatabaseUrl } from '~~/server/db/client.mjs'
import { hasStorageEnv } from '~~/server/storage/env'

export default function Home() {
  const databaseEnabled = hasDatabaseUrl()
  const storageEnabled = hasStorageEnv()

  return (
    <>
      <EnvironmentRequirements />
      <NetworkSupportChecker />
      <StorageProfileCard
        databaseEnabled={databaseEnabled}
        storageEnabled={storageEnabled}
        storageDocsUrl="https://storage.d1v.ai/docs"
      />
      <div className="justify-content flex flex-grow flex-col items-center justify-center rounded-md p-3">
        <GreetingForm />
      </div>
    </>
  )
}
