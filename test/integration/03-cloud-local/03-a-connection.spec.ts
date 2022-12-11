import { redis } from "@services/redis"
import { User } from "@services/mongoose/schema"

import { IdentityRepository } from "@services/kratos"

import {
  lnd1,
  lnd2,
  getWalletInfo,
  bitcoindClient,
} from "test/helpers"

it("connects to bitcoind", async () => {
  const { chain } = await bitcoindClient.getBlockchainInfo()
  expect(chain).toEqual("signet")
})

describe("connects to lnds", () => {
  const lnds = [lnd1, lnd2]
  for (const item in lnds) {
    it(`connects to lnd${+item + 1}`, async () => {
      const { public_key } = await getWalletInfo({ lnd: lnds[item] })
      expect(public_key.length).toBe(64 + 2)
    })
  }
})

it("connects to mongodb", async () => {
  const users = await User.find()
  expect(users).toBeInstanceOf(Array)
})

it("connects to redis", async () => {
  const value = "value"
  await redis.set("key", value)
  const result = await redis.get("key")
  expect(result).toBe(value)
})

it("connects to kratos", async () => {
  const users = await IdentityRepository().listIdentities()
  expect(users).not.toBeInstanceOf(Error)
  expect(Array.isArray(users)).toBe(true)
})
