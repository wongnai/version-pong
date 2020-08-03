import checkCommonsError from 'checkCommonsError'
import publish from 'publish'
import { PublishLevel } from 'types'
import updatePackageJson from 'update'

export const startCommand = async (
  publishLevel: string,
  cmdObj?: Record<string, any>,
) => {
  const publishLevelKey = publishLevel.toLowerCase() as PublishLevel
  const updatedPublishCommand = await checkCommonsError(publishLevelKey)
  const tagPrefix = cmdObj?.tagPrefix
  await updatePackageJson(publishLevelKey, tagPrefix)
  await publish(updatedPublishCommand, publishLevelKey)
}
