import execa from 'execa'
import Spinner from 'ora'
import { DEFAULT_PUBLISH_COMMAND } from 'pongConstants'
import { PublishLevel } from 'types'

const publish = async (
  publishCommand = DEFAULT_PUBLISH_COMMAND,
  publishLevel: PublishLevel,
) => {
  const spinner = Spinner('Publishing Package...').start()
  try {
    const isBeta = publishLevel === PublishLevel.BETA
    await execa('sh', ['-c', `${publishCommand}${isBeta ? ' --tag=beta' : ''}`])
    await execa.command(`git push --follow-tags`)
    spinner.succeed()
  } catch (error) {
    console.error(error)
    const { stdout: latestTag } = await execa.command(`git describe --tags`)
    await execa.command(`git tag -d ${latestTag}`)
    await execa.command(`git checkout HEAD^ -- package.json`)
    if (publishLevel !== PublishLevel.BETA) {
      await execa.command(`git checkout HEAD^ -- CHANGELOG.md`)
    }
    await execa.command(`git reset HEAD^ --soft`)
    console.log('Publish failure! Please check publish error')
    process.exit(1)
  }
}

export default publish
