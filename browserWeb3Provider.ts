import detectEthereumProvider from "@metamask/detect-provider"
import { noop } from "lodash"
import Web3 from "web3"
import { WALLET_NAME } from "../../../constants"
import Web3EvmProvider from "./web3EvmProvider"

declare global {
  interface Window {
    web3?: Web3
  }
}

export default class BrowserWeb3Provider extends Web3EvmProvider {
  web3: Web3

  constructor(web3: Web3) {
    super()
    this.web3 = web3
  }

  public static init = async () => {
    const provider = (await detectEthereumProvider()) as
      | Web3.Provider
      | undefined

    if (provider) {
      return new BrowserWeb3Provider(new Web3(provider))
    }

    const { web3 } = window
    if (web3) {
      return new BrowserWeb3Provider(new Web3(web3.currentProvider))
    }
    throw new Error("Could not find web3")
  }

  disconnect = noop

  getName = () => {
    const web3Provider = this.getWeb3Provider() as {
      isDapper?: boolean
      isMetaMask?: boolean
      isTrust?: boolean
    }
    if (web3Provider.isDapper) {
      return WALLET_NAME.Dapper
    }
    if (web3Provider.isMetaMask) {
      return WALLET_NAME.MetaMask
    }
    if (web3Provider.isTrust) {
      return WALLET_NAME.Trust
    }
    return WALLET_NAME.Native
  }
}
