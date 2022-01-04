import React, {
  useState,
  createContext,
  useMemo,
  useEffect,
  useCallback,
  useContext,
} from "react"
import Provider from "../lib/chain/provider"
import Wallet from "../lib/chain/wallet"
import type { ChainIdentifier } from "../lib/graphql/__generated__/announcementBannerQuery.graphql"

type WalletContext = {
  chain: ChainIdentifier | undefined
  provider: Provider | undefined
}

const DEFAULT_CONTEXT: WalletContext = {
  chain: undefined,
  provider: undefined,
}

const WalletContext = createContext(DEFAULT_CONTEXT)

type Props = {
  children: React.ReactNode
  wallet: Wallet
}

let activeChain: ChainIdentifier | undefined

export const getActiveChain = () => {
  return activeChain
}

export const WalletProvider = ({ children, wallet }: Props) => {
  const [chain, setChain] = useState<ChainIdentifier>()
  const [provider, setProvider] = useState<Provider>()

  const value = useMemo(() => ({ chain, provider }), [chain, provider])

  useEffect(() => {
    activeChain = chain
  }, [chain])

  const updateChain = useCallback(
    async (wallet: Wallet) => {
      const maybeProvider = await wallet.getProvider()
      const maybeChain = await maybeProvider?.getChain()
      setChain(maybeChain)
      setProvider(maybeProvider)
    },
    [setChain],
  )

  useEffect(() => {
    updateChain(wallet)
    const onWalletChangeUnsub = wallet.onChange(updateChain)
    return () => {
      onWalletChangeUnsub()
    }
  }, [wallet, updateChain])

  useEffect(() => {
    const onChainChangeUnsub = provider?.onChainChange(setChain)
    return () => {
      onChainChangeUnsub?.()
    }
  }, [provider])

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext)
