import chalk from 'chalk'
import fs from 'fs'
import Asker from 'inquirer'
import { questions } from './questions'

const checkPublishMethod = async (): Promise<string> => {
  const packageJson = JSON.parse(fs.readFileSync('package.json').toString())
  const versionPongOptions = packageJson['version-pong']
  if (
    !versionPongOptions ||
    !versionPongOptions.method ||
    typeof versionPongOptions.method !== 'string'
  ) {
    console.log(
      chalk.blue.bold(
        'There is no publish command specified both on package.json. Please sepcified publish command',
      ),
    )
    const answer: { publishCommand: string } = await Asker.prompt(questions)
    packageJson['version-pong'] = Object.assign({}, versionPongOptions, {
      method: answer.publishCommand,
    })
    const stringifyResult = JSON.stringify(packageJson, null, '  ')
    fs.writeFileSync('package.json', stringifyResult)
    return answer.publishCommand
  }
  return versionPongOptions.method
}

export default checkPublishMethod
