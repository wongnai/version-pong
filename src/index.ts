import cli from 'commander'
import { startCommand } from 'start'
import { version } from '../package.json'

cli
  .version(version, '-v, --version')
  .description('Pong! NPM pacakge version before publishing')
  .arguments('<level>')
  .option('-pm, --publish-method [method]', 'Publish Command')
  .action(startCommand)
  .parse(process.argv)
