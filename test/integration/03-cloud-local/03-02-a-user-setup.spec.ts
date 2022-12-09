import { randomUUID } from "crypto"

import { Accounts } from "@app"
import { setUsername } from "@app/accounts"
import { UsernameIsImmutableError, UsernameNotAvailableError } from "@domain/accounts"
import { ValidationError } from "@domain/shared"
import { CsvWalletsExport } from "@services/ledger/csv-wallet-export"
import { AccountsRepository } from "@services/mongoose"
import { Account } from "@services/mongoose/schema"

import {
  createMandatoryUsers,
  createUserAndWalletFromUserRef,
  getAccountIdByTestUserRef,
  getDefaultWalletIdByTestUserRef,
  getAccountRecordByTestUserRef,
} from "test/helpers"

let accountRecordC: AccountRecord
let walletIdA: WalletId
let accountIdA: AccountId, accountIdB: AccountId, accountIdC: AccountId

describe("UserWallet", () => {
  it("test account", async () => {
    try {
      await createMandatoryUsers()

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
