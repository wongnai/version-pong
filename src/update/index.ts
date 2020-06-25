import Spinner from 'ora'
import standardVersion from 'standard-version'
import { PublishLevel } from 'types'
import { bumpBetaVersion } from './utils'

export const updatePackageJson = async (publishLevel: PublishLevel) => {
  const spinner = Spinner('Tagging Package Version...').start()

  try {
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
      default:
        throw new Error('Wrong Publish Level!')
    }
    spinner.succeed()
  } catch (error) {
    console.error(error)
    console.log('Tagging version failure! Please check error log')
    process.exit(1)
  }
}
