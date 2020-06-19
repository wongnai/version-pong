import { PublishLevel } from 'types'

export const PublishType = {
  BETA: PublishLevel.BETA,
  MAJOR: PublishLevel.MAJOR,
  MINOR: PublishLevel.MINOR,
}

export const DEFAULT_PUBLISH_COMMAND = 'npm publish'
