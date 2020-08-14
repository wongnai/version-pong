import isNil from 'lodash/isNil'
import omitBy from 'lodash/omitBy'
import Spinner from 'ora'
import standardVersion from 'standard-version'
import { PublishLevel } from 'types'
import bumpBetaVersion from './bumpBetaVersion'

const updatePackageJson = async (
  publishLevel: PublishLevel,
  tagPrefix?: string,
) => {
  try {
    const spinner = Spinner('Tagging Package Version...').start()
    const prefix = tagPrefix && `${tagPrefix}@`
    const prefixObj = omitBy({ tagPrefix: prefix }, isNil)
    switch (publishLevel) {
      case PublishLevel.BETA:
        await bumpBetaVersion(Spinner, tagPrefix)
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

export default updatePackageJson
