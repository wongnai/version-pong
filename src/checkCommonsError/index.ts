import { PublishLevel } from 'types'
import checkGitError from './checkGitError'
import checkPublishMethod from './checkPublishMethod'

const checkCommonsError = async (publishLevel: PublishLevel) => {
  try {
    const isPublishLevelExist = Object.values(PublishLevel).includes(
      publishLevel,
    )
    if (!isPublishLevelExist) {
      throw new Error('Wrong Publish Level!')
    }
    await checkGitError(publishLevel)
    return checkPublishMethod()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export default checkCommonsError
