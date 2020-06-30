import publish from 'publish'
import { IOptions, PublishLevel } from 'types'
import { updatePackageJson } from 'update'

export const startCommand = async (publishLevel: string, options: IOptions) => {
  const publishCommand = options.publishMethod
  const publishLevelKey = publishLevel.toLowerCase() as PublishLevel
  await updatePackageJson(publishLevelKey)
  await publish(publishCommand, publishLevelKey)
}
