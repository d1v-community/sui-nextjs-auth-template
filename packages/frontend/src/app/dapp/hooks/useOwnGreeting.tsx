import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit'
import { isValidSuiAddress, isValidSuiObjectId } from '@mysten/sui/utils'
import {
  CONTRACT_PACKAGE_ID_NOT_DEFINED,
  CONTRACT_PACKAGE_VARIABLE_NAME,
} from '~~/config/network'
import { fullStructName } from '~~/helpers/network'
import useNetworkConfig from '~~/hooks/useNetworkConfig'

const useOwnGreeting = () => {
  const currentAccount = useCurrentAccount()
  const { useNetworkVariable } = useNetworkConfig()
  const packageId = useNetworkVariable(CONTRACT_PACKAGE_VARIABLE_NAME)
  const owner = currentAccount?.address
  const isQueryEnabled =
    owner != null &&
    isValidSuiAddress(owner) &&
    packageId !== CONTRACT_PACKAGE_ID_NOT_DEFINED &&
    isValidSuiObjectId(packageId)

  return useSuiClientQuery('getOwnedObjects', {
    owner: owner as string,
    limit: 1,
    filter: {
      StructType: fullStructName(packageId, 'Greeting'),
    },
    options: {
      showContent: true,
      showDisplay: true,
    },
  }, {
    enabled: isQueryEnabled,
  })
}

export default useOwnGreeting
