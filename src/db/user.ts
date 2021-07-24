import { User } from "../schema"
import { NotFoundError } from "../error"
import { baseLogger } from "../logger"
import { caseInsensitiveRegex } from "../utils"

const logger = baseLogger.child({ module: "admin" })

export async function usernameExists({ username }): Promise<boolean> {
  return Boolean(await User.findOne({ username: caseInsensitiveRegex(username) }))
}

export const updateUserLevel = async ({ uid, level }) => {
  const user = await User.findOne({ _id: uid })

  user.level = level
  await user.save()
  return user
}

export const updateUserAccountStatus = async ({ uid, status }) => {
  const user = await User.findOne({ _id: uid })

  user.status = status
  await user.save()
  return user
}

export const updateMerchantMapInfo = async ({ username, latitude, longitude, title }) => {
  const user = await User.getUserByUsername(username)

  if (!user) {
    throw new NotFoundError(`The user ${username} does not exist`, { logger })
  }

  user.coordinate = {
    latitude,
    longitude,
  }

  user.title = title
  await user.save()
  return user
}