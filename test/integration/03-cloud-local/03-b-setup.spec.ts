import { getFunderWalletId } from "@services/ledger/caching"

import { randomUUID } from "crypto"

import { Accounts } from "@app"
import { setUsername } from "@app/accounts"

import {
  createMandatoryUsers,
  fundWalletIdFromOnchainNoWait,
  getChainBalance,
  lnd1,
  createUserAndWalletFromUserRef,
  getAccountIdByTestUserRef,
  getDefaultWalletIdByTestUserRef,
  getAccountRecordByTestUserRef,
} from "test/helpers"

let accountRecordC: AccountRecord
let walletIdA: WalletId
let accountIdA: AccountId, accountIdB: AccountId, accountIdC: AccountId

describe("setup", () => {
  it("funds lnd1 node", async () => {
    try {
      await createMandatoryUsers()
    } catch (e: any) {
      return
    }

    const amount = 0.0005
    const { chain_balance: initialBalance } = await getChainBalance({ lnd: lnd1 })
    if (initialBalance > 80000) {
      return
    }

    // lnd1 へ BTC送金
    const funderWalletId = await getFunderWalletId()
    await fundWalletIdFromOnchainNoWait({
      walletId: funderWalletId,
      amountInBitcoin: amount,
      lnd: lnd1,
    })
  })

  it("test account", async () => {
    try {
      await createUserAndWalletFromUserRef("A")
      await createUserAndWalletFromUserRef("B")
      await createUserAndWalletFromUserRef("C")

      accountRecordC = await getAccountRecordByTestUserRef("C")

      walletIdA = await getDefaultWalletIdByTestUserRef("A")

      accountIdA = await getAccountIdByTestUserRef("A")
      accountIdB = await getAccountIdByTestUserRef("B")
      accountIdC = await getAccountIdByTestUserRef("C")

      await setUsername({ username: "userA", id: accountIdA })
      await setUsername({ username: "userB", id: accountIdB })
      await setUsername({ username: "userC", id: accountIdC })
      await Accounts.updateAccountStatus({
        id: accountIdA,
        status: "active",
        updatedByUserId: randomUUID() as UserId,
      })
      await Accounts.updateAccountStatus({
        id: accountIdB,
        status: "active",
        updatedByUserId: randomUUID() as UserId,
      })
      await Accounts.updateAccountStatus({
        id: accountIdC,
        status: "active",
        updatedByUserId: randomUUID() as UserId,
      })

    } catch (e: any) {
      expect(e.message).toContain('E11000')
    }
  })
})
