import Spinner from 'ora'
import { PublishBranch } from 'pongConstants'
import standardVersion from 'standard-version'
import { PublishLevel } from 'types'
import bumpBetaVersion from './bumpBetaVersion'
import checkForBranchError from './checkForBranchError'

export const updatePackageJson = async (publishLevel: PublishLevel) => {
  try {
    const isPublishLevelExist = Object.values(PublishLevel).includes(
      publishLevel,
    )
    if (!isPublishLevelExist) {
      throw new Error('Wrong Publish Level!')
    }
    await checkForBranchError(publishLevel)
    const spinner = Spinner('Tagging Package Version...').start()
    switch (publishLevel) {
      case PublishLevel.BETA:
        await bumpBetaVersion(Spinner)
        break
      case PublishLevel.MINOR:
        await standardVersion({
          releaseAs: 'minor',
          silent: true,
        })
        break
      case PublishLevel.MAJOR:
        await standardVersion({
          releaseAs: 'major',
          silent: true,
        })
        break
    }
    spinner.succeed()
  } catch (error) {
    console.error(error)
    console.log('Tagging version failure! Please check error log')
    process.exit(1)
  }
}
