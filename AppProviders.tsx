import React, { useRef } from "react"
import { QueryClientProvider, QueryClient } from "react-query"
import { Hydrate } from "react-query/hydration"
import { Provider as ReactReduxProvider } from "react-redux"
import { RelayEnvironmentProvider } from "react-relay"
import { Environment } from "relay-runtime"
import { LocationContext, LocationContextProvider } from "context/location"
import { ThemeProvider } from "design-system/Context/ThemeContext"
import { MediaContextProvider } from "design-system/Media"
import { Analytics } from "lib/analytics/analytics"
import Wallet from "lib/chain/wallet"
import { GlobalStyle } from "styles/global"
import { Theme } from "styles/styled"
import store from "../store"
import { WalletProvider } from "./WalletProvider.react"

type BasePageProps<DS> = {
  dehydratedState?: DS
}

type Props<DS, PP extends BasePageProps<DS>> = {
  pageProps: PP
  children: React.ReactNode
  theme: Theme
  environment: Environment
  wallet: Wallet
  locationContext: LocationContext
}

export const AppProviders = <DS, PP extends BasePageProps<DS>>({
  pageProps,
  children,
  theme,
  environment,
  wallet,
  locationContext,
}: Props<DS, PP>) => {
  const queryClientRef = useRef<QueryClient>()
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient()
  }

  return (
    <LocationContextProvider value={locationContext}>
      <MediaContextProvider>
        <RelayEnvironmentProvider environment={environment}>
          <QueryClientProvider client={queryClientRef.current}>
            <Hydrate state={pageProps.dehydratedState}>
              <ReactReduxProvider store={store}>
                <ThemeProvider theme={theme}>
                  <GlobalStyle />
                  <Analytics />
                  <WalletProvider wallet={wallet}>{children}</WalletProvider>
                </ThemeProvider>
              </ReactReduxProvider>
            </Hydrate>
          </QueryClientProvider>
        </RelayEnvironmentProvider>
      </MediaContextProvider>
    </LocationContextProvider>
  )
}
