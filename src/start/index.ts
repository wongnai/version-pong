import checkCommonsError from 'checkCommonsError'
import publish from 'publish'
import { PublishLevel } from 'types'
import updatePackageJson from 'update'

export const startCommand = async (
  publishLevel: string,
  commandOption?: Record<string, any>,
) => {
  const publishLevelKey = publishLevel.toLowerCase() as PublishLevel
  const updatedPublishCommand = await checkCommonsError(publishLevelKey)
  const tagPrefix = commandOption?.tagPrefix
  await updatePackageJson(publishLevelKey, tagPrefix)
  await publish(updatedPublishCommand, publishLevelKey)
}
