import checkCommonsError from 'checkCommonsError'
import publish from 'publish'
import { PublishLevel } from 'types'
import updatePackageJson from 'update'

export const startCommand = async (publishLevel: string) => {
  const publishLevelKey = publishLevel.toLowerCase() as PublishLevel
  const updatedPublishCommand = await checkCommonsError(publishLevelKey)
  await updatePackageJson(publishLevelKey)
  await publish(updatedPublishCommand, publishLevelKey)
}
