import EnvironmentRequirements from './components/EnvironmentRequirements'
import GreetingForm from '~~/dapp/components/GreetingForm'
import NetworkSupportChecker from './components/NetworkSupportChecker'

export default function Home() {
  return (
    <>
      <EnvironmentRequirements />
      <NetworkSupportChecker />
      <div className="justify-content flex flex-grow flex-col items-center justify-center rounded-md p-3">
        <GreetingForm />
      </div>
    </>
  )
}
