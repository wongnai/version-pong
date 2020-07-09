import { PublishLevel } from 'types'

export const DEFAULT_PUBLISH_COMMAND = 'npm publish'

export const PublishBranch = {
  [PublishLevel.BETA]: 'dev',
  [PublishLevel.MINOR]: 'master',
  [PublishLevel.MAJOR]: 'master',
}

export const GIT_MIN_VERSION = '2.2.3'
