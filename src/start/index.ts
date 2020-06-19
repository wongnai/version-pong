import publish from 'publish'
import { IOptions } from 'types'
import { updatePackageJson } from 'update'

import { PublishType } from 'pongConstants'

export const startCommand = async (publishLevel: string, options: IOptions) => {
  const publishCommand = options.publishMethod
  const publishLevelKey = publishLevel.toUpperCase() as keyof typeof PublishType
  const publishType = PublishType[publishLevelKey]
  await updatePackageJson(publishType)
  await publish(publishCommand, publishType)
}
