import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { BscConnector } from '@binance-chain/bsc-connector'
import { ethers } from 'ethers'
import getRpcUrl from './getRpcUrl'
import { ConnectorNames } from 'config/types'
import { CHAIN_CONFIG } from 'config'

const POLLING_INTERVAL = 12000

const chainIds = Object.keys(CHAIN_CONFIG).map(item => {
  return parseInt(item)
})

declare let window: any


const injected = new InjectedConnector({ supportedChainIds: chainIds })

const walletConnectRpcUrls = {
  DEFAULT_CHAIN_ID: getRpcUrl()
}

const walletconnect = new WalletConnectConnector({
  rpc: walletConnectRpcUrls,
  bridge: 'http://localhost:3000/',
  qrcode: true,
})

const bscConnector = new BscConnector({ supportedChainIds: chainIds })

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.BSC]: bscConnector,
}

export const getLibrary = (provider: any): ethers.providers.Web3Provider => {
  const library = new ethers.providers.Web3Provider(provider)
  library.pollingInterval = POLLING_INTERVAL
  return library
}

/**
 * BSC Wallet requires a different sign method
 * @see https://docs.binance.org/smart-chain/wallet/wallet_api.html#binancechainbnbsignaddress-string-message-string-promisepublickey-string-signature-string
 */
export const signMessage = async (provider: any, account: string, message: string): Promise<string> => {
  if (window.BinanceChain) {
    const { signature } = await window.BinanceChain.bnbSign(account, message)
    return signature
  }

  /**
   * Wallet Connect does not sign the message correctly unless you use their method
   * @see https://github.com/WalletConnect/walletconnect-monorepo/issues/462
   */
  if (provider.provider?.wc) {
    const wcMessage = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message))
    const signature = await provider.provider?.wc.signPersonalMessage([wcMessage, account])
    return signature
  }

  return provider.getSigner(account).signMessage(message)
}
