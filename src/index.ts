import cli from 'commander'
import { version } from '../package.json'
import { startCommand } from './start'

cli
  .version(version, '-v, --version')
  .description('Pong! NPM pacakge version before publishing')
  .arguments('<level>')
  .action(startCommand)
  .parse(process.argv)
