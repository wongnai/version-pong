import chalk from 'chalk'
import execa from 'execa'
import Asker from 'inquirer'
import { isEmpty } from 'lodash'
import { GIT_MIN_VERSION, PublishBranch } from 'pongConstants'
import semver from 'semver'
import { PublishLevel } from 'types'

import { questions } from './questions'

const checkGitError = async (publishLevel: PublishLevel) => {
  const { stdout: rawVersion } = await execa.command('git --version')
  const gitVersion = semver.coerce(rawVersion) || '0.0.0'
  const isBelowMinimumVersion = semver.lt(gitVersion, GIT_MIN_VERSION)
  if (isBelowMinimumVersion) {
    throw new Error(
      `You need at least git version ${GIT_MIN_VERSION} to use version-pong`,
    )
  }
  const preferredBranch = PublishBranch[publishLevel]
  const { stdout: currentBranch } = await execa.command(
    `git rev-parse --abbrev-ref HEAD`,
  )
  if (currentBranch !== preferredBranch) {
    console.log(
      chalk.red.bold(
        `you are currently in branch '${currentBranch}'. The prefered branch to publish with ${publishLevel} tag is '${preferredBranch}'\n`,
      ),
    )
    const answer: { continue: boolean } = await Asker.prompt(questions)
    if (!answer.continue) {
      process.exit(1)
    }
  }
  const { stdout } = await execa.command('git status --porcelain')
  if (!isEmpty(stdout)) {
    throw Error(`some files or directories are not commited:\n${stdout}`)
  }
  await execa.command('git pull')
}

export default checkGitError
