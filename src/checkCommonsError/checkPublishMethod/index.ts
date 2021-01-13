import chalk from 'chalk'
import fs from 'fs'
import Asker from 'inquirer'
import getPackageJsonFromFile from 'utils/getPackageJsonFromFile'
import writePackageJsonFile from 'utils/writePackageJsonFile'
import { questions } from './questions'

const checkPublishMethod = async (): Promise<string> => {
  const packageJson = getPackageJsonFromFile()
  const versionPongOptions = packageJson['version-pong']
  if (
    !versionPongOptions ||
    !versionPongOptions.method ||
    typeof versionPongOptions.method !== 'string'
  ) {
    console.log(
      chalk.blue.bold(
        'There is no publish command specified both on package.json. Please specify publish command',
      ),
    )
    const answer: { publishCommand: string } = await Asker.prompt(questions)
    packageJson['version-pong'] = Object.assign({}, versionPongOptions, {
      method: answer.publishCommand,
    })
    writePackageJsonFile(packageJson)
    return answer.publishCommand
  }
  return versionPongOptions.method
}

export default checkPublishMethod
