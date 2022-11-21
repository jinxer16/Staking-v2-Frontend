import { useEffect } from 'react'
import useAuth from 'hooks/useAuth'
import { localStorageKey } from 'config'
import { ConnectorNames } from 'config/types'



const _activeChainListener = async () =>
  new Promise<void>((resolve) =>
    Object.defineProperty(window, 'ActiveChain', {
      get() {
        return this.network
      },
      set(network) {
        this.network = network

        resolve()
      },
    }),
  )

const useEagerConnect = (chainId: number) => {
  const { login } = useAuth()

  useEffect(() => {
    const connectorId = window.localStorage.getItem(localStorageKey) as ConnectorNames
    if (connectorId) {
      const isConnectorInjected = connectorId === ConnectorNames.Injected
      const activeChainDefined = Reflect.has(window, 'ActiveChain')

      if (isConnectorInjected && !activeChainDefined) {
        _activeChainListener().then(() => login(connectorId, chainId))
        return
      }

      login(ConnectorNames.Injected, chainId)
    }
  }, [login, chainId])
}

export default useEagerConnect

