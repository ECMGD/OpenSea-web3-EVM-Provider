import type TWalletConnectWeb3Provider from "@walletconnect/web3-provider"
import Web3 from "web3"
import {
  ETHEREUM_MAINNET,
  ETHEREUM_RINKEBY,
  WALLET_NAME,
} from "../../../constants"
import { NetworkId } from "../networks/ethereum"
import Web3EvmProvider from "./web3EvmProvider"

class WalletConnectProvider extends Web3EvmProvider {
  walletConnectProvider: TWalletConnectWeb3Provider
  web3: Web3

  constructor(WalletConnectWeb3Provider: typeof TWalletConnectWeb3Provider) {
    super()
    this.walletConnectProvider = new WalletConnectWeb3Provider({
      bridge: "https://opensea.bridge.walletconnect.org",
      rpc: {
        [NetworkId.ETHEREUM]: ETHEREUM_MAINNET,
        [NetworkId.RINKEBY]: ETHEREUM_RINKEBY,
        [NetworkId.POLYGON]: "https://rpc-mainnet.maticvigil.com/",
        [NetworkId.MUMBAI]: "https://rpc-mumbai.matic.today/",
      },
    })
    this.web3 = new Web3(this.walletConnectProvider as unknown as Web3.Provider)
  }

  connect = async () => {
    await this.walletConnectProvider.enable()
    await super.connect()
  }

  disconnect = async () => {
    await this.walletConnectProvider.disconnect()
  }

  getName = () => {
    return WALLET_NAME.WalletConnect
  }
}

export const createWalletConnectProvider =
  async (): Promise<WalletConnectProvider> => {
    const WalletConnectWeb3Provider = (
      await import("@walletconnect/web3-provider")
    ).default

    return new WalletConnectProvider(WalletConnectWeb3Provider)
  }
