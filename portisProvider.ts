import type TPortis from "@portis/web3"
import Web3 from "web3"
import {
  CHAIN_IDENTIFIER_ENUM_MAPPING,
  PORTIS_API_KEY,
  WALLET_NAME,
} from "../../../constants"
import Ethereum from "../networks/ethereum"
import Web3EvmProvider from "./web3EvmProvider"

class PortisProvider extends Web3EvmProvider {
  portis: TPortis
  web3: Web3

  constructor(Portis: typeof TPortis) {
    super()
    const chainName = Ethereum.getChainName()
    const chain =
      chainName === "ETHEREUM"
        ? "mainnet"
        : chainName === "MUMBAI"
        ? "maticMumbai"
        : CHAIN_IDENTIFIER_ENUM_MAPPING[chainName]
    this.portis = new Portis(PORTIS_API_KEY, chain)
    this.web3 = new Web3(this.portis.provider as Web3.Provider)
  }

  connect = async () => {
    await this.getAccounts()
    await super.connect()
  }

  disconnect = async () => {
    await this.portis.logout()
  }

  getName = () => {
    return WALLET_NAME.Portis
  }
}

export const createPortisProvider = async (): Promise<PortisProvider> => {
  const Portis = (await import("@portis/web3")).default
  return new PortisProvider(Portis)
}
