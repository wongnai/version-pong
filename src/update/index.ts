import isNil from 'lodash/isNil'
import omitBy from 'lodash/omitBy'
import Spinner from 'ora'
import standardVersion from 'standard-version'
import { PublishLevel } from 'types'
import bumpBetaVersion from './bumpBetaVersion'
import watchPeerDependencies from './watchPeerDependencies'

const updatePackageJson = async (
  publishLevel: PublishLevel,
  tagPrefix?: string,
) => {
  try {
    const spinner = Spinner('Tagging Package Version...').start()
    const prefix = tagPrefix && `${tagPrefix}@`
    const prefixObj = omitBy({ tagPrefix: prefix }, isNil)
    await watchPeerDependencies()
    switch (publishLevel) {
      case PublishLevel.BETA:
        await bumpBetaVersion(prefixObj)
        break
      case PublishLevel.PATCH:
        await standardVersion({
          releaseAs: PublishLevel.PATCH,
          silent: true,
          ...prefixObj,
        })
        break
      case PublishLevel.MINOR:
        await standardVersion({
          releaseAs: PublishLevel.MINOR,
          silent: true,
          ...prefixObj,
        })
        break
      case PublishLevel.MAJOR:
        await standardVersion({
          releaseAs: PublishLevel.MAJOR,
          silent: true,
          ...prefixObj,
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
