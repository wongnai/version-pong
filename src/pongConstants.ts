import { PublishLevel } from 'types'

export const DEFAULT_PUBLISH_COMMAND = 'npm publish'

export const PublishBranch = {
  [PublishLevel.BETA]: 'dev',
  [PublishLevel.MINOR]: 'master',
  [PublishLevel.MAJOR]: 'master',
}
