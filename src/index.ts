import cli from 'commander'
import { version } from '../package.json'
import { startCommand } from './start'

cli
  .version(version, '-v, --version')
  .description('Pong! NPM package version before publishing')
  .arguments('<level>')
  .option('-t, --tagPrefix', 'tag prefix')
  .action(startCommand)
  .parse(process.argv)
