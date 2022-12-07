import { getColdStorageConfig } from "@config"
import { btc2sat } from "@domain/bitcoin"
import { getFunderWalletId } from "@services/ledger/caching"

import {
  bitcoindClient,
  createColdStorageWallet,
  createMandatoryUsers,
  fundWalletIdFromOnchainNoWait,
  getChainBalance,
  lnd1,
} from "test/helpers"

beforeAll(async () => {
  await createMandatoryUsers()
})

describe("Bitcoind", () => {
  it("create cold wallet", async () => {
    const { onChainWallet: walletName } = getColdStorageConfig()
    const walletsBefore = await bitcoindClient.listWallets()
    if (walletsBefore.includes(walletName)) {
      console.log('SKIP: have wallet: specter/coldstorage')
      return
    }
    const { name } = await createColdStorageWallet(walletName)
    expect(name).toBe(walletName)
    const wallets = await bitcoindClient.listWallets()
    expect(wallets).toContain(walletName)
  })

  it("create outside wallet", async () => {
    const walletName = "outside"
    const walletsBefore = await bitcoindClient.listWallets()
    if (walletsBefore.includes(walletName)) {
      console.log('SKIP: have wallet: outside')
      return
    }
    const { name } = await bitcoindClient.createWallet({ walletName })
    expect(name).toBe(walletName)
    const wallets = await bitcoindClient.listWallets()
    expect(wallets).toContain(walletName)
  })

  it("funds lnd1 node", async () => {
    const amount = 0.0005
    const { chain_balance: initialBalance } = await getChainBalance({ lnd: lnd1 })
    console.log(`balance: ${initialBalance}`)
    if (initialBalance > 80000) {
      console.log('SKIP: have balance: lnd1')
      return
    }
    const sats = initialBalance + btc2sat(amount)

    // lnd1 へ BTC送金
    const funderWalletId = await getFunderWalletId()
    await fundWalletIdFromOnchainNoWait({
      walletId: funderWalletId,
      amountInBitcoin: amount,
      lnd: lnd1,
    })
  })
})
