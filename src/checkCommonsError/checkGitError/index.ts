import chalk from 'chalk'
import execa from 'execa'
import Asker from 'inquirer'
import { isEmpty } from 'lodash'
import { PublishBranch } from 'pongConstants'
import { PublishLevel } from 'types'
import { questions } from './questions'

const checkGitError = async (publishLevel: PublishLevel) => {
  const preferredBranch = PublishBranch[publishLevel]
  const { stdout: currentBranch } = await execa(
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
  const { stdout } = await execa('git status --porcelain')
  if (!isEmpty(stdout)) {
    throw Error(`some files or directories are not commited:\n${stdout}`)
  }
  await execa('git pull')
}

export default checkGitError
