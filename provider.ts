import { Buffer } from "safe-buffer"
import { ChainIdentifier, WALLET_NAME } from "../../constants"
import { BigNumber } from "../helpers/numberUtils"
import { Promiseable } from "../helpers/promise"
import { AccountKey, Address } from "./chain"
import { SignOptions } from "./wallet"

export interface Transaction {
  source?: Address
  destination?: Address
  value?: BigNumber
  data?: string
}
export type TransactionId = string

export default abstract class Provider {
  abstract connect(): Promiseable<void>

  abstract disconnect(): Promiseable<void>

  abstract getAccounts(): Promiseable<AccountKey[]>

  abstract getName(): WALLET_NAME

  abstract onAccountsChange(
    handler: (accounts: AccountKey[]) => unknown,
  ): () => unknown

  abstract onChainChange(
    handler: (chainIdentifier: ChainIdentifier) => unknown,
  ): () => unknown

  abstract sign(
    message: string | Buffer,
    address: string,
    options?: SignOptions,
  ): Promiseable<string>

  abstract signTypedData(
    message: string | Buffer,
    address: string,
    options?: SignOptions,
  ): Promiseable<string>

  abstract transact(transaction: Transaction): Promiseable<TransactionId>

  abstract getChain(): Promiseable<ChainIdentifier | undefined>
}
